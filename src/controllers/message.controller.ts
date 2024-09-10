import { Request, Response } from "express"
import MessageService from "../services/message.service"

const createMessage = async (req: Request, res: Response) => {
  try {
    const response = await MessageService.fncCreateMessage(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getMessageByChat = async (req: Request, res: Response) => {
  try {
    const response = await MessageService.fncGetMessageByChat(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getChatWithUser = async (req: Request, res: Response) => {
  try {
    const response = await MessageService.fncGetChatWithUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getChatOfAdmin = async (req: Request, res: Response) => {
  try {
    const response = await MessageService.fncGetChatOfAdmin()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getChatOfUser = async (req: Request, res: Response) => {
  try {
    const response = await MessageService.fncGetChatOfUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const seenMessage = async (req: Request, res: Response) => {
  try {
    const response = await MessageService.fncSeenMessage(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const MessageController = {
  createMessage,
  getMessageByChat,
  getChatWithUser,
  getChatOfAdmin,
  seenMessage,
  getChatOfUser
}

export default MessageController
