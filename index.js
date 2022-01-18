/* eslint-disable no-console */
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const { Model } = require('objection');
const cors = require('cors');
const { User } = require('./app/models');
const jwt = require('./app/helpers/jwt');

// setup socket.io
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: [process.env.FRONT_END_URL, 'http://localhost:19006'],
    credentials: true,
  },
});

dotenv.config({ path: '.env' }); // don't move this line under routes

const routes = require('./app/routes');
const knex = require('./database/knex');
const middlewares = require('./app/http/middlewares');

// socket
const { addUser, removeUser } = require('./socket/user');
const { newFriendRequest, acceptFriendRequest } = require('./socket/friendRequest');

const { newMessage } = require('./socket/chat');

Model.knex(knex);

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(middlewares.me);

Object.keys(routes).map((route) => app.use('/', routes[route]));

app.use((req, res) => {
  res.send('Api not found');
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  const payload = jwt.parse(token);
  if (payload === false) return false;
  const userInfo = await User.query().findOne({ id: payload.userId });
  if (!userInfo) return false;
  socket.userInfo = userInfo;
  next();
});

io.on('connection', (socket) => {
  console.log('Made socket connection');

  const userInfo = socket.userInfo
  addUser(socket.id, userInfo);

  socket.on('newMessage', async (data, cb) => {
    const res = await newMessage(userInfo, data);
    cb(res.status);
    if (res.user?.socketId) {
      socket.to(res.user?.socketId).emit('newMessage', userInfo.id, res.newMessage);
    }
  });

  socket.on('disconnection', () => {
    console.log('disconnect');

    socket.on('removeUser', async () => {
      removeUser(userInfo, socket.id);
    });
  });

  // Friend Request
  socket.on('newFriendRequest', async (userReceiverId, cb) => {
    const res = await newFriendRequest(userInfo, userReceiverId);
  
    if (res.status) cb(true);
    else {
      cb(false);
    }

    if (res.user?.socketId) {
      socket.to(res.user?.socketId).emit('newFriendRequest', userInfo.id);
    }
  });

  socket.on('acceptFriendRequest', async (senderId, cb) => {
    const res = await acceptFriendRequest(userInfo, senderId);
    if (res.status) cb(true);
    else {
      cb(false);
    }

    if (res.user?.socketId) {
      socket.to(res.user?.socketId).emit('acceptFriendRequest', userInfo.id);
    }
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
