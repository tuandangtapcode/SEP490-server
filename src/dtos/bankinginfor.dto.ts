import { ObjectId } from "mongoose"

export interface CreateUpdateBankingInforDTO {
  BankID: number,
  UserBankName: string,
  UserBankAccount: number
  BankingInforID?: ObjectId
}

export interface GetBankingInforOfUserDTO {
  UserID: ObjectId,
  FullName: string,
  Email: string
}
