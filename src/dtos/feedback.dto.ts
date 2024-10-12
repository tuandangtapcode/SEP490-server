import { ObjectId } from "mongoose"
import { PaginationDTO } from "./common.dto"

export interface CreateFeedbackDTO {
  Teacher: ObjectId,
  Content: string,
  Rate: number
}

export interface GetListFeedbackOfTeacherDTO extends PaginationDTO {
  TeacherID: ObjectId
}
