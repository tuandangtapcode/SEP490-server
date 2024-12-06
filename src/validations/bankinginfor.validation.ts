import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import { getRegexObjectID } from '../utils/stringUtils'

const createUpdateBankingInfor = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    BankID: Joi.number().min(1).required(),
    UserBankName: Joi.string().required(),
    UserBankAccount: Joi.string().required(),
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
