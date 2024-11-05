import { number } from "joi"
import mongoose, { Schema } from "mongoose"
const CourseSchema = new Schema({
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects",
    required: true
  },
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
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
    type: String,
    required: true
  },
  Level: {
    type: Number,
    required: true
  },
  QuantityLearner: {
    type: Number,
    default: 0
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

const Course = mongoose.model("Course", CourseSchema)

export default Course