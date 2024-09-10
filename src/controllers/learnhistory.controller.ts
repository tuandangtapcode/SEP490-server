import { Request, Response } from "express"
import LearnHistoryService from "../services/learnhistory.service"

const createLearnHistory = async (req: Request, res: Response) => {
  try {
    const response = await LearnHistoryService.fncCreateLearnHistory(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListLearnHistory = async (req: Request, res: Response) => {
  try {
    const response = await LearnHistoryService.fncGetListLearnHistory(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const LearnHistoryController = {
  createLearnHistory,
  getListLearnHistory
}

export default LearnHistoryController
