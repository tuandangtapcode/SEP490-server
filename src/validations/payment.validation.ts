import Joi from "joi"
import { getRegexEmail, getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from "express"

const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Description: Joi.string().min(3).max(256).required(),
    PaymentType: Joi.number().min(1).max(3).required(),
    TotalFee: Joi.number().min(1).required(),
    TraddingCode: Joi.number().min(1).required(),
    Receiver: Joi.string().pattern(getRegexObjectID()).optional(),
    PaymentStatus: Joi.number().min(1).max(3).required().optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const sendRequestExplanation = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PaymentID: Joi.string().pattern(getRegexObjectID()).required(),
    Email: Joi.string().pattern(getRegexEmail()).required(),
    FullName: Joi.string().min(1).required(),
    Issues: Joi.array().items(
      Joi.object({
        DateAt: Joi.string().min(1).required(),
        Time: Joi.string().min(1).required(),
        Title: Joi.string().min(1).required(),
        Content: Joi.string().min(1).required()
      })
    )
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const PaymentValidation = {
  createPayment,
  sendRequestExplanation
}

export default PaymentValidation
