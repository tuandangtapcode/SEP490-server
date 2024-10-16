import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Response, Request } from 'express'

const updateSubjectSetting = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectSettingID: Joi.string().pattern(getRegexObjectID()).optional(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).required(),
    Quote: Joi
      .object({
        Title: Joi.string().min(1).required(),
        Content: Joi.string().min(1).required(),
      })
      .optional(),
    Levels: Joi.array().items(Joi.number().valid(1, 2, 3).optional()).optional(),
    Schedules: Joi
      .array().items(
        Joi.object({
          DateAt: Joi.string().min(1).required(),
          StartTime: Joi.date().required(),
          EndTime: Joi.date().required(),
        })
      )
      .optional(),
    Experiences: Joi
      .array().items(
        Joi.object({
          Content: Joi.string().min(1).required(),
          StartDate: Joi.date().required(),
          EndDate: Joi.date().required(),
        })
      )
      .optional(),
    Educations: Joi
      .array().items(
        Joi.object({
          Content: Joi.string().min(1).required(),
          StartDate: Joi.date().required(),
          EndDate: Joi.date().required(),
        })
      )
      .optional(),
    Price: Joi.number().required().optional(),
    LearnTypes: Joi.array().items(Joi.number().valid(1, 2).optional()).optional(),
    IntroVideos: Joi.array().items(Joi.string().optional()).optional(),
    Certificates: Joi.array().items(Joi.string().optional()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const UserValidation = {
  updateSubjectSetting,
}

export default UserValidation
