import mongoose from "mongoose"
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  Content: {
    type: String,
    require: true
  },
  Sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    require: true
  },
  Receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    require: true
  },
  Type: {
    type: String,
    required: true
  },
  IsSeen: {
    type: Boolean,
    default: false
  },
  IsNew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Notification = mongoose.model("Notification", NotificationSchema)

export default Notification
