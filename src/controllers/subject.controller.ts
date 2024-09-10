import { Request, Response } from "express"
import SubjectService from "../services/subject.service"

const createSubject = async (req: Request, res: Response) => {
  try {
    const response = await SubjectService.fncCreateSubject(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListSubject = async (req: Request, res: Response) => {
  try {
    const response = await SubjectService.fncGetListSubject(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateSubject = async (req: Request, res: Response) => {
  try {
    const response = await SubjectService.fncUpdateSubject(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const deleteSubject = async (req: Request, res: Response) => {
  try {
    const response = await SubjectService.fncDeleteSubject(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getDetailSubject = async (req: Request, res: Response) => {
  try {
    const response = await SubjectService.fncGetDetailSubject(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const SubjectController = {
  createSubject,
  getListSubject,
  updateSubject,
  deleteSubject,
  getDetailSubject
}

export default SubjectController
