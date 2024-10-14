import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Response, Request } from 'express'

const getValidFile = (type: string) => {
  let listValid
  switch (type) {
    case "application":
      listValid = ["application/doc", "application/docx", "application/pdf", "application/xlsx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      break
    case "image":
      listValid = ['image/jpeg', 'image/png', 'image/gif']
      break
    default:
      listValid = ['image/jpeg', 'image/png', 'image/gif']
      break
  }
  return listValid
}

export const fileValidation = (name: string, type: string) => {
  return Joi.object({
    fieldname: Joi.string().valid(name).required(),
    originalname: Joi.string().required(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid(...getValidFile(type)).required(),
    path: Joi.string().required(),
    size: Joi.number().max(10 * 1024 * 1024).required(),
    filename: Joi.string().required()
  })
}

export const parameterValidation = (key: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const trueCondition = Joi.object({
      [key]: Joi.string().pattern(getRegexObjectID()).required()
    })
    try {
      await trueCondition.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error: any) {
      return res.status(400).json(error.toString())
    }
  }
}