import { Request, Response } from "express"
import SystemKeyService from "../services/systemkey.service"

const getListSystemKey = async (req: Request, res: Response) => {
  try {
    const response = await SystemKeyService.fncGetListSystemKey()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const SystemKeyController = {
  getListSystemKey
}

export default SystemKeyController
