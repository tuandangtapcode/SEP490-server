import { Request, Response } from "express"
import BankingInforService from "../services/bankinginfor.service"

const createBankingInfor = async (req: Request, res: Response) => {
  try {
    const response = await BankingInforService.fncCreateBankingInfor(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getDetailBankingInfor = async (req: Request, res: Response) => {
  try {
    const response = await BankingInforService.fncGetDetailBankingInfor(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListBankingInfor = async (req: Request, res: Response) => {
  try {
    const response = await BankingInforService.fncGetListBankingInfor(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const deleteBankingInfor = async (req: Request, res: Response) => {
  try {
    const response = await BankingInforService.fncDeleteBankingInfor(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateBankingInfor = async (req: Request, res: Response) => {
  try {
    const response = await BankingInforService.fncUpdateBankingInfor(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getBankingInforOfUser = async (req: Request, res: Response) => {
  try {
    const response = await BankingInforService.fncGetBankingInforOfUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const BankingInforController = {
  createBankingInfor,
  getDetailBankingInfor,
  deleteBankingInfor,
  updateBankingInfor,
  getListBankingInfor,
  getBankingInforOfUser
}

export default BankingInforController
