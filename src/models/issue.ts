import mongoose from "mongoose"
const Schema = mongoose.Schema

const IssueSchema = new Schema({
  Sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  // Timetable: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'TimeTables',
  //   required: true
  // },
  // Teacher: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Users',
  //   required: true
  // },
  Title: {
    type: String,
    required: true
  },
  Content: {
    type: String,
    required: true
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
  IsHandle: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const Issue = mongoose.model("Issues", IssueSchema)

export default Issue
