const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const color = require('colors')
const connectDB = require('./config/db')


dotenv.config({ path: './config/config.env'});

//database connect
connectDB();



const app = express();
const bootcamps = require('./router/bootcamps');


// body parser

app.use(express.json())

//dev logging middleware
app.use(morgan('dev'))
app.use('/api/v1/bootcamps', bootcamps);



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