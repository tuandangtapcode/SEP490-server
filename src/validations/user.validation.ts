import Joi from 'joi'
import { getRegexEmail, getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Response, Request } from 'express'

const responseConfirmRegister = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    TeacherID: Joi.string().pattern(getRegexObjectID()).required(),
    RegisterStatus: Joi.number().integer().min(1).max(4).required(),
    Email: Joi.string().pattern(getRegexEmail()).required(),
    FullName: Joi.string().min(1).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).empty("").optional(),
    TextSearch: Joi.string().empty(""),
    RegisterStatus: Joi.number().integer().min(0).max(4).optional(),
    Level: Joi.array().unique().items(Joi.number().integer().valid(1, 2, 3).optional()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListTeacherByUser = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).required(),
    TextSearch: Joi.string().empty(""),
    FromPrice: Joi.string().min(0).required(),
    ToPrice: Joi.string().min(0).required(),
    SortByPrice: Joi.number().integer().valid(1, -1).required(),
    LearnType: Joi.array().unique().items(Joi.number().integer().valid(1, 2).optional()).optional(),
    Level: Joi.array().unique().items(Joi.number().integer().valid(1, 2, 3).optional()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getDetailTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    TeacherID: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListStudent = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    TextSearch: Joi.string().empty(""),
    SortByBookQuantity: Joi.number().integer().valid(1, -1).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const inactiveOrActiveAccount = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    UserID: Joi.string().pattern(getRegexObjectID()).required(),
    IsActive: Joi.boolean().required(),
    RegisterStatus: Joi.number().integer().valid(3, 4).required(),
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

const confirmSubjectSetting = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectSettingID: Joi.string().pattern(getRegexObjectID()).required(),
    FullName: Joi.string().min(1).max(256).required(),
    Email: Joi.string().min(1).max(256).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const UserValidation = {
  responseConfirmRegister,
  getListTeacher,
  getListTeacherByUser,
  getDetailTeacher,
  getListStudent,
  inactiveOrActiveAccount,
  updateSubjectSetting,
  confirmSubjectSetting
}

export default UserValidation
