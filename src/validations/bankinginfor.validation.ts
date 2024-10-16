import Joi from 'joi'
import { getRegexEmail, getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'

const createUpdateBankingInfor = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    BankID: Joi.number().min(1).required(),
    UserBankName: Joi.string().required(),
    UserBankAccount: Joi.number().min(1).required(),
    BankingInforID: Joi.string().pattern(getRegexObjectID()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const BankInforValidation = {
  createUpdateBankingInfor,
}

export default BankInforValidation
