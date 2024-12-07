import Joi from "joi"
import { NextFunction, Request, Response } from "express"
import { getRegexObjectID } from "../utils/stringUtils"

const createTimeTable = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.array().items(
    Joi.object({
      LearnHistory: Joi.string().pattern(getRegexObjectID()).required(),
      Teacher: Joi.string().pattern(getRegexObjectID()).required(),
      Subject: Joi.string().pattern(getRegexObjectID()).required(),
      StartTime: Joi.date().required(),
      EndTime: Joi.date().required(),
      LearnType: Joi.number().valid(1, 2).required(),
      Address: Joi.string().min(1).optional(),
      Price: Joi.number().required()
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
