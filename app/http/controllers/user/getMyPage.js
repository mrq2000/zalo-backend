const userService = require('../../services/user');
const friendService = require('../../services/friends');

async function getMyPage(req, res) {
  const userId = req.user.id;
  const responseData = await userService.getMyInformation(userId);
  const friendInfo = await friendService.getFriends(userId);

  return res.status(200).send({ ...responseData, ...friendInfo });
}

module.exports = getMyPage;
