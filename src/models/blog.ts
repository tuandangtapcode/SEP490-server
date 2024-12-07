import mongoose from "mongoose"
const Schema = mongoose.Schema

const BlogSchema = new Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subjects',
    required: true
  },
  Gender: {
    type: [
      { type: Number }
    ],
    required: true
  },
  Title: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  ExpensePrice: {
    type: Number,
    required: true
  },
  NumberSlot: {
    type: Number,
    required: true
  },
  LearnType: {
    type: [
      { type: Number }
    ],
    required: true
  },
  Address: {
    type: String,
    default: null
  },
  ProfessionalLevel: {
    type: Number,
    required: true
  },
  Schedules: {
    type: [
      {
        DateValue: { type: Number },
        StartTime: { type: Date },
        EndTime: { type: Date }
      }
    ],
    required: true
  },
  RealSchedules: {
    type: [
      {
        StartTime: { type: Date },
        EndTime: { type: Date }
      }
    ],
    required: true
  },
  StartDate: {
    type: Date,
    required: true
  },
  TeacherReceive: {
    type: [
      {
        Teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
        },
        ReceiveStatus: {
          type: Number,
          default: 1
        },
        ReceiveDate: {
          type: Date,
          default: new Date()
        }
      }
    ],
    default: []
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
  IsPaid: {
    type: Boolean,
    default: false
  },
  RegisterStatus: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
})

const Blog = mongoose.model("Blogs", BlogSchema)

export default Blog
