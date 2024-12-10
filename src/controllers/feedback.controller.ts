import { Request, Response } from "express"
import FeedbackSerivce from "../services/feedback.service"

const createFeedback = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncCreateFeedback(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListFeedbackOfTeacher = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncGetListFeedbackOfTeacher(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const deletedFeedback = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncDeleteFeedback(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListFeedback = async (req: Request, res: Response) => {
  try {
    const response = await FeedbackSerivce.fncGetListFeedback(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const FeedbackController = {
  createFeedback,
  getListFeedbackOfTeacher,
  deletedFeedback,
  getListFeedback
}

export default FeedbackController
