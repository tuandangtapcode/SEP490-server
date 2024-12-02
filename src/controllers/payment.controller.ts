import { Request, Response } from "express"
import PaymentService from "../services/payment.service"

const createPayment = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncCreatePayment(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListPaymentHistoryByUser = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncGetListPaymentHistoryByUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const changePaymentStatus = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncChangePaymentStatus(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListPayment = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncGetListPayment(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const exportExcel = async (req: Request, res: Response) => {
  try {
    await PaymentService.fncExportExcel(res)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListTransfer = async (req: Request, res: Response) => {
  try {
    const response = await PaymentService.fncGetListTransfer(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const PaymentController = {
  createPayment,
  getListPaymentHistoryByUser,
  changePaymentStatus,
  getListPayment,
  exportExcel,
  getListTransfer,
}

export default PaymentController
