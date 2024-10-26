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
    type: Number,
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
  NumberSlot: {
    type: Number,
    required: true
  },
  Content: {
    type: String,
    required: true
  },
  LearnTypes: {
    type: [
      { type: Number }
    ],
    default: []
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
  IsActivate: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

const Blog = mongoose.model("Blogs", BlogSchema)

export default Blog
