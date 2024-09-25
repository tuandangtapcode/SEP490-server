import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface CreateUpdateSubjectDTO {
  SubjectCateID: ObjectId,
  SubjectName: string,
  Avatar: string,
  SubjectID?: ObjectId
}

export interface GetListSubjectDTO extends CommonDTO {
  SubjectCateID: ObjectId
}
