import Joi from "joi"
import { getRegexObjectID } from '../utils/commonFunction'
import { parameterValidation } from "./common.validation"
import { NextFunction, Request, Response } from "express"

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    ChatID: Joi.string().pattern(getRegexObjectID()).optional(),
    Receiver: Joi.string().pattern(getRegexObjectID()).optional(),
    Content: Joi.string().min(0).max(256).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getMessageByChat = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    ChatID: Joi.string().pattern(getRegexObjectID()).optional(),
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getChatWithUser = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Receiver: Joi.string().pattern(getRegexObjectID()).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const seenMessage = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = parameterValidation("ChatID")
  try {
    await trueCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const MessageValidation = {
  createMessage,
  getMessageByChat,
  getChatWithUser,
  seenMessage
}

export default MessageValidation
