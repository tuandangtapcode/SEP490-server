import mongoose, { Schema } from "mongoose"

const TeacherSubjectSchema = new Schema({
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects"
  },
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  Quotes: {
    Title: { type: String },
    Content: { type: String },
    Levels: {
      type: [
        { type: Number }
      ]
    },
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
    required: true
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

const TeacherSubject = mongoose.model("TeacherSubjects", TeacherSubjectSchema)

export default TeacherSubject
