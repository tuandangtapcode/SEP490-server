import express from "express"
import UserController from "../controllers/user.controller"
import authMiddleware from "../middlewares/auth.middleware"
import upload from '../middlewares/clouddinary.middleware'
import { Roles } from "../utils/constant"
import UserValidation from "../validations/user.validation"
import { parameterValidation } from "../validations/common.validation"

const UserRoute = express.Router()

UserRoute.get("/getDetailProfile",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_STAFF_USER,
    Roles.ROLE_STAFF_SUBJECT,
    Roles.ROLE_STAFF_INBOX,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
  ]),
  UserController.getDetailProfile
)
UserRoute.post("/changeProfile",
  authMiddleware([Roles.ROLE_TEACHER, Roles.ROLE_STUDENT]),
  UserController.changeProfile
)
UserRoute.get("/requestConfirmRegister",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.requestConfirmRegister
)
UserRoute.post("/responseConfirmRegister",
  authMiddleware([Roles.ROLE_ADMIN,]),
  UserValidation.responseConfirmRegister,
  UserController.responseConfirmRegister
)
UserRoute.post("/getListTeacher",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.getListTeacher,
  UserController.getListTeacher
)
UserRoute.post("/getListTeacherByUser",
  UserValidation.getListTeacherByUser,
  UserController.getListTeacherByUser
)
UserRoute.post("/getDetailTeacher",
  UserValidation.getDetailTeacher,
  UserController.getDetailTeacher
)
UserRoute.post("/getListStudent",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.getListStudent,
  UserController.getListStudent
)
UserRoute.post("/inactiveOrActiveAccount",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.inactiveOrActiveAccount,
  UserController.inactiveOrActiveAccount
)
UserRoute.get("/getListSubjectSettingByTeacher",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.getListSubjectSettingByTeacher
)
UserRoute.get("/createSubjectSetting/:SubjectID",
  authMiddleware([Roles.ROLE_TEACHER]),
  parameterValidation("SubjectID"),
  UserController.createSubjectSetting
)
UserRoute.post("/updateSubjectSetting",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserValidation.updateSubjectSetting,
  UserController.updateSubjectSetting
)
UserRoute.get("/deleteSubjectSetting/:SubjectSettingID",
  authMiddleware([Roles.ROLE_TEACHER]),
  parameterValidation("SubjectSettingID"),
  UserController.deleteSubjectSetting
)
UserRoute.post("/confirmSubjectSetting",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.confirmSubjectSetting,
  UserController.confirmSubjectSetting
)
UserRoute.get("/getListTopTeacherBySubject/:SubjectID",
  parameterValidation("SubjectID"),
  UserController.getListTopTeacherBySubject
)
UserRoute.get("/getListSubjectOfTeacher/:TeacherID",
  parameterValidation("TeacherID"),
  UserController.getListSubjectOfTeacher
)

export default UserRoute
