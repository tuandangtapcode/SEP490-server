import { ObjectId } from "mongoose"
import { CommonDTO, PaginationDTO } from "./common.dto"

export interface CreatePaymentDTO {
  PaymentType: number,
  PaymentStatus: number,
  Description: string,
  TotalFee: number,
  TraddingCode: number,
  Receiver: ObjectId
}

export interface GetListPaymentHistoryByUserDTO extends PaginationDTO {
  TraddingCode: string,
  PaymentStatus: number,
  PaymentType: number
}

export interface ChangePaymentStatusDTO {
  PaymentID: ObjectId,
  PaymentStatus: number,
  TotalFee: number,
  FullName: string,
  Email: string,
  RoleID: string,
  Image: string
}

export interface GetListPaymentDTO extends CommonDTO {
  PaymentType: number
}

export interface GetListTransferDTO extends PaginationDTO {
  FromDate: Date,
  ToDate: Date
}

export interface SendRequestExplanationDTO {
  PaymentID: ObjectId,
  Email: string,
  FullName: string,
  Reports: {
    DateAt: string,
    Time: string,
    Title: string,
    Content: string
  }[]
}
