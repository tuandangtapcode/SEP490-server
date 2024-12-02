import { ObjectId } from "mongoose"
import { CommonDTO, PaginationDTO } from "./common.dto"

export interface CreateLearnHistoryDTO {
  Teacher: ObjectId,
  Subject: ObjectId,
  TotalLearned: number,
  TeacherName: string,
  TeacherEmail: string,
  SubjectName: string,
  StudentName: string,
  StudentEmail: string,
  Times: string[]
}

export interface GetListLearnHistoryDTO extends CommonDTO {
  LearnedStatus: number,
  SubjectID: ObjectId
}

export interface GetListLearnHistoryOfUserDTO extends CommonDTO {
  UserID: ObjectId,
  RoleID: number,
  LearnedStatus: number,
  SubjectID: ObjectId
}
