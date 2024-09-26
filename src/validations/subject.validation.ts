import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { parameterValidation } from './common.validation'
import { NextFunction, Request, Response } from 'express'

const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectCateID: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectName: Joi.string().min(1).required(),
    Avatar: Joi.string().min(1).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListSubject = async (req: Request, res: Response, next: NextFunction) => {
  const { SubjectCateID } = req.body
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
    TextSearch: Joi.string().empty(""),
    SubjectCateID: !!SubjectCateID ? Joi.string().pattern(getRegexObjectID()) : Joi.string().empty("")
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectID: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectCateID: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectName: Joi.string().min(1).required(),
    Avatar: Joi.string().min(1).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getDetailSubject = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = parameterValidation("SubjectID")
  try {
    await trueCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const SubjectValidation = {
  createSubject,
  getListSubject,
  updateSubject,
  getDetailSubject
}

export default SubjectValidation
