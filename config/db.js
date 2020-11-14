const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect('mongodb://localhost:/devcamper', {
		useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    
    console.log(`MongoDB Connected : ${conn.connection.host}`)
}

module.exports = connectDB;