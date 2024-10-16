import Joi from 'joi'
import { getRegexObjectID } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'

const createUpdateSubject = async (req: Request, res: Response, next: NextFunction) => {
  const trueCondition = Joi.object({
    SubjectCateID: Joi.string().pattern(getRegexObjectID()).required(),
    SubjectName: Joi.string().min(1).required(),
    Avatar: Joi.string().min(1).required(),
    SubjectID: Joi.string().pattern(getRegexObjectID()).optional()
  })
  try {
    await trueCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    return res.status(400).json(error.toString())
  }
}

const SubjectValidation = {
  createUpdateSubject,
}

export default SubjectValidation
