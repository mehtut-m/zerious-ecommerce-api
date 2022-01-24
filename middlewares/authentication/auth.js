const jwt = require('jsonwebtoken');
const { verfiyToken } = require('../../services/auth/token');
const { User } = require('../../models/index');

module.exports.authenticate = async (req, res, next) => {
  // Extract token from Header
  const bearerToken = req.header('authorization').split(' ')[1];

  if (!bearerToken) {
    return res
      .status(401)
      .json({ message: 'Unauthorized Attempted : No token provided' });
  }
  try {
    // Extract payload from token if token is verified
    const payload = jwt.verify(bearerToken, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({
        message: 'Token is invalid',
      });
    }

    // Set user info in request header
    req.user = user;
  } catch (err) {
    return res.status(401).json({
      message: 'Token is invalid',
    });
  }

  next();
};

module.exports.generateToken = (req, res, next) => {
  if (req.user) {
    const { id, email, firstName, lastName, profileImg } = req.user;

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res
      .status(201)
      .json({ token, user: { id, firstName, lastName, email, profileImg } });
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
