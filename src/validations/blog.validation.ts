import Joi from "joi"
import { getRegexObjectID } from "../utils/commonFunction"
import { NextFunction, Request, Response } from "express"

const createUpdateBlog = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Subject: Joi.string().pattern(getRegexObjectID()).required(),
    Title: Joi.string().min(1).required(),
    Price: Joi.number().integer().min(1).required(),
    Gender: Joi.array().items(Joi.number().valid(1, 2).optional()).required(),
    NumberSlot: Joi.number().integer().min(1).required(),
    LearnType: Joi.array().items(Joi.number().valid(1, 2).optional()).required(),
    Address: Joi.string().min(1).optional(),
    ProfessionalLevel: Joi.number().valid(1, 2, 3).required(),
    StartDate: Joi.date().required(),
    Schedules: Joi.array().items(
      Joi.object({
        DateValue: Joi.number().required(),
        StartTime: Joi.string().required(),
        EndTime: Joi.string().required(),
      })
    ).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const BlogValidation = {
  createUpdateBlog,
}

export default BlogValidation
