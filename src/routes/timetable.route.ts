import express from "express"
import TimeTableController from "../controllers/timetable.controller"
import authMiddleware from '../middlewares/auth.middleware'
import { Roles } from "../utils/constant"
import TimeTableValidation from "../validations/timetable.validation"

const TimeTableRoute = express.Router()

TimeTableRoute.post("/createTimeTable",
  authMiddleware([Roles.ROLE_STUDENT]),
  TimeTableValidation.createTimeTable,
  TimeTableController.createTimeTable
)
TimeTableRoute.get("/getTimeTableOfTeacherOrStudent/:UserID",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  TimeTableController.getTimeTableOfTeacherOrStudent
)
TimeTableRoute.get("/attendanceTimeTable/:TimeTableID",
  authMiddleware([Roles.ROLE_TEACHER]),
  TimeTableController.attendanceTimeTable
)
TimeTableRoute.post("/updateTimeTable",
  authMiddleware([Roles.ROLE_TEACHER]),
  TimeTableValidation.updateTimeTable,
  TimeTableController.updateTimeTable
)
TimeTableRoute.get("/getTimeTableByUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  TimeTableController.getTimeTableByUser
)

export default TimeTableRoute
