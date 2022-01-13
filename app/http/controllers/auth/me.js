const friendsService = require('../../services/friends');

const me = async (req, res) => {
  const friends = await friendsService.getFriends(req.user.id);
  const responseData = {
    id: req.user.id,
    phonenumber: req.user.phonenumber,
    full_name: req.user.full_name,
    avatar_url: req.user.avatar_url,
    status: req.user.status,
    gender: req.user.gender,
    ...friends,
  };

  return res.status(200).send(responseData);
};

module.exports = me;
