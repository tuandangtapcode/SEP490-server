import mongoose from "mongoose"
const Schema = mongoose.Schema

const UserSchema = new Schema({
  FullName: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  Phone: {
    type: String,
    required: true
  },
  DateOfBirth: {
    type: Date,
    required: true
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
    required: true
  },
  Votes: {
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
  IsByGoogle: {
    type: Boolean,
    default: false
  },
  RegisterStatus: {
    type: Number,
    default: 1
  },
  IsActive: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
})

const User = mongoose.model("Users", UserSchema)

export default User
