import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Response, Request } from 'express'

const changeProfile = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    FullName: Joi.string().min(1).optional(),
    Address: Joi.string().min(1).optional(),
    Avatar: Joi.string().min(1).optional(),
    Schedules: Joi
      .array().items(
        Joi.object({
          DateAt: Joi.string().min(1).required(),
          StartTime: Joi.date().required(),
          EndTime: Joi.date().required(),
        })
      )
      .optional(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const updateSubjectSetting = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectSettingID: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).required(),
    Quote: Joi
      .object({
        Title: Joi.string().min(1).required(),
        Content: Joi.string().min(1).required(),
      })
      .required(),
    Levels: Joi.array().items(Joi.number().valid(1, 2, 3).required()).required(),
    Experiences: Joi
      .array().items(
        Joi.object({
          Content: Joi.string().min(1).required(),
          StartDate: Joi.date().required(),
          EndDate: Joi.date().required(),
        })
      )
      .required(),
    Educations: Joi
      .array().items(
        Joi.object({
          Content: Joi.string().min(1).required(),
          StartDate: Joi.date().required(),
          EndDate: Joi.date().required(),
        })
      )
      .required(),
    Price: Joi.number().required().required(),
    LearnTypes: Joi.array().items(Joi.number().valid(1, 2).required()).required(),
    IntroVideos: Joi.array().items(Joi.string().optional()).optional(),
    Certificates: Joi.array().items(Joi.string().required()).required()
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
  changeProfile
}

export default UserValidation
