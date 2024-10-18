import { ObjectId } from "mongoose"

export interface CreateUpdateConfirmDTO {
  ConfirmID?: ObjectId,
  Sender: ObjectId,
  Receiver: ObjectId,
  Subject: ObjectId,
  TotalFee: number,
  LearnType: number,
  Address?: string,
  Schedules: {
    DateAt: Date,
    StartTime: Date,
    EndTime: Date
  }[]
}

export interface ChangeConfirmStatusDTO {
  ConfirmID: ObjectId,
  ConfirmStatus: number
}