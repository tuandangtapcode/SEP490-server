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
  Phone: {
    type: String,
    default: null
  },
  DateOfBirth: {
    type: Date,
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
  Gender: {
    type: Number,
    default: null
  },
  Subjects: {
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subjects" }
    ],
    default: []
  },
  Votes: {
    type: [
      { type: Number }
    ],
    default: []
  },
  Experiences: {
    type: [
      { type: String }
    ],
    default: []
  },
  Educations: {
    type: [{ type: String }],
    default: []
  },
  Description: {
    type: String,
    default: null
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
  Certificates: {
    type: [String],
    default: []
  },
  IsByGoogle: {
    type: Boolean,
    default: false
  },
  IsFirstLogin: {
    type: Boolean,
    default: true
  },
  RegisterStatus: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
})

const User = mongoose.model("Users", UserSchema)

export default User
