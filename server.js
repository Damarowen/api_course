const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const fileUpload = require('express-fileUpload');
const cookierParser = require('cookie-parser');
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const color = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
dotenv.config({ path: './config/config.env'});
const app = express();

//database connect
connectDB();


// route files
const bootcamps = require('./router/bootcamps');
const courses = require('./router/courses');
const auth = require('./router/auth');
const users = require('./router/users');
const reviews = require('./router/reviews');






// body parser
app.use(express.json());

// Cookie parser
app.use(cookierParser());

//dev logging middleware
app.use(morgan('dev'));

//set static folder for uploads
app.use(express.static(path.join(__dirname, 'public')))

//file uploading
app.use(fileUpload());

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth/', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);



app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, console.log(`server runnin on ${PORT} IN ${process.env.NODE_ENV}`.yellow.bold)
)

//handle unhandled rejection
process.on('unhandledRejection', (err,promise) => {
    console.log(`error: ${err.message}`)
    //close server
    server.close(() => process.exit(1))
})