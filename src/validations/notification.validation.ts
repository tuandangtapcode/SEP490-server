import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'

const createNotificaiton = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Content: Joi.string().min(3).max(256).required(),
    Receiver: Joi.string().regex(getRegexObjectID()).required(),
    Type: Joi.string().required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const seenNotification = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    NotificationID: Joi.string().regex(getRegexObjectID()).required(),
    ReceiverID: Joi.string().regex(getRegexObjectID()).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const NotificaitonValidation = {
  createNotificaiton,
  seenNotification
}

export default NotificaitonValidation
