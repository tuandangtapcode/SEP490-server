import Joi from "joi"
import {
  getRegexEmail,
  getRegexObjectID,
  getRegexPassword,
  getRegexPhoneNumber
} from "../utils/commonFunction"
import { NextFunction, Request, Response } from "express"

const register = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Email: Joi.string().min(3).max(100).pattern(getRegexEmail()).required(),
    Phone: Joi.string().min(3).max(100).pattern(getRegexPhoneNumber()).required(),
    Address: Joi.string().min(3).max(30).required(),
    DateOfBirth: Joi.date().required(),
    RoleID: Joi.number().integer().valid(3, 4).required(),
    Gender: Joi.number().integer().valid(1, 2).required(),
    FullName: Joi.string().min(3).max(30).required(),
    AvatarPath: Joi.string().optional(),
    Subject: Joi.string().pattern(getRegexObjectID()).optional(),
    Subjects: Joi.array().items(Joi.string().pattern(getRegexObjectID())).optional(),
    IsByGoogle: Joi.boolean().optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    OldPassword: Joi.string().min(3).max(100).required(),
    NewPassword: Joi.string().min(3).max(100).pattern(getRegexPassword()).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const AccountValidation = {
  register,
  changePassword
}

export default AccountValidation
