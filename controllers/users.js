const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc  GET ALL USER
// @route GET /api/v1/users
// @access  Private/admin

exports.getUsers = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advanceResults);
})

// @desc  GET SINGLE USER
// @route GET /api/v1/userS/:id
// @access  Private/admin

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    })

})


// @desc  CREATE user
// @route POST /api/v1/users
// @access  Private/admin

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    })

})


// @desc  UPDATE user
// @route PUT /api/v1/users/:id
// @access  Private/admin

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({
        success: true,
        data: user
    })
})


// @desc  DELETE user
// @route DELETE /api/v1/users/:id
// @access  Private/admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
        success: true,
        data: {}
    })
})