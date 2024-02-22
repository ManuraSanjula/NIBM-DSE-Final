const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
const Email = require('../utils/email');
const Cloth = require('../Models/ClothModel');
const errorController = require('./ErrorController');

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};


exports.conEmail = async (req, res, next) => {
  let token;
  try {
    if (!req.query.user || !req.query.userId) {
      return res.status(400).json({
        status: 'fail',
        message: "User Token or  UserId  Missing"
      });
    }
    token = req.query.user

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        status: 'fail',
        message: 'Time Expired',
      })
    }
    const currentUser = await User.findById(decoded.id);
    if (req.query.userId !== decoded.id) {
      return res.status(401).json({
        status: 'fail',
        message: 'Wrong Token',
      })
    }
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
      })
    }
    const user = await User.findByIdAndUpdate(decoded.id, { emailConfrim: true })
    return res.status(200).json({
      status: 'okay',
      user
    })

  } catch (error) {
    errorController(req, res, error)
    // if (error.message == 'jwt expired') {
    //   return res.status(401).json({
    //     status: "fail",
    //     message: "token expired",
    //   })
    // }
    // return res.status(500).json({
    //   status: "fail",
    //   message: error.message,
    // })
  }
}


const signToken = (id, type = '') => {
  if (type === 'email') {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '600s'
    });
  } else {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }
};


const createSendToken = async (user, statusCode, res,req) => {
  const token = signToken(user._id);

  if(req){
    const emailToken = signToken(user._id, 'email');
    const url = `${req.protocol}://${req.get('host')}/api/v1/user/confrimEmail?user=${emailToken}&userId=${user._id.toString()}`;
    await new Email(user, url).sendWelcome();
  }

  const cookieOptions = {
    expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 365 days in milliseconds
    httpOnly: true,
    secure: true
};

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Fill All Fields'
      })
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      photo: req.body.photo
    });
    
    if (!newUser) {
      return res.status(500).json({
        status: 'fail',
        message: "Could not create User"
      })
    }

    createSendToken(newUser, 201, res,req);
  } catch (error) {
    // if (error.code === 11000) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'User AllReady Exits given Email'
    //   })
    // }
    // return res.status(500).json({
    //   status: 'fail',
    //   message: error.message,
    // })
    errorController(req, res, error)
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: 'Please provide email and password!'
      });
    }
   
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: 'Incorrect email or password'
      });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    // return res.status(401).json({
    //   status: "fail",
    //   message: error.message,
    // });
    errorController(req, res, error)
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};


exports.addLikes = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'No User Found' });
    }
    const ClothId = req.query.ClothId;
    const Cloth = await Cloth.findById(ClothId);
    if (!Cloth) {
      return res.status(400).json({ status: 'fail', message: 'No Cloth Found give ClothId' });
    }
    if (!currentUser.Likes.includes(ClothId)) {
      currentUser.Likes.push(ClothId);
      currentUser.save({ validateBeforeSave: false });
      Cloth.likes++;
      Cloth.save({ validateBeforeSave: false });
    } else {
      currentUser.Likes.pop(ClothId);
      currentUser.save({ validateBeforeSave: false });
      Cloth.likes--;
      if (Cloth.likes < 0) {
        Cloth.likes = 0
      }
      Cloth.save({ validateBeforeSave: false });
    }

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    errorController(req, res, error)
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      })

    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
      })
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.',
      })
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    errorController(req, res, error)
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      })
    }

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    if(!req.body.email){
      return res.status(401).json({
        status: 'fail',
        message: 'Missing email address in request body',
      })
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with email address.',
      })
    }

   
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

   
    try {
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/user/resetPasswordweb/${resetToken}?token=${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        status: 'fail',
        message: 'There was an error sending the email. Try again later!',
      })
    }
  } catch (error) {
    errorController(req, res, error)
    // return res.status(500).json({
    //   status: 'fail',
    //   message: error.message,
    // })
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
   
    if(!req.body.password || !req.body.passwordConfirm){
      return res.status(401).json({
        status: 'fail',
        message: 'Missing password or confirm password in request body',
      })
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      })
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    createSendToken(user, 200, res);
  } catch (err) {
    errorController(req, res, err)
    // return res.status(500).json({
    //   status: 'fail',
    //   message: error.message,
    // })
  }
};


exports.registerEmail = async (req, res, next) => {
  try {
    if(!req.user.id)
    {
      return res.status(400).json({
        status: 'fail',
        message: 'user id not found',
      })
    }
    const user = await User.findById(req.user.id);
    const token = signToken(user._id, 'email');
    const url = `${req.protocol}://${req.get('host')}/api/v1/user/confrimEmail?user=${token}&userId=${newUser._id.toString()}`;
    await new Email(newUser, url).sendWelcome();
  } catch (error) {
    errorController(req, res, error)
    // return res.status(401).json({
    //   status: 'fail',
    //   message: error.message
    // })
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
   
    if(!req.body.password || !req.body.passwordConfirm || !req.body.passwordCurrent){
      return res.status(401).json({
        status: 'fail',
        message: 'Missing password or confirm password in request body',
      })
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your current password is wrong.'
      })
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
  
    createSendToken(user, 200, res);
  } catch (err) {
    errorController(req, res, err)
    // return res.status(401).json({
    //   status: 'fail',
    //   message: 'Cound not find User'
    // })
  }
};