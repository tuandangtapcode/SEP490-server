import { Request, Response } from "express"
import ConfirmService from "../services/confirm.service"

const createConfirm = async (req: Request, res: Response) => {
  try {
    const response = await ConfirmService.fncCreateConfirm(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateConfirm = async (req: Request, res: Response) => {
  try {
    const response = await ConfirmService.fncUpdateConfirm(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const changeConfirmStatus = async (req: Request, res: Response) => {
  try {
    const response = await ConfirmService.fncChangeConfirmStatus(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListConfirm = async (req: Request, res: Response) => {
  try {
    const response = await ConfirmService.fncGetListConfirm(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const ConfirmController = {
  createConfirm,
  updateConfirm,
  changeConfirmStatus,
  getListConfirm
}

export default ConfirmController