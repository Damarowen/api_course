const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc  register user
// @route  GET /api/v1/auth/register
// @access  Public


exports.register = asyncHandler ( async (req,res,next) => {

    const { name, email, role, password} = req.body;

    //create user

    const user = await User.create({
        name,
        email,
        role,
        password
    });


   res.status(200).json({ success: true})
})