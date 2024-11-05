import Joi from "joi"
import { getRegexObjectID } from "../utils/commonFunction"
import { NextFunction, Request, Response } from "express"

const createUpdateBlog = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Title: Joi.string().min(1).required(),
    Price: Joi.number().integer().min(0).required(),
    Content: Joi.string().min(1).required(),
    Gender: Joi.number().integer().valid(1, 2).required(),
    NumberSlot: Joi.number().integer().min(0).required(),
    NumberSlotOfWeek: Joi.number().integer().min(0).required(),
    Subject: Joi.string().pattern(getRegexObjectID()).required(),
    LearnTypes: Joi.array().items(Joi.number().valid(1, 2).optional()).optional(),
    Address: Joi.string().min(1),
    Schedules: Joi
      .array().items(
        Joi.object({
          DateAt: Joi.date().required(),
          StartTime: Joi.string().min(1).required(),
          EndTime: Joi.string().min(1).required(),
        })
      )
      .optional(),
    BlogID: Joi.string().pattern(getRegexObjectID()).optional()
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
