import { Request, Response } from "express"
import FileService from "../services/file.service"

const uploadFileList = async (req: Request, res: Response) => {
  try {
    const response = await FileService.fncUploadFileList(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const uploadFileSingle = async (req: Request, res: Response) => {
  try {
    const response = await FileService.fncUploadFileSingle(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const uploadDocumentList = async (req: Request, res: Response) => {
  try {
    const response = await FileService.fncUploadDocumentList(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const FileController = {
  uploadFileList,
  uploadFileSingle,
  uploadDocumentList
}

export default FileController
