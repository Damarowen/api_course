const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env'});

const app = express();

//route structur


app.get('/api/v1/bootcamp', (req,res) => {
    res.status(200).json({ success: true, msg: "show all bootcamps"})
})

app.post('/api/v1/bootcamp', (req,res) => {
    res.status(200).json({ success: true, msg: "created bootcamp"})
})

app.get('/api/v1/bootcamp/:id', (req,res) => {
    res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}`})
})

app.put('/api/v1/bootcamp/:id', (req,res) => {
    res.status(200).json({ success: true, msg: `edit bootcamp ${req.params.id}`})
})

app.delete('/api/v1/bootcamp/:id', (req,res) => {
    res.status(200).json({ success: true, msg: `delete bootcamp ${req.params.id}`})
})




const PORT = process.env.PORT || 5000;

app.listen(
    PORT, console.log(`server runnin on ${PORT} IN ${process.env.NODE_ENV}`)
)