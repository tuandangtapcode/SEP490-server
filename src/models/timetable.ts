import mongoose from "mongoose"
const Schema = mongoose.Schema

const TimeTableSchema = new Schema({
  LearnHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearnHistorys',
    required: true
  },
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subjects',
    required: true
  },
  Document: {
    type: {
      DocPath: { type: String, required: true },
      DocName: { type: String, required: true }
    },
    default: null
  },
  DateAt: {
    type: Date,
    required: true
  },
  StartTime: {
    type: Date,
    required: true
  },
  EndTime: {
    type: Date,
    required: true
  },
  LearnType: {
    type: Number,
    required: true
  },
  Address: {
    type: String,
    default: null
  },
  Status: {
    type: Boolean,
    default: false
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

const TimeTable = mongoose.model("TimeTables", TimeTableSchema)

export default TimeTable
