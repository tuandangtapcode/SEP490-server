import mongoose from "mongoose"
const Schema = mongoose.Schema

const SubjectCateSchema = new Schema({
  SubjectCateName: {
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

const SubjectCate = mongoose.model("SubjectCates", SubjectCateSchema)

export default SubjectCate
