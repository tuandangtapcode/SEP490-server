import { Document, ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface CreateUpdateSubjectCateDTO {
  SubjectCateName: string,
  Description: string,
  SubjectCateID?: string
}

export interface GetDetailSubjectCateDTO extends CommonDTO {
  SubjectCateID: ObjectId
}
