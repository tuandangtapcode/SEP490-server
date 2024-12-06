import Joi from "joi"
import { NextFunction, Request, Response } from "express"
import { getRegexObjectID } from "../utils/stringUtils"

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

const MessageValidation = {
  createMessage,
}

export default MessageValidation
