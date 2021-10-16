const userStatusEnum = require('../../enums/userStatus');

function auth(req, res, next) {
  if (!req.user) {
    return res.status(401).send({
      error: 'You must be logged in',
    });
  }

  if (req.user.status !== userStatusEnum.ACTIVE) {
    return res.status(401).send({
      error: 'Your account was been blocked',
    });
  }
  return next();
}

module.exports = auth;
