import Joi from 'joi'
import { NextFunction, Response, Request } from 'express'
import { getRegexEmail, getRegexObjectID, getRegexPassword, getRegexPhoneNumber } from '../utils/stringUtils'

const changeProfile = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    FullName: Joi.string().min(1).required(),
    Address: Joi.string().min(1).required(),
    AvatarPath: Joi.string().min(1).required(),
    Phone: Joi.string().pattern(getRegexPhoneNumber()).required(),
    DateOfBirth: Joi.date().required(),
    Gender: Joi.number().valid(1, 2).required(),
    Email: Joi.string().min(3).max(100).pattern(getRegexEmail()).required(),
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
    IntroVideos: Joi.array().items(Joi.string().optional()).required(),
    Certificates: Joi.array().items(Joi.string().required()).required(),
    ExpensePrice: Joi.number().required().required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const changeCareerInformation = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Subjects: Joi.array().items(Joi.string().pattern(getRegexObjectID())).required(),
    Experiences: Joi.array().items(Joi.string().min(1)).required(),
    Educations: Joi.array().items(Joi.string().min(1)).required(),
    Certificates: Joi.array().items(Joi.string().required()).required(),
    Description: Joi.string().min(1).required(),
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

const updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Schedules: Joi
      .array().items(
        Joi.object({
          DateAt: Joi.string().min(1).required(),
          StartTime: Joi.date().required(),
          EndTime: Joi.date().required(),
        })
      )
      .required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const createAccountStaff = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    FullName: Joi.string().min(1).required(),
    Email: Joi.string().min(3).max(100).pattern(getRegexEmail()).required(),
    Phone: Joi.string().pattern(getRegexPhoneNumber()).required(),
    Password: Joi.string().min(8).max(100).pattern(getRegexPassword()).required(),
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
  changeProfile,
  changeCareerInformation,
  updateSchedule,
  createAccountStaff
}

export default UserValidation
