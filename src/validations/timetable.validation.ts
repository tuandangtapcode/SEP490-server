import Joi from "joi"
import { getRegexObjectID } from "../utils/commonFunction"
import { NextFunction, Request, Response } from "express"

const createTimeTable = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.array().items(
    Joi.object({
      LearnHistory: Joi.string().pattern(getRegexObjectID()).required(),
      Teacher: Joi.string().pattern(getRegexObjectID()).required(),
      Subject: Joi.string().pattern(getRegexObjectID()).required(),
      StartTime: Joi.date().required(),
      EndTime: Joi.date().required(),
      LearnType: Joi.number().integer().valid(1, 2).required(),
      Address: Joi.string().min(1).optional()
    })
  )
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const updateTimeTable = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    TimeTableID: Joi.string().pattern(getRegexObjectID()).required(),
    DateAt: Joi.date().required(),
    StartTime: Joi.date().required(),
    EndTime: Joi.date().required(),
    Documents: Joi.array().items(
      Joi.object({
        DocName: Joi.string().min(1).required(),
        DocPath: Joi.string().min(1).required(),
        _id: Joi.string().pattern(getRegexObjectID())
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

const TimeTableValidation = {
  createTimeTable,
  updateTimeTable
}

export default TimeTableValidation
