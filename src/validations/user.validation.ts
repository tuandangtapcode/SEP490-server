import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { parameterValidation } from './common.validation'
import { NextFunction, Response, Request } from 'express'

const responseConfirmRegister = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    TeacherID: Joi.string().pattern(getRegexObjectID()).required(),
    RegisterStatus: Joi.number().integer().min(1).max(4).required(),
    FullName: Joi.string().min(1).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const pushOrPullSubjectForTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = parameterValidation("SubjectID")
  try {
    await trueCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const { SubjectID, Level, RegisterStatus } = req.body
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    SubjectID: !!SubjectID ? Joi.string().pattern(getRegexObjectID()) : Joi.string().empty(""),
    TextSearch: Joi.string().empty(""),
    RegisterStatus: !!RegisterStatus ? Joi.number().integer().min(1).max(2) : Joi.number(),
    Level: !!Level.length
      ? Joi.array().unique().items(Joi.number().integer().valid(1, 2, 3))
      : Joi.array()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListTeacherByUser = async (req: Request, res: Response, next: NextFunction) => {
  const { LearnType, Level } = req.body
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).required(),
    TextSearch: Joi.string().empty(""),
    FromPrice: Joi.string().min(1).required(),
    ToPrice: Joi.string().min(1).required(),
    SortByPrice: Joi.number().integer().valid(1, -1).required(),
    LearnType: !!LearnType.length
      ? Joi.array().unique().items(Joi.number().integer().valid(1, 2))
      : Joi.array(),
    Level: !!Level.length
      ? Joi.array().unique().items(Joi.number().integer().valid(1, 2, 3))
      : Joi.array()
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

const UserValidation = {
  responseConfirmRegister,
  pushOrPullSubjectForTeacher,
  getListTeacher,
  getListTeacherByUser,
  getDetailTeacher,
  getListStudent,
  inactiveOrActiveAccount
}

export default UserValidation
