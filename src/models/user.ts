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
  Certificates: {
    type: [String],
    required: true
  },
  IntroVideos: {
    type: [String],
    required: true
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
