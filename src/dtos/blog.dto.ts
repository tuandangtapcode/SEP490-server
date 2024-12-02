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
  Schedules: {
    // DateAt: string,
    StartTime: string,
    EndTime: string
  }[],
  BlogID?: ObjectId
}

export interface GetListBlogDTO extends CommonDTO {
  SubjectID?: ObjectId,
  RegisterStatus: number,
  LearnType: number
}

export interface GetListBlogByUserDTO extends CommonDTO {
  SubjectID?: ObjectId,
}
