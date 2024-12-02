import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface ChangeProfileDTO {
  FullName: string,
  Address: string,
  Avatar: string,
  Phone: string,
  DateOfBirth: Date,
  Gender: 1 | 2,
  Email: string
}

export interface ResponseConfirmRegisterDTO {
  TeacherID: ObjectId,
  RegisterStatus: number,
  FullName: string,
  Email: string,
  Reason?: string
}

export interface GetListTeacherDTO extends CommonDTO {
  RegisterStatus: number
}

export interface GetListTeacherByUserDTO extends CommonDTO {
  SubjectID: ObjectId,
  Level: number[],
  FromPrice: string,
  ToPrice: string,
  LearnType: number[],
  SortByPrice: 1 | -1,
  Gender: number
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
}
export interface UpdateSubjectSettingDTO {
  SubjectSettingID: ObjectId,
  SubjectID: ObjectId,
  Quotes: {
    Title: string,
    Content: string
  }[],
  Levels: number[],
  Schedules: {
    DateAt: string,
    StartTime: Date,
    EndTime: Date
  }[],
  Experiences: {
    Title: string,
    Content: string,
    StartDate: string,
    EndDate: string
  }[],
  Educations: {
    Title: string,
    Content: string,
    StartDate: string,
    EndDate: string
  }[],
  Price: string,
  LearnTypes: number[]
}

export interface ConfirmSubjectSettingDTO {
  SubjectSettingID: ObjectId,
  FullName: string,
  Email: string,
  RegisterStatus: number,
  Reason?: string
}

export interface ChangeCareerInformationDTO {
  Subjects: ObjectId[],
  Experiences: string[],
  Educations: string[],
  Certificates: string[],
  Description: string,
}

export interface UpdateSchedulesDTO {
  Schedules: {
    DateAt: string,
    StartTime: Date,
    EndTime: Date
  }[]
}

export interface GetListSubjectSettingDTO extends CommonDTO {
  SubjectID: ObjectId,
  Level: number[],
  LearnType: number[],
  RegisterStatus: number
}

export interface CreateAccountStaff {
  FullName: string,
  Email: string,
  Password: string,
  Phone: string
}
