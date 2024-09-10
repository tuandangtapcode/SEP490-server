import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

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
  LearnedStatus: number
}
