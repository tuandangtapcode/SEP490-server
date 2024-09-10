import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'

const getValidFile = (type) => {
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

export const fileValidation = (name, type) => {
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

export const parameterValidation = (key) => {
  return Joi.object({
    [key]: Joi.string().pattern(getRegexObjectID()).required()
  })
}