import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Timetable: Joi.string().pattern(getRegexObjectID()).required(),
    Teacher: Joi.string().pattern(getRegexObjectID()).required(),
    Title: Joi.string().min(1).required(),
    Content: Joi.string().min(1).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListIssue = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    TextSearch: Joi.string().empty(""),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const IssueValidation = {
  createIssue,
  getListIssue,
}

export default IssueValidation
