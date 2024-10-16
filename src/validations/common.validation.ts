import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Response, Request } from 'express'
import mongoose from 'mongoose'
import response from '../utils/response'

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
  return (req: Request, res: Response, next: NextFunction) => {
    const ID = req.params[key]
    if (!mongoose.Types.ObjectId.isValid(`${ID}`)) {
      return res.status(200).json(
        response({}, true, "ObjectID không đúng định dạng", 200)
      )
    }
    next()
  }
}