import { Request, Response } from "express"
import SubjectCateService from "../services/subjectcate.service"

const createSubjectCate = async (req: Request, res: Response) => {
  try {
    const response = await SubjectCateService.fncCreateSubjectCate(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListSubjectCate = async (req: Request, res: Response) => {
  try {
    const response = await SubjectCateService.fncGetListSubjectCate(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateSubjectCate = async (req: Request, res: Response) => {
  try {
    const response = await SubjectCateService.fncUpdateSubjectCate(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const deleteSubjectCate = async (req: Request, res: Response) => {
  try {
    const response = await SubjectCateService.fncDeleteSubjectCate(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getDetailSubjectCate = async (req: Request, res: Response) => {
  try {
    const response = await SubjectCateService.fncGetDetailSubjectCate(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListSubjectCateAndSubject = async (req: Request, res: Response) => {
  try {
    const response = await SubjectCateService.fncGetListSubjectCateAndSubject()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListSubjectCateByAdmin = async (req: Request, res: Response) => {
  try {
    const response = await SubjectCateService.fncGetListSubjectCateByAdmin(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const SubjectCateController = {
  createSubjectCate,
  getListSubjectCate,
  updateSubjectCate,
  deleteSubjectCate,
  getDetailSubjectCate,
  getListSubjectCateAndSubject,
  getListSubjectCateByAdmin
}

export default SubjectCateController
