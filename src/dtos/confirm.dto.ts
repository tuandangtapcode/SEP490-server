import { ObjectId } from "mongoose"

export interface CreateConfirmDTO {
  Sender: ObjectId,
  StudentName: string,
  Receiver: ObjectId,
  TeacherName: string,
  TeacherEmail: string,
  Subject: ObjectId,
  SubjectName: string,
  TotalFee: number,
  LearnType: number,
  Address?: string,
  Times: string[],
  Schedules: {
    StartTime: Date,
    EndTime: Date
  }[]
}
export interface UpdateConfirmDTO {
  ConfirmID?: ObjectId,
  Sender: ObjectId,
  Receiver: ObjectId,
  Subject: ObjectId,
  TotalFee: number,
  LearnType: number,
  Address?: string,
  Schedules: {
    StartTime: Date,
    EndTime: Date
  }[]
}

export interface ChangeConfirmStatusDTO {
  ConfirmID: ObjectId,
  ConfirmStatus: number,
  Recevier: ObjectId,
  RecevierName: string,
  SenderName: string,
  SenderEmail: string,
}