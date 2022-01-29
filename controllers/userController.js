exports.getMyProfile = async (req, res, next) => {
  const { firstName, lastName, email, id, profileImg } = req.user;
  res.json({ user: { firstName, lastName, email, id, profileImg } });
};
