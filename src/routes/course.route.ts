import express from "express"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import CourseController from "../controllers/course.controller" 
const CourseRoute = express.Router()

CourseRoute.post("/createCourse",
    CourseController.createCourse
)

CourseRoute.post("/getListCourse",
    CourseController.getListCourse
)

CourseRoute.post("/getListCourseByTeacher",
    CourseController.getListCourseByTeacher
)

CourseRoute.post("/getListCourseTeacherandSubject",
    CourseController.getListCourseTeacherandSubject
)

CourseRoute.get("/deleteCourse/:CourseID",
    CourseController.deleteCourse
)

CourseRoute.post("/updateCourse",
    CourseController.updateCourse
)

export default CourseRoute