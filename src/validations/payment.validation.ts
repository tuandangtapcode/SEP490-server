import Joi from "joi"
import { NextFunction, Request, Response } from "express"
import { getRegexEmail, getRegexObjectID } from "../utils/stringUtils"

const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Description: Joi.string().min(3).max(256).required(),
    PaymentType: Joi.number().min(1).max(3).required(),
    TotalFee: Joi.number().min(1).required(),
    TraddingCode: Joi.number().min(1).required(),
    Receiver: Joi.string().pattern(getRegexObjectID()).optional(),
    PaymentMethod: Joi.number().valid(1, 2).required(),
    Percent: Joi.number().required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const changePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PaymentID: Joi.string().pattern(getRegexObjectID()).required(),
    Email: Joi.string().pattern(getRegexEmail()).required(),
    PaymentStatus: Joi.number().min(1).max(3).required(),
    TotalFee: Joi.number().min(1).required(),
    FullName: Joi.string().min(1).required(),
    RoleID: Joi.number().valid(3, 4).required(),
    Image: Joi.any()
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
  changePaymentStatus
}

export default PaymentValidation
