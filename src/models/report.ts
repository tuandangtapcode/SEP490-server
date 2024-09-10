import mongoose from "mongoose"
const Schema = mongoose.Schema

const ReportSchema = new Schema({
  Sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  Timetable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeTables'
  },
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
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

const Report = mongoose.model("Reports", ReportSchema)

export default Report
