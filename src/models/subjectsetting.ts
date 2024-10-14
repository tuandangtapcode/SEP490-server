import { number } from "joi"
import mongoose, { Schema } from "mongoose"

const SubjectSettingSchema = new Schema({
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
