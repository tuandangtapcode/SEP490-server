import { ObjectId } from "mongoose"

export interface CreateUpdateCourseDTO {
  CourseID?: ObjectId,
  Subject: ObjectId,
  Teacher: ObjectId,
  QuantitySlot: number,
  Price: number,
  Title: string,
  Description: string,
  Level: number,
}

export interface GetListCourseOfTeacherDTO {
  Subject: ObjectId,
  Teacher: ObjectId,
}
