const { getAddress } = require('./addressController');

exports.getMyProfile = async (req, res, next) => {
  const { firstName, lastName, email, id, profileImg, points } = req.user;
  const address = await getAddress(id);
  console.log(address);
  res.json({
    user: { firstName, lastName, email, id, profileImg, points, address },
  });
};
