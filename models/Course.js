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
                }

            });

        module.exports = mongoose.model('Course', CourseSchema);