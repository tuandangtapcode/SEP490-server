import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import { getRegexObjectID } from '../utils/stringUtils'

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

const NotificaitonValidation = {
  createNotificaiton,
}

export default NotificaitonValidation
