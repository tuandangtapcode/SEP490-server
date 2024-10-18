import mongoose from "mongoose"
const Schema = mongoose.Schema

const SystemKeySchema = new Schema({
  KeyName: {
    type: String,
    required: true
  },
  Parents: [
    {
      ParentID: { type: Number, required: true },
      ParentName: { type: String, required: true }
    }
  ],
  IsDeleted: {
    type: Boolean,
    default: false
  },
})

const SystemKey = mongoose.model("SystemKeys", SystemKeySchema)

export default SystemKey
