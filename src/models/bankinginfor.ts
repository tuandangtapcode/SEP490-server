import mongoose from "mongoose"
const Schema = mongoose.Schema

const BankingInforSchema = new Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
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
    type: Number,
    required: true
  },
}, {
  timestamps: true
})

const BankingInfor = mongoose.model("BankingInfors", BankingInforSchema)

export default BankingInfor
