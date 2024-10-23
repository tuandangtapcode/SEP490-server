import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface CreateUpdateSubjectDTO {
  SubjectCateID: ObjectId,
  SubjectName: string,
  AvatarPath: string,
  Description: string,
  SubjectID?: ObjectId
}

export interface GetListSubjectDTO extends CommonDTO {
  SubjectCateID: ObjectId
}
