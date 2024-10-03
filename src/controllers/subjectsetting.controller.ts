import { Request, Response } from "express"
import SubjectSettingService from "../services/teachersubject.service"

const createSubjectSetting = async (req: Request, res: Response) => {
    try {
      const response = await SubjectSettingService.fncCreateSubjectSetting(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const getListSubjectSetting = async (req: Request, res: Response) => {
    try {
      const response = await SubjectSettingService.fncGetListSubjectSetting(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const getListSubjectSettingByTeacher = async (req: Request, res: Response) => {
    try {
      const response = await SubjectSettingService.fncGetListSubjectSettingByTeacher(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const updateSubjectSetting = async (req: Request, res: Response) => {
    try {
      const response = await SubjectSettingService.fncUpdateSubjectSetting(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const getListTeacherSubjectTeacherandSubject = async (req: Request, res: Response) => {
    try {
      const response = await SubjectSettingService.fncGetListTeacherSubjectTeacherandSubject(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const deleteSubjectSetting = async (req: Request, res: Response) => {
    try {
      const response = await SubjectSettingService.fncDeleteSubjectSetting(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}
const SubjectSettingController = {
    createSubjectSetting,
    getListSubjectSetting,
    getListSubjectSettingByTeacher,
    getListTeacherSubjectTeacherandSubject,
    updateSubjectSetting,
    deleteSubjectSetting
  }
  
  export default SubjectSettingController