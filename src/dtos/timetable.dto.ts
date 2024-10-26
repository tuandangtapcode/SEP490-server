import { ObjectId } from "mongoose"

export interface CreateTimeTableDTO {
  LearnHistory: ObjectId,
  Teacher: ObjectId,
  Subject: ObjectId,
  DateAt: Date
  StartTime: Date,
  EndTime: Date,
  LearnType: number,
  Address?: string
}

export interface UpdateTimeTableDTO {
  TimeTableID: ObjectId,
  DateAt: Date
  StartTime: Date,
  EndTime: Date,
  Documents: {
    DocName: string
    DocPath: string
  }[]
}

export interface GetTimeTableOfTeacherAndStudentDTO {
  TeacherID: ObjectId,
  IsBookingPage: Boolean
}
