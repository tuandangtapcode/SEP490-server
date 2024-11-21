import Joi from "joi"
import {
  getRegexEmail,
  getRegexPassword,
} from "../utils/commonFunction"
import { NextFunction, Request, Response } from "express"

const register = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Email: Joi.string().min(3).max(100).pattern(getRegexEmail()).required(),
    RoleID: Joi.number().integer().valid(3, 4).required(),
    FullName: Joi.string().min(1).max(30).required(),
    IsByGoogle: Joi.boolean().required(),
    AvatarPath: Joi.string().min(1).optional(),
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
    NewPassword: Joi.string().min(8).max(100).pattern(getRegexPassword()).required(),
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
