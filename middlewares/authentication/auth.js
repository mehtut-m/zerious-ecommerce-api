const jwt = require('jsonwebtoken');

module.exports.generateToken = (req, res, next) => {
  if (req.user) {
    const { id, email, firstName, lastName } = req.user;
    console.log('generateToken is running');

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res
      .status(201)
      .json({ token, user: { id, firstName, lastName, email } });
  }
  res.status(401).send('You must login first');
};
