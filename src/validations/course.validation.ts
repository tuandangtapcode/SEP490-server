import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import { getRegexObjectID } from "../utils/stringUtils"


const createUpdateCourse = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    CourseID: Joi.string().pattern(getRegexObjectID()).optional(),
    Subject: Joi.string().pattern(getRegexObjectID()).required(),
    Teacher: Joi.string().pattern(getRegexObjectID()).required(),
    QuantitySlot: Joi.number().min(1).required(),
    Price: Joi.number().min(1).required(),
    ExpensePrice: Joi.number().min(1).required(),
    Title: Joi.string().min(1).required(),
    Description: Joi.string().min(1).required(),
    Level: Joi.number().valid(1, 2, 3).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const CourseValidation = {
  createUpdateCourse
}

export default CourseValidation
