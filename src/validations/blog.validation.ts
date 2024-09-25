import Joi from "joi"
import { getRegexObjectID } from "../utils/commonFunction"
import { parameterValidation } from "./common.validation"
import { NextFunction, Request, Response } from "express"

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Description: Joi.string().min(1).required(),
    Title: Joi.string().min(1).required(),
    Content: Joi.string().min(1).required(),
    Avatar: Joi.string().min(1).required(),
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

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Teacher: Joi.string().pattern(getRegexObjectID()).required(),
    BlogID: Joi.string().pattern(getRegexObjectID()).required(),
    Title: Joi.string().min(1).required(),
    Content: Joi.string().min(1).required(),
    Avatar: Joi.string().min(1).required(),
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const BlogValidation = {
  createBlog,
  getDetailBlog,
  getListBlog,
  updateBlog
}

export default BlogValidation
