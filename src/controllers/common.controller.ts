import { Request, Response } from "express"
import CommonService from "../services/common.service"
import OpenaiService from "../services/openai.service"

const getListSystemKey = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncGetListSystemKey()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const createSystemKey = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncCreateSystemKey(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getProfitPercent = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncGetProfitPercent()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const changeProfitPercent = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncChangeProfitPercent(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const insertParentKey = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncInsertParentKey(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListTabs = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncGetListTabs(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const chatbot = async (req: Request, res: Response) => {
  try {
    const response = await OpenaiService.generateText(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getTotalUserAndSubject = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncGetTotalUserAndSubject()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}
const CommonController = {
  getListSystemKey,
  createSystemKey,
  getProfitPercent,
  changeProfitPercent,
  insertParentKey,
  getListTabs,
  chatbot,
  getTotalUserAndSubject
}

export default CommonController
