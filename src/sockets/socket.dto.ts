import { ObjectId } from "mongoose"

export interface SendNotificationDTO {
  Content: string,
  IsSeen: boolean,
  _id: ObjectId,
  Type: string,
  IsNew: boolean,
  Receiver: ObjectId,
  createdAt: Date
}

export interface SendCommentDTO {
  Rate: number,
  Content: string,
  User: {
    FullName: string,
    AvatarPath: string
  },
  RoomID: ObjectId,
  createdAt: Date
}

export interface SendMessageDTO {
  Content: string,
  ChatID?: ObjectId,
  Receiver: ObjectId,
  Sender: {
    _id: ObjectId,
    FullName: string,
    AvatarPath: string
  },
  createdAt: Date
}

export interface JoinMeetingRoomDTO {
  UserID: ObjectId,
  FullName: string,
  Avatar: string,
  RoomID: ObjectId,
  PeerID: string,
  IsViewVideo: boolean,
  Muted: boolean
}

export interface ToggleHandlerDTO {
  RoomID: ObjectId,
  PeerID: string,
  Key: string
}

export interface LeaveMeetingRoomDTO {
  RoomID: object,
  PeerID: string,
}

export interface SendMessageMeetingRoomDTO {
  RoomID: ObjectId,
  Content: string,
  Sender: {
    _id: ObjectId,
    FullName: string,
    AvatarPath: string
  }
}
