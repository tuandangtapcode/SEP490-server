import mongoose from "mongoose"
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Content: {
    type: String,
    required: true
  },
  Rate: {
    type: Number,
    require: true
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

const Comment = mongoose.model("Comments", CommentSchema)

export default Comment
