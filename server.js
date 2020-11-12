const express = require('express');
const dotenv = require('dotenv');

const app = express();

const bootcamps = require('./router/bootcamps')

app.use('/api/v1/bootcamps', bootcamps)

dotenv.config({ path: './config/config.env'});


const PORT = process.env.PORT || 5000;

app.listen(
    PORT, console.log(`server runnin on ${PORT} IN ${process.env.NODE_ENV}`)
)