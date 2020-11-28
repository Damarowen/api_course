const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv')

// koad env vars
dotenv.config({ path: './config/config.env'});

//load models

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

// connect to DB

mongoose.connect('mongodb://localhost:/devcamper', {
	useNewUrlParser: true,
     useFindAndModify: false,
     useCreateIndex: true,
     useUnifiedTopology: true
 })
 
 
 // Read JSON files
 const bootcamps = JSON.parse(
   fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
 );

 const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);


const user = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

 // Import into DB
 const importData = async () => {
   try {
     await Bootcamp.create(bootcamps);
     await Course.create(courses);
     await User.create(user);

     console.log('Data Imported...'.green.inverse);
     process.exit();
   } catch (err) {
     console.error(err);
   }
 };
 
 // Delete data
 const deleteData = async () => {
   try {
     await Bootcamp.deleteMany();
     await Course.deleteMany();
     await User.deleteMany();

     console.log('Data Destroyed...'.red.inverse);
     process.exit();
   } catch (err) {
     console.error(err);
   }
 };
 

 // call function default node proccess
 if (process.argv[2] === 'install') {
   importData();
 } else if (process.argv[2] === 'delete') {
   deleteData();
 }
 