import { ObjectId } from "mongoose"
import { PaginationDTO } from "./common.dto"

export interface CreateCommentDTO {
  Teacher: ObjectId,
  Rate: number
}

export interface GetListCommentOfTeacherDTO extends PaginationDTO {
  TeacherID: ObjectId
}
