import { ObjectId } from "mongoose"

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
