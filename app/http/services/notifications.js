const { Notification } = require('../../models');

exports.getAllNoti = async ({
  userId, count, last_id,
}) => {
  const notiQuery = Notification.query().where('owner_id', userId);

  if (last_id) {
    notiQuery.where((builder) => builder.where('id', '<', last_id));
  }
  const notifications = await notiQuery.limit(count).orderBy('id', 'desc');

  return notifications;
};
