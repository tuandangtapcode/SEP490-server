
import { Request, Response } from "express"
import GenerateService from "../services/generate.service"

const generateText = async (req: Request, res: Response) => {
  try {
    const response = await GenerateService.fncGenerateText(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const GenerateController = {
  generateText
}

export default GenerateController