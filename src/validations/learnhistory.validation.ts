import Joi from "joi"
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from "express"

const createLearnHistory = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Teacher: Joi.string().pattern(getRegexObjectID()).required(),
    Subject: Joi.string().pattern(getRegexObjectID()).required(),
    TotalLearned: Joi.number().min(1).required(),
    TeacherName: Joi.string().min(1).required(),
    TeacherEmail: Joi.string().min(1).required(),
    SubjectName: Joi.string().min(1).required(),
    StudentName: Joi.string().min(1).required(),
    StudentEmail: Joi.string().min(1).required(),
    Times: Joi.array().items(Joi.string().min(1)).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListLearnHistory = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    TextSearch: Joi.string().empty(""),
    LearnedStatus: Joi.number().integer().valid(0, 1, 2).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const LearnhistoryValidation = {
  createLearnHistory,
  getListLearnHistory
}

export default LearnhistoryValidation
