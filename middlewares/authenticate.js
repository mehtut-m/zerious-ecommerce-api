const jwt = require('jsonwebtoken');
const { getAddress } = require('../controllers/addressController');
const { verfiyToken } = require('../services/auth/token');
const { User } = require('../models/index');

module.exports.authenticate = async (req, res, next) => {
  // Extract token from Header
  const auth = req.header('authorization');

  if (typeof auth !== 'string' || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication failed',
    });
  }
  const bearerToken = auth.split(' ')[1];

  if (!bearerToken) {
    return res
      .status(401)
      .json({ message: 'Unauthorized Attempted : No token provided' });
  }
  try {
    // Extract payload from token if token is verified
    const payload = jwt.verify(bearerToken, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    if (!user) {
      return res.status(401).json({
        message: 'Token is invalid',
      });
    }
    // Set user info in request header
    const accountType =
      user.googleId === null && user.facebookId === null
        ? 'Zerious'
        : user.facebookId !== null
        ? 'Facebook'
        : 'Google';

    const formattedResult = JSON.stringify(user);
    const parsedUser = JSON.parse(formattedResult);

    req.user = { ...parsedUser, accountType };
    // req.user = user;
  } catch (err) {
    return res.status(401).json({
      message: 'Token is invalid',
    });
  }

  next();
};

module.exports.generateToken = async (req, res, next) => {
  if (req.user) {
    const { id, email, firstName, lastName, profileImg, googleId, facebookId } =
      req.user;
    const accountType =
      googleId === null && facebookId === null
        ? 'Zerious'
        : facebookId !== null
        ? 'Facebook'
        : 'Google';

    const address = await getAddress(id);
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.status(200).json({
      token,
      user: {
        id,
        firstName,
        lastName,
        email,
        profileImg,
        address,
        accountType,
      },
    });
  }
  res.status(401).send('You must login first');
};

module.exports.authenticateAdmin = async (req, res, next) => {
  // If user is role is not ADMIN then denied access
  if (req.user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ message: 'You do not have permission to perforom the action' });
  }
  next();
};
