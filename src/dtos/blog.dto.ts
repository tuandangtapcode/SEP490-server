import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface CreateUpdateBlogDTO {
  User: ObjectId,
  Subject: ObjectId,
  Gender: number[],
  Title: string,
  Price: number,
  Content: string,
  NumberSlot: number,
  LearnType: number[],
  Address: string,
  StartDate: Date,
  ProfessionalLevel: number,
  Schedules: {
    DateValue: number,
    StartTime: string,
    EndTime: string
  }[],
  BlogID?: ObjectId
}

export interface GetListBlogDTO extends CommonDTO {
  SubjectID: ObjectId,
  RegisterStatus: number,
  LearnType: number[],
  RoleID?: number,
  UserID?: ObjectId
}

export interface GetListBlogByUserDTO extends CommonDTO {
  SubjectID: ObjectId,
}

export interface ChangeRegisterStatusDTO {
  BlogID: ObjectId,
  FullName: string,
  Email: string,
  Reason?: string,
  RegisterStatus: number
}
