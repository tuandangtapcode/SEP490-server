import { ObjectId } from "mongoose"

export interface CreateUpdateConfirmDTO {
  ConfirmID?: ObjectId,
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
    DateAt: Date,
    StartTime: Date,
    EndTime: Date
  }[]
}

export interface ChangeConfirmStatusDTO {
  ConfirmID: ObjectId,
  ConfirmStatus: number
}