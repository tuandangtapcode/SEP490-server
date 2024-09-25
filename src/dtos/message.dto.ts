import { ObjectId } from "mongoose"
import { PaginationDTO } from "./common.dto"

export interface CreateMessageDTO {
  Content: string,
  ChatID?: ObjectId,
  Receiver?: ObjectId
}

export interface GetMessageByChatDTO extends PaginationDTO {
  ChatID: ObjectId,
}
