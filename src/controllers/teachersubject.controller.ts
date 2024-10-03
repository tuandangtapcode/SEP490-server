import { Request, Response } from "express"
import TeacherSubjectService from "../services/teachersubject.service"


const createTeacherSubject = async (req: Request, res: Response) => {
    try {
      const response = await TeacherSubjectService.fncCreateTeacherSubject(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const getListTeacherSubject = async (req: Request, res: Response) => {
    try {
      const response = await TeacherSubjectService.fncGetListTeacherSubject(req)
      return res.status(response.statusCode).json(response)
    } catch (error : any) {
      return res.status(500).json(error.toString())
    }
}

const updateTeacherSubject = async (req: Request, res: Response) => {
    try {
      const response = await TeacherSubjectService.fncUpdateTeacherSubject(req)
      return res.status(response.statusCode).json(response)
    } catch (error : any) {
      return res.status(500).json(error.toString())
    }
}

const deleteTeacherSubject = async (req: Request, res: Response) => {
    try {
      const response = await TeacherSubjectService.fncDeleteTeacherSubject(req)
      return res.status(response.statusCode).json(response)
    } catch (error : any) {
      return res.status(500).json(error.toString())
    }
}

const TeacherSubjectController = {
createTeacherSubject,
getListTeacherSubject,
updateTeacherSubject,
deleteTeacherSubject
}

export default TeacherSubjectController
