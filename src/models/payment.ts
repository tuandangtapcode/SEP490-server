import mongoose from "mongoose"
import { ADMIN_ID } from "../services/message.service"

const Schema = mongoose.Schema

const PaymentSchema = new Schema({
  Sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: ADMIN_ID
  },
  PaymentType: {
    type: Number,
    required: true
  },
  TraddingCode: {
    type: String,
    required: true
  },
  TotalFee: {
    type: Number,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  PaymentStatus: {
    type: Number,
    default: 2
  },
  PaymentTime: {
    type: Date,
    default: () => Date.now()
  },
  RequestAxplanationAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

const Payment = mongoose.model("Payments", PaymentSchema)

export default Payment
