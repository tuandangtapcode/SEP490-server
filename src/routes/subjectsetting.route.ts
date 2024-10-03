import express from "express"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import SubjectSettingController from "../controllers/subjectsetting.controller"
const SubjectSettingRoute = express.Router()

SubjectSettingRoute.post("/createSubjectSetting",
    SubjectSettingController.createSubjectSetting
)

SubjectSettingRoute.post("/getListSubjectSetting",
    SubjectSettingController.getListSubjectSetting
)

SubjectSettingRoute.post("/getListSubjectSettingByTeacher",
    SubjectSettingController.getListSubjectSettingByTeacher
)

SubjectSettingRoute.post("/getListTeacherSubjectTeacherandSubject",
    SubjectSettingController.getListTeacherSubjectTeacherandSubject
)

SubjectSettingRoute.get("/deleteSubjectSetting/:SubjectSettingID",
    SubjectSettingController.deleteSubjectSetting
)

SubjectSettingRoute.post("/updateSubjectSetting",
    SubjectSettingController.updateSubjectSetting
)



export default SubjectSettingRoute