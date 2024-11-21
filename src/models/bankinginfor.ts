import mongoose from "mongoose"
const Schema = mongoose.Schema

const BankingInforSchema = new Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  BankID: {
    type: Number,
    required: true
  },
  UserBankName: {
    type: String,
    required: true
  },
  UserBankAccount: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

const BankingInfor = mongoose.model("BankingInfors", BankingInforSchema)

export default BankingInfor
