import { ObjectId } from "mongoose"

export interface CreateBlogDTO {
  Title: string
}

export interface UpdateBlogDTO extends CreateBlogDTO {
  BlogID: ObjectId
}
