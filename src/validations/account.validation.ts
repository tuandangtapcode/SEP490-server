import Joi from "joi"
import { getRegexEmail, getRegexObjectID, getRegexPassword } from "../utils/commonFunction"
import { NextFunction, Request, Response } from "express"

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { Subject } = req.body
  const trueCondition = Joi.object({
    Email: Joi.string().min(3).max(100).pattern(getRegexEmail()).required(),
    RoleID: Joi.number().integer().valid(3, 4).required(),
    FullName: Joi.string().min(3).max(30).required(),
    Subject: !!Subject ? Joi.string().pattern(getRegexObjectID()) : Joi.string().empty(""),
    IsByGoogle: Joi.boolean()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const registerByGoogle = async (req: Request, res: Response, next: NextFunction) => {
  const { Subject } = req.body
  const trueCondition = Joi.object({
    email: Joi.string().min(3).max(100).pattern(getRegexEmail()).required(),
    given_name: Joi.string().min(3).max(30).required(),
    family_name: Joi.string().min(3).max(30).required(),
    picture: Joi.string().min(3).max(100).required(),
    RoleID: Joi.number().integer().valid(3, 4).required(),
    Subject: !!Subject ? Joi.string().pattern(getRegexObjectID()) : Joi.string().empty(""),
    IsByGoogle: Joi.boolean()
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
  registerByGoogle,
  changePassword
}

export default AccountValidation
