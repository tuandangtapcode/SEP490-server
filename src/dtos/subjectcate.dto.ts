import { Document, ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface CreateSubjectCateDTO {
  SubjectCateName: string,
  Description: string
}

export interface UpdateSubjectCateDTO extends CreateSubjectCateDTO {
  SubjectCateID: ObjectId
}

export interface GetDetailSubjectCateDTO extends CommonDTO {
  SubjectCateID: ObjectId
}
