import { number } from "joi"
import mongoose, { Schema } from "mongoose"

const SubjectSettingSchema = new Schema({
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects"
  },
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  Quote: {
    type: {
      Title: { type: String },
      Content: { type: String },
    },
    default: {}
  },
  Certificates: {
    type: [String],
    default: []
  },
  IntroVideos: {
    type: [String],
    default: []
  },
  Levels: {
    type: [
      { type: Number }
    ],
    default: []
  },
  Schedules: {
    type: [
      {
        DateAt: { type: String },
        StartTime: { type: Date },
        EndTime: { type: Date }
      }
    ],
    default: []
  },
  Experiences: {
    type: [
      {
        Content: { type: String },
        StartDate: { type: Date },
        EndDate: { type: Date }
      }
    ],
    default: []
  },
  Educations: {
    type: [
      {
        Content: { type: String },
        StartDate: { type: Date },
        EndDate: { type: Date }
      }
    ],
    default: []
  },
  Price: {
    type: Number,
    default: null
  },
  LearnTypes: {
    type: [
      { type: Number }
    ],
    default: []
  },
  IsActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const SubjectSetting = mongoose.model("SubjectSettings", SubjectSettingSchema)

export default SubjectSetting