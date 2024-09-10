import { ObjectId } from "mongoose"

export interface CreateReportDTO {
  Title: string,
  Content: string,
  Timetable: ObjectId,
  Teacher: ObjectId
}

export interface ReportDTO {
  _id: ObjectId,
  Sender: {
    _id: ObjectId,
    FullName: string
  },
  Timetable: ObjectId,
  Teacher: {
    _id: ObjectId,
    FullName: string
  },
  Title: string,
  Content: string,
  IsDeleted: boolean,
  IsHandle: boolean,
  createdAt: Date,
  updatedAt: Date
}
