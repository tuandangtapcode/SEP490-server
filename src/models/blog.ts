import mongoose from "mongoose"
const Schema = mongoose.Schema

const BlogSchema = new Schema({
  Teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Title: {
    type: String,
    required: true
  },
  Content: {
    type: String,
    required: true
  },
  AvatarPath: {
    type: String,
    required: true
  },
  Description: {
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

const Blog = mongoose.model("Blogs", BlogSchema)

export default Blog
