import mongoose from "mongoose"
const Schema = mongoose.Schema

const LearnHistorySchema = new Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects",
    required: true
  },
  RegisterDate: {
    type: Date,
    default: () => Date.now()
  },
  TotalLearned: {
    type: Number,
    required: true
  },
  LearnedNumber: {
    type: Number,
    default: 0
  },
  LearnedStatus: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
})

const LearnHistory = mongoose.model("LearnHistorys", LearnHistorySchema)

export default LearnHistory
