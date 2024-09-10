import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface CreateSubjectDTO {
  SubjectCateID: ObjectId,
  SubjectName: string
}

export interface GetListSubjectDTO extends CommonDTO {
  SubjectCateID: ObjectId
}

export interface UpdateSubjectDTO extends CreateSubjectDTO {
  SubjectID: ObjectId
}
