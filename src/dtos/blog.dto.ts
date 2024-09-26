import { ObjectId } from "mongoose"

export interface CreateUpdateBlogDTO {
  Title: string,
  Description: string,
  Avatar: string,
  Content: string
  BlogID?: ObjectId
}
