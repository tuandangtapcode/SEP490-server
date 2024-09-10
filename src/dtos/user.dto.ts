import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface ResponseConfirmRegisterDTO {
  TeacherID: ObjectId,
  RegisterStatus: number,
  FullName: string
}

export interface GetListTeacherDTO extends CommonDTO {
  SubjectID: ObjectId,
  Level: number[],
  RegisterStatus: number
}

export interface GetListTeacherByUserDTO extends CommonDTO {
  SubjectID: ObjectId,
  Level: number[],
  FromPrice: string,
  ToPrice: string,
  LearnType: number[],
  SortByPrice: any
}

export interface GetDetailTeacherDTO {
  TeacherID: ObjectId,
  SubjectID: ObjectId,
}

export interface GetListStudentDTO extends CommonDTO {
  SortByBookQuantity: any
}

export interface InactiveOrActiveAccountDTO {
  UserID: ObjectId,
  IsActive: boolean,
  RegisterStatus: number
}
