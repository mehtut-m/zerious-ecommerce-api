const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Models Import
const { User } = require('../models/');

// Google Authentication Import
const { OAuth2Client, auth } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const idToken = req.body.tokenId;

    // Verify GOOGLE idToken
    const ticket = await client
      .verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      .catch((err) => {
        res.status(400).json({ message: 'invalid google token' });
        next(err);
      });

    const {
      email_verified,
      given_name,
      family_name,
      email,
      picture,
      sub: googleId,
    } = ticket.payload;

    // Check if the email is not verified
    if (!email_verified) {
      return res
        .status(400)
        .json({ message: 'Your Google account is not verified' });
    }

    const defaultUser = {
      firstName: given_name,
      lastName: family_name,
      email,
      profileImg: picture,
      googleId,
    };

    // If the email is verified create or check
    const user = await User.findOrCreate({
      where: { googleId, email },
      defaults: defaultUser,
    });

    req.user = user[0];
    next();
  } catch (err) {
    next(err);
  }
};

exports.facebookLogin = async (req, res, next) => {};
