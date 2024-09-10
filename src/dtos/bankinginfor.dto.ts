import { ObjectId } from "mongoose"

export interface CreateBankingInforDTO {
  BankID: number,
  UserBankName: string,
  UserBankAccount: number
}

export interface UpdatedBankingInforDTO {
  BankingInforID: ObjectId,
  BankID: number,
  UserBankName: string,
  UserBankAccount: number
}

export interface GetBankingInforOfUserDTO {
  UserID: ObjectId,
  FullName: string,
  Email: string
}
