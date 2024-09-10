import Joi from 'joi'
import { getRegexEmail, getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'

const createBankingInfor = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    BankID: Joi.number().min(1).required(),
    UserBankName: Joi.string().required(),
    UserBankAccount: Joi.number().min(1).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const updateBankingInfor = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    BankID: Joi.number().min(1).required(),
    UserBankName: Joi.string().required(),
    UserBankAccount: Joi.number().min(1).required(),
    BankingInforID: Joi.string().pattern(getRegexObjectID()).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getBankingInforOfUser = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    FullName: Joi.string().min(1).required(),
    UserID: Joi.string().pattern(getRegexObjectID()).required(),
    Email: Joi.string().pattern(getRegexEmail()).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const BankInforValidation = {
  createBankingInfor,
  updateBankingInfor,
  getBankingInforOfUser
}

export default BankInforValidation
