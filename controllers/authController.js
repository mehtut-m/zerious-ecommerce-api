const axios = require('axios');
const bcrypt = require('bcrypt');

const {
  isEmail,
  isPasswordMatch,
  isValidName,
  checkPasswordLength,
} = require('../services/auth/inputValidator');

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

exports.facebookLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    const response = await axios
      .get(
        `https://graph.facebook.com/v12.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FB_CLIENT_ID}&client_secret=${process.env.FB_SECRET_ID}&fb_exchange_token=${accessToken}`
      )
      .catch((err) => {
        res.status(400).json({ message: 'user not found' });
      });

    // If user is not found
    if (response.status !== 200) {
      return res
        .status(400)
        .json({ message: 'user not found or error has occurred' });
    }

    //Get user info from access token
    const {
      data: {
        id: facebookId,
        first_name: firstName,
        last_name: lastName,
        email,
        picture: {
          data: { url: profileImg },
        },
      },
    } = await axios.get(
      `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${response.data.access_token}`
    );

    const defaultUser = { facebookId, firstName, lastName, email, profileImg };

    const user = await User.findOrCreate({
      where: { facebookId, email },
      defaults: defaultUser,
    });

    req.user = user[0];
    next();
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validate email
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Email is not valid' });
    }
    // Check password length or empty
    if (!checkPasswordLength(password)) {
      return res
        .status(400)
        .json({ message: 'Password must be atleast 6 characters' });
    }
    // Find user in the database
    const user = await User.findOne({ where: { email } });

    // If user is not found in database
    if (!user) {
      return res.status(400).json({ message: 'Invaild username or password' });
    }

    // Verify password
    const isPasswordVerified = await bcrypt.compare(password, user.password);

    if (!isPasswordVerified) {
      return res.status(400).json({ message: 'Invaild username or password' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    // Validate email
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Email is not valid' });
    }

    const userExist = await User.findOne({ where: { email } });

    // Check if the user with this email exist
    if (userExist) {
      return res.status(400).json({ message: 'Email has already been used' });
    }
    // Check password length or empty
    if (!checkPasswordLength(password)) {
      return res
        .status(400)
        .json({ message: 'Password must be atleast 6 characters' });
    }
    // Check if password match
    if (!isPasswordMatch(password, confirmPassword)) {
      return res
        .status(400)
        .json({ message: 'Password and confirm password does not matched' });
    }
    // Check if firstName is empty
    if (!isValidName(firstName)) {
      return res
        .status(400)
        .json({ message: 'Your firstname should not be empty' });
    }
    // Check if lastName is empty
    if (!isValidName(lastName)) {
      return res
        .status(400)
        .json({ message: 'Your lastname should not be empty' });
    }
    // Generate hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    };

    // Create user in database
    const user = await User.create(defaultUser);
    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
