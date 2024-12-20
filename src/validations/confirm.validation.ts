import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import { getRegexEmail, getRegexObjectID } from '../utils/stringUtils'

const createConfirm = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    CourseID: Joi.string().pattern(getRegexObjectID()).optional(),
    Sender: Joi.string().pattern(getRegexObjectID()).required(),
    StudentName: Joi.string().min(1).required(),
    Receiver: Joi.string().pattern(getRegexObjectID()).required(),
    TeacherName: Joi.string().min(1).required(),
    TeacherEmail: Joi.string().pattern(getRegexEmail()).required(),
    Subject: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectName: Joi.string().min(1).required(),
    TotalFee: Joi.number().min(1).required(),
    LearnType: Joi.number().valid(1, 2).required(),
    Address: Joi.string().min(1).optional(),
    Times: Joi.array().items(Joi.string().min(1)).required(),
    Schedules: Joi.array().items(Joi.object({
      StartTime: Joi.date().required(),
      EndTime: Joi.date().required()
    }))
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const updateConfirm = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    ConfirmID: Joi.string().pattern(getRegexObjectID()).required(),
    Sender: Joi.string().pattern(getRegexObjectID()).required(),
    Receiver: Joi.string().pattern(getRegexObjectID()).required(),
    Subject: Joi.string().pattern(getRegexObjectID()).required(),
    TotalFee: Joi.number().min(1).required(),
    LearnType: Joi.number().valid(1, 2).required(),
    Address: Joi.string().min(1).optional(),
    Schedules: Joi.array().items(Joi.object({
      StartTime: Joi.date().required(),
      EndTime: Joi.date().required()
    }))
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const changeConfirmStatus = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    ConfirmID: Joi.string().pattern(getRegexObjectID()).required(),
    ConfirmStatus: Joi.number().valid(2, 3, 4).required(),
    RecevierName: Joi.string().min(1).required(),
    RecevierEmail: Joi.string().pattern(getRegexEmail()).optional(),
    SenderName: Joi.string().min(1).required(),
    SenderEmail: Joi.string().pattern(getRegexEmail()).optional(),
    Reason: Joi.string().min(1).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const ConfirmValidation = {
  createConfirm,
  updateConfirm,
  changeConfirmStatus
}

export default ConfirmValidation
