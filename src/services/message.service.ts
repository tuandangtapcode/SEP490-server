import { Request } from "express"
import Chat from "../models/chat"
import Message from "../models/message"
import response from "../utils/response"
import {
  CreateMessageDTO,
  GetMessageByChatDTO
} from "../dtos/message.dto"

export const ADMIN_ID = "66f682358a03bbcf9bf04c03"
export const STAFF_ID = "67476613fa551a62e2f8b72b"

const fncCreateMessage = async (req: Request) => {
  try {
    let newChat: any
    const UserID = req.user.ID
    const { Content, ChatID, Receiver } = req.body as CreateMessageDTO
    if (!ChatID) {
      newChat = await Chat.create({
        Members: !!Receiver ? [UserID, Receiver] : [UserID, STAFF_ID],
        LastMessage: Content
      })
    } else {
      await Chat.findByIdAndUpdate(
        ChatID,
        { LastMessage: Content, IsSeen: false, UpdatedAt: Date.now() }
      )
    }
    const newMessage = await Message.create({
      Chat: !!ChatID ? ChatID : newChat._id,
      Sender: UserID,
      Content: Content
    })
    return response(newMessage, false, "Gửi tin nhắn thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetMessageByChat = async (req: Request) => {
  try {
    const { ChatID, PageSize, CurrentPage } = req.body as GetMessageByChatDTO
    const query = {
      Chat: ChatID,
    }
    const message = Message
      .find(query)
      .populate("Sender", ["_id", "FullName", "AvatarPath"])
    const total = Message.countDocuments(query)
    const result = await Promise.all([message, total])
    return response({ List: result[0], Total: result[1] }, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetChatWithUser = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const Receiver = req.body.Receiver
    const chat = await Chat.findOne({
      Members: [
        UserID,
        Receiver
      ]
    })
    // if (!chat) return response({}, true, "Chat không tồn tại", 200)
    return response(chat, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetChatOfAdmin = async () => {
  try {
    const chats = await Chat
      .find({
        Members: {
          $elemMatch: { $eq: STAFF_ID }
        }
      })
      .sort({ UpdatedAt: -1 })
      .populate("Members", ["_id", "FullName", "AvatarPath"])
    return response(chats, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetChatOfUser = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const chats = await Chat
      .find({
        Members: {
          $elemMatch: { $eq: UserID }
        }
      })
      .sort({ updatedAt: -1 })
      .populate("Members", ["_id", "FullName", "AvatarPath"])
    const filteredChats = chats.filter(chat =>
      !chat.Members.some(member => member.equals(STAFF_ID))
    )
    return response(filteredChats, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncSeenMessage = async (req: Request) => {
  try {
    const ChatID = req.params.ChatID
    const chat = await Chat.findOneAndUpdate(
      { _id: ChatID },
      { IsSeen: true },
      { new: true })
    if (!chat) return response({}, true, "Có lỗi xảy ra", 200)
    return response(chat, false, "Seen", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const MessageService = {
  fncCreateMessage,
  fncGetMessageByChat,
  fncGetChatWithUser,
  fncGetChatOfAdmin,
  fncSeenMessage,
  fncGetChatOfUser
}

export default MessageService
