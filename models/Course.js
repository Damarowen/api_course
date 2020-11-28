const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add a number of week']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tuition']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add min skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvaliable: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
    

});



// THIS IS FOR ECDUCATION PURPOSE

//CONTOH STATIC CALLING IN ACTUAL MODEL

//   CourseSchema.goFish()

//METH0D IS CREATE QUERY FIRST

//   const courses = Course.find();

//   courses.goFish()

//static method to get avg of course tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    console.log('Calulating Avg cost'.blue)

    const obj = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {
                    $avg: '$tuition'
                }
            }
        }
    ]);
    try {
        //call model
       await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
        console.log(this.model('Bootcamp'))
        console.log(obj);

    } catch (err) {
        console.log(err);
    }
};


// THIS IS MIDDLEWARE
//call getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

// re calcultaed
//call getAverageCost before remove
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);

});

module.exports = mongoose.model('Course', CourseSchema);