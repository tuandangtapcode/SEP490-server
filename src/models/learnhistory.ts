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
    default: new Date()
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
  },
  IsDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const LearnHistory = mongoose.model("LearnHistories", LearnHistorySchema)

export default LearnHistory
