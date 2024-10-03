import express from "express"
import TeacherSubjectController from "../controllers/teachersubject.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const TeacherSubjectRoute = express.Router()

TeacherSubjectRoute.post("/createTeacherSubject",
    TeacherSubjectController.createTeacherSubject
)

TeacherSubjectRoute.post("/getListTeacherSubject",
    TeacherSubjectController.getListTeacherSubject
)

TeacherSubjectRoute.post("/updateTeacherSubject",
    TeacherSubjectController.updateTeacherSubject
)

TeacherSubjectRoute.get("/deleteTeacherSubject/:TeacherSubjectID",
    TeacherSubjectController.deleteTeacherSubject
)

export default TeacherSubjectRoute
