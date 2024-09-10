import { ObjectId } from "mongoose"

export interface CreateNotificationDTO {
  Content: string,
  Type: string,
  Receiver: ObjectId
}

export interface SeenNotificationDTO {
  ReceiverID: ObjectId,
  NotificationID: ObjectId
}
