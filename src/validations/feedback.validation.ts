import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import { getRegexObjectID } from '../utils/stringUtils'

const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Teacher: Joi.string().pattern(getRegexObjectID()).required(),
    LearnHistory: Joi.string().pattern(getRegexObjectID()).required(),
    Rate: Joi.number().min(1).max(5).required(),
    Content: Joi.string().min(3).max(256).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const FeedbackValidation = {
  createFeedback,
}

export default FeedbackValidation
