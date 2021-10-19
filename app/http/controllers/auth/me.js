const me = async (req, res) => {
  const responseData = {
    id: req.user.id,
    phone_number: req.user.phone_number,
    full_name: req.user.full_name,
    avatar_url: req.user.avatar_url,
    status: req.user.status,
    gender: req.user.gender,
  };

  return res.status(200).send(responseData);
};

module.exports = me;
