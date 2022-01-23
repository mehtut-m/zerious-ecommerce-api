exports.getMyProfile = async (req, res, next) => {
  const { firstName, lastName, profileImg } = req.user;
  res.json({ user: firstName, lastName, profileImg });
};
