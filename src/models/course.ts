import { number } from "joi"
import mongoose, { Schema } from "mongoose"
const CourseSchema = new Schema({
    Subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subjects"
      },
    Teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    QuantitySlot: {
        type: Number,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String
    },
    Level: {
        type: Number
    },
    Votes: {
        type: [
          { type: Number }
        ],
        default: []
    },
    QuantityLearner: {
        type: Number,
        default: 0
    }
})

const Course = mongoose.model("Course", CourseSchema)

export default Course