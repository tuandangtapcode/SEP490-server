import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'

const createUpdateSubject = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectCateID: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectName: Joi.string().min(1).required(),
    Avatar: Joi.string().min(1).required(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListSubject = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    TextSearch: Joi.string().empty(""),
    SubjectCateID: Joi.string().pattern(getRegexObjectID()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListRecommendSubject = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Subjects: Joi.array().items(Joi.string().pattern(getRegexObjectID())).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const SubjectValidation = {
  createUpdateSubject,
  getListSubject,
  getListRecommendSubject
}

export default SubjectValidation
