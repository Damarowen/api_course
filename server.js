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

//security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');


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

//**SECURITY */
// sanitize data
app.use(mongoSanitize());
//set secuirty header
app.use(helmet());
//prevent XSS attacks
app.use(xss());
// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 MIN
    max: 100// max 100 req per 10 min
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// enable Cross Origin Resource Sharing
app.use(cors());
//**END */


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