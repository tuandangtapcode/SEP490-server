import { ObjectId } from "mongoose"

export interface CreateTimeTableDTO {
  LearnHistory: ObjectId,
  Teacher: ObjectId,
  Subject: ObjectId,
  StartTime: Date,
  EndTime: Date,
  LearnType: number,
  Address?: string
}

export interface UpdateTimeTableDTO {
  TimeTableID: ObjectId,
  StartTime: Date,
  EndTime: Date,
  Documents: {
    DocName: string
    DocPath: string
  }[]
}
