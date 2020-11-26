const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name']
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      role: {
          type: String,
          enum: ['user', 'publisher'],
          default: 'user'

      },
      password: {
          type: String,
          required: [true, 'please add password'],
          minlength: 6,
          selcet: false
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      createdAt: {
          type: Date,
          default: Date.now
      }

});


// ecnrpty pass using bcrypt

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})


// sign JWT and return

userSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({ id: this.id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}


// match user entered pass to hash pass in database

userSchema.methods.matchPassword = async function (enteredPass){
    return await bcrypt.compare(enteredPass, this.password);
}

module.exports = mongoose.model('User', userSchema);