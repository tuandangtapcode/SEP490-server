import { Request, Response } from "express"
import CourseService from "../services/course.service" 

const createCourse = async (req: Request, res: Response) => {
    try {
      const response = await CourseService.fncCreateCourse(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const getListCourse = async (req: Request, res: Response) => {
    try {
      const response = await CourseService.fncGetListCourse(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const getListCourseByTeacher = async (req: Request, res: Response) => {
    try {
      const response = await CourseService.fncGetListCourseByTeacher(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const updateCourse = async (req: Request, res: Response) => {
    try {
      const response = await CourseService.fncUpdateCourse(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const getListCourseTeacherandSubject = async (req: Request, res: Response) => {
    try {
      const response = await CourseService.fncGetListCourseTeacherandSubject(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const deleteCourse = async (req: Request, res: Response) => {
    try {
      const response = await CourseService.fncDeleteCourse(req)
      return res.status(response.statusCode).json(response)
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}
const CourseController = {
    createCourse,
    getListCourse,
    getListCourseByTeacher,
    getListCourseTeacherandSubject,
    updateCourse,
    deleteCourse
  }
  
  export default CourseController