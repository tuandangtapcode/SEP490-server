import Joi from "joi"
import { getRegexEmail, getRegexObjectID } from '../utils/commonFunction'
import { fileValidation } from "./common.validation"
import { NextFunction, Request, Response } from "express"

const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { Receiver, PaymentStatus } = req.body
  const trueCondition = Joi.object({
    Description: Joi.string().min(3).max(256).required(),
    PaymentType: Joi.number().min(1).max(3).required(),
    TotalFee: Joi.number().min(1).required(),
    TraddingCode: Joi.number().min(1).required(),
    Receiver: !!Receiver ? Joi.string().pattern(getRegexObjectID()) : Joi.string().empty(""),
    PaymentStatus: !!PaymentStatus ? Joi.number().min(1).max(3).required() : Joi.number()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListPaymentHistoryByUser = async (req: Request, res: Response, next: NextFunction) => {
  const { PaymentType, PaymentStatus } = req.body
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(1).required(),
    CurrentPage: Joi.number().integer().min(1).required(),
    TraddingCode: Joi.string().empty(""),
    PaymentType: !!PaymentType ? Joi.number().min(1).max(3) : Joi.number(),
    PaymentStatus: !!PaymentStatus ? Joi.number().min(1).max(3) : Joi.number(),
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
    RoleID: Joi.number().integer().valid(3, 4).required()
  })
  const trueConditionWithFile = fileValidation("Image", "image")
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    await trueConditionWithFile.validateAsync(req.file, { abortEarly: false })
    await
      next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { PaymentType, PaymentStatus } = req.body
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(1).required(),
    CurrentPage: Joi.number().integer().min(1).required(),
    TextSearch: Joi.string().empty(""),
    PaymentType: !!PaymentType ? Joi.number().min(1).max(3) : Joi.number(),
    PaymentStatus: !!PaymentStatus ? Joi.number().min(1).max(3) : Joi.number()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListTransfer = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(1).required(),
    CurrentPage: Joi.number().integer().min(1).required(),
    FromDate: Joi.date().required(),
    ToDate: Joi.date().required()
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
    Reports: Joi.array().items(
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
  getListPaymentHistoryByUser,
  changePaymentStatus,
  getListPayment,
  getListTransfer,
  sendRequestExplanation
}

export default PaymentValidation
