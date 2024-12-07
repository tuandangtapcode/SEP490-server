import { ObjectId } from "mongoose"
import { CommonDTO, PaginationDTO } from "./common.dto"

export interface CreateUpdateBlogDTO {
  User: ObjectId,
  Subject: ObjectId,
  Gender: number[],
  Title: string,
  Price: number,
  ExpensePrice: number,
  NumberSlot: number,
  LearnType: number[],
  Address: string,
  StartDate: Date,
  ProfessionalLevel: number,
  Schedules: {
    DateValue: number,
    StartTime: Date,
    EndTime: Date
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

export interface GetListBlogApprovalDTO extends PaginationDTO {
  SubjectID: ObjectId,
  ReceiveStatus: number,
  ReceiveDate: Date
}
