import { Request, Response } from "express"
import TimeTableService from "../services/timetable.service"

const createTimeTable = async (req: Request, res: Response) => {
  try {
    const response = await TimeTableService.fncCreateTimeTable(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getTimeTableOfTeacherAndStudent = async (req: Request, res: Response) => {
  try {
    const response = await TimeTableService.fncGetTimeTableOfTeacherAndStudent(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const attendanceTimeTable = async (req: Request, res: Response) => {
  try {
    const response = await TimeTableService.fncAttendanceTimeTable(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateTimeTable = async (req: Request, res: Response) => {
  try {
    const response = await TimeTableService.fncUpdateTimeTable(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getTimeTableByUser = async (req: Request, res: Response) => {
  try {
    const response = await TimeTableService.fncGetTimeTableByUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const TimeTableController = {
  createTimeTable,
  getTimeTableOfTeacherAndStudent,
  attendanceTimeTable,
  updateTimeTable,
  getTimeTableByUser
}

export default TimeTableController
