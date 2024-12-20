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

const getTimeTableOfTeacherOrStudent = async (req: Request, res: Response) => {
  try {
    const response = await TimeTableService.fncGetTimeTableOfTeacherOrStudent(req)
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

const attendanceOrCancelTimeTable = async (req: Request, res: Response) => {
  try {
    const response = await TimeTableService.fncAttendanceOrCancelTimeTable(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const TimeTableController = {
  createTimeTable,
  getTimeTableOfTeacherOrStudent,
  attendanceTimeTable,
  updateTimeTable,
  getTimeTableByUser,
  attendanceOrCancelTimeTable
}

export default TimeTableController
