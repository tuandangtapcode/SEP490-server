import Joi from "joi"
import { getRegexObjectID } from "../utils/commonFunction"
import { parameterValidation } from "./common.validation"
import { NextFunction, Request, Response } from "express"

const createUpdateBlog = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Title: Joi.string().min(1).required(),
    Price: Joi.number().integer().min(0).required(),
    Content: Joi.string().min(1).required(),
    NumberSlot: Joi.number().integer().min(0).required(),
    LearnType: Joi.number().integer().min(0).max(2).required(),
    Address: Joi.string().min(1),
    Schedules: Joi
    .array().items(
      Joi.object({
        DateAt: Joi.string().min(1).required(),
        StartTime: Joi.date().required(),
        EndTime: Joi.date().required(),
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

const getDetailBlog = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = parameterValidation("BlogID")
  try {
    await trueCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const getListBlog = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    PageSize: Joi.number().integer().min(0).required(),
    CurrentPage: Joi.number().integer().min(0).required(),
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
  getDetailBlog,
  getListBlog,
}

export default BlogValidation
