import express from "express"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import CourseController from "../controllers/course.controller"
import CourseValidation from "../validations/course.validation"

const CourseRoute = express.Router()

CourseRoute.post("/createCourse",
  authMiddleware([Roles.ROLE_TEACHER]),
  CourseValidation.createUpdateCourse,
  CourseController.createCourse
)
CourseRoute.post("/getListCourse",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  CourseController.getListCourse
)
CourseRoute.post("/getListCourseByTeacher",
  authMiddleware([Roles.ROLE_TEACHER]),
  CourseController.getListCourseByTeacher
)
CourseRoute.post("/getListCourseOfTeacher",
  CourseController.getListCourseOfTeacher
)
CourseRoute.get("/deleteCourse/:CourseID",
  authMiddleware([Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  CourseController.deleteCourse
)
CourseRoute.post("/updateCourse",
  authMiddleware([Roles.ROLE_TEACHER]),
  CourseValidation.createUpdateCourse,
  CourseController.updateCourse
)

export default CourseRoute