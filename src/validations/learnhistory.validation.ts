import Joi from "joi"
import { NextFunction, Request, Response } from "express"
import { getRegexObjectID } from "../utils/stringUtils"

const createLearnHistory = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    Teacher: Joi.string().pattern(getRegexObjectID()).required(),
    Subject: Joi.string().pattern(getRegexObjectID()).required(),
    TotalLearned: Joi.number().min(1).required(),
    TeacherName: Joi.string().min(1).required(),
    TeacherEmail: Joi.string().min(1).required(),
    SubjectName: Joi.string().min(1).required(),
    StudentName: Joi.string().min(1).required(),
    StudentEmail: Joi.string().min(1).required(),
    Times: Joi.array().items(Joi.string().min(1)).required()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const LearnhistoryValidation = {
  createLearnHistory,
}

export default LearnhistoryValidation
