import mongoose from "mongoose"
const Schema = mongoose.Schema

const UserSchema = new Schema({
  FullName: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    default: null
  },
  AvatarPath: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
  },
  RoleID: {
    type: Number,
    required: true
  },
  Subjects: {
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subjects" }
    ],
    default: []
  },
  Quotes: {
    type: [
      {
        SubjectID: { type: mongoose.Schema.Types.ObjectId, ref: "Subjects" },
        Title: { type: String },
        Content: { type: String },
        Levels: {
          type: [
            { type: Number }
          ]
        }
      }
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
  Description: {
    type: String,
    default: null
  },
  Experiences: {
    type: [
      {
        Title: { type: String, required: true },
        Content: { type: String, required: true },
        StartDate: { type: String, required: true },
        EndDate: { type: String, required: true }
      }
    ],
    default: []
  },
  Educations: {
    type: [
      {
        Title: { type: String, required: true },
        Content: { type: String, required: true },
        StartDate: { type: String, required: true },
        EndDate: { type: String, required: true }
      }
    ],
    default: []
  },
  Price: {
    type: String,
  },
  IntroductVideos: {
    type: [
      {
        Title: { type: String },
        VideoPath: { type: String }
      }
    ],
    default: []
  },
  Votes: {
    type: [
      { type: Number }
    ],
    default: []
  },
  IsByGoogle: {
    type: Boolean,
    required: true
  },
  RegisterStatus: {
    type: Number,
    default: 1
  },
  IsActive: {
    type: Boolean,
    default: true
  },
  LearnTypes: {
    type: [
      { type: Number }
    ],
    default: []
  }
}, {
  timestamps: true
})

const User = mongoose.model("Users", UserSchema)

export default User
