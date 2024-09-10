import Joi from "joi"
import { getRegexObjectID } from "../utils/commonFunction"
import { fileValidation } from "./common.validation"
import { NextFunction, Request, Response } from "express"

const createTimeTable = async (req: Request, res: Response, next: NextFunction) => {
  const isHasAddress = req.body.every((i: any) => !!i.Address)
  const trueCondition = Joi.array().items(
    Joi.object({
      LearnHistory: Joi.string().pattern(getRegexObjectID()).required(),
      Teacher: Joi.string().pattern(getRegexObjectID()).required(),
      Subject: Joi.string().pattern(getRegexObjectID()).required(),
      DateAt: Joi.date().required(),
      StartTime: Joi.date().required(),
      EndTime: Joi.date().required(),
      LearnType: Joi.number().integer().valid(1, 2).required(),
      Address: !!isHasAddress ? Joi.string().min(1) : Joi.string().empty("")
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
    TimeTablID: Joi.string().pattern(getRegexObjectID()).required(),
    DateAt: Joi.date().required(),
    StartTime: Joi.date().required(),
    EndTime: Joi.date().required(),
  })
  console.log(req.file);
  const trueConditionWithFile = fileValidation("Document", "application")
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    await trueConditionWithFile.validateAsync(req.file, { abortEarly: false })
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
