import mongoose, { Schema } from "mongoose"

const ConfirmSchema = new Schema({
  Sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subjects',
    required: true
  },
  TotalFee: {
    type: Number,
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
  Schedules: {
    type: [
      {
        DateAt: { type: Date },
        StartTime: { type: Date },
        EndTime: { type: Date }
      }
    ],
    default: []
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
  ConfirmStatus: {
    type: Number,
    default: 1
  },
  IsPaid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
}
)

const Confirm = mongoose.model("Confirm", ConfirmSchema)

export default Confirm