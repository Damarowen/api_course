const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

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
            token
        });


}

// @desc  GET current user log in
// @route  POST /api/v1/auth/me
// @access  PRIVATE

exports.getMe = asyncHandler( async (req,res,next) =>{


const user = await User.findById(req.user.id)

res.status(200).json({
    success: true,
    data: user
})



})
