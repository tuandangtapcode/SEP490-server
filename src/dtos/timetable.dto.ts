import { ObjectId } from "mongoose"

export interface CreateTimeTableDTO {
  LearnHistory: ObjectId,
  Teacher: ObjectId,
  Subject: ObjectId,
  DateAt: Date
  StartTime: Date,
  EndTime: Date,
  LearnType: number,
  Address: string | undefined
}

export interface UpdateTimeTableDTO {
  TimeTableID: ObjectId,
  DateAt: Date
  StartTime: Date,
  EndTime: Date
}
