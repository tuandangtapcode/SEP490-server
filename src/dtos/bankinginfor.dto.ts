import { ObjectId } from "mongoose"

export interface CreateUpdateBankingInforDTO {
  BankID: number,
  UserBankName: string,
  UserBankAccount: string
  BankingInforID?: ObjectId
}

export interface GetBankingInforOfUserDTO {
  UserID: ObjectId,
  FullName: string,
  Email: string
}
