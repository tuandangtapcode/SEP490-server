import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import { getRegexObjectID } from '../utils/stringUtils'

const createUpdateSubjectCate = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectCateName: Joi.string().min(1).max(256).required(),
    Description: Joi.string().min(1).max(256).required(),
    SubjectCateID: Joi.string().pattern(getRegexObjectID()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const SubjectCateValidation = {
  createUpdateSubjectCate,
}

export default SubjectCateValidation