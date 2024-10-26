import { ObjectId } from "mongoose"

export interface CreateUpdateBlogDTO {
  UserID: ObjectId,
  Subject: ObjectId,
  Gender: number,
  Title: string,
  Price: number,
  Content: string,
  NumberSlot: number,
  LearnType: number[],
  Address: string,
  Schedules: {
    DateAt: string,
    StartTime: Date,
    EndTime: Date
  }[],
  BlogID?: ObjectId
}
