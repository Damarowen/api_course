const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')

// @desc  register user
// @route  POST /api/v1/auth/register
// @access  Public


exports.register = asyncHandler(async (req, res, next) => {

    const {
        name,
        email,
        role,
        password
    } = req.body;

    //create user

    const user = await User.create({
        name,
        email,
        role,
        password
    });

    sendTokenResponse(user, 200, res);

})


// @desc  user login
// @route  POST /api/v1/auth/register
// @access  Public


exports.login = asyncHandler(async (req, res, next) => {

    const {
        email,
        password
    } = req.body;

    //validate email in password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    };

    // check for user
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user) {
        return next(new ErrorResponse('invalid credentials', 401))
    };

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('pass tidak sama', 401))
    }


    sendTokenResponse(user, 200, res);
})



// @desc  GET current user log in
// @route  POST /api/v1/auth/me
// @access  PRIVATE

exports.getMe = asyncHandler(async (req, res, next) => {


    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })

})

// @desc  forgot password
// @route  POST /api/v1/auth/forgotpassword
// @access  PRIVATE

exports.forgotPassword = asyncHandler(async (req, res, next) => {


    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) {
        return next(new ErrorResponse('User not found', 404))
    }

    // get reset token by create method in model
    const resetToken = user.getResetPasswordToken();

    // save and dont run validate
    await user.save({
        validateBeforeSave: false
    })

    // Create reset url

    const resetUrl = (`${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`);
    const message = `ini link untuk reset \n\n ${resetUrl}`;


    //send email using nodemailer
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        })

        res.status(200).json({
            success: true,
            data: "email sent"
        })
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        // save and dont run validate
        await user.save({
            validateBeforeSave: false
        })
        return next(new ErrorResponse('Email could not be sent', 500))
    }

    //below is to display user after reset
    // res.status(200).json({
    // success: true,
    // data: user
    // })

})



// @desc  RESET PASSWORD
// @route  Put /api/v1/auth/resetPassword/:resertoken
// @access  PRIVATE

exports.resetPassword = asyncHandler(async (req, res, next) => {

    // get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now()
        }
    });


    if (!user) {
        return next(new ErrorResponse('Invalid token', 400))
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenResponse(user, 200, res)

})





// @desc  update user details
// @route  PUT /api/v1/auth/updatedetails
// @access  PRIVATE

exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })

})


// @desc  update password
// @route  PUT /api/v1/auth/updatePassword
// @access  PRIVATE

exports.updatePassword = asyncHandler(async (req, res, next) => {

    // select +password mengembalikan query password
    const user = await User.findById(req.user.id).select('+password')
    console.log(req.body.currentPassword)

    //check current password from user input
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password incorect', 401))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res)
});


// @desc  log user out / clear cookies
// @route  POST /api/v1/auth/logout
// @access  PRIVATE

exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        //expires 10 second
        expires: new Date(Date.now() + 10 + 1000),
        httpOnly: true

    })

    res.status(200).json({
        success: true,
        data: {}
    })

})


//THIS IS COOKIES
// get token from model, create cookie and send roesponse
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // if (process.env.NODE_ENV === 'production') {
    // options.secure = true;
    // }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        data: user
    });
}