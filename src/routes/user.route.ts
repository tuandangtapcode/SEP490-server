import express, { Request, Response } from "express"
import UserController from "../controllers/user.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import UserValidation from "../validations/user.validation"
import SubjectSetting from "../models/subjectsetting"

const UserRoute = express.Router()

UserRoute.get("/getDetailProfile",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  UserController.getDetailProfile
)
UserRoute.post("/changeProfile",
  authMiddleware([Roles.ROLE_TEACHER, Roles.ROLE_STUDENT]),
  UserValidation.changeProfile,
  UserController.changeProfile
)
UserRoute.get("/requestConfirmRegister",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.requestConfirmRegister
)
UserRoute.post("/responseConfirmRegister",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  UserController.responseConfirmRegister
)
UserRoute.post("/getListTeacher",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  UserController.getListTeacher
)
UserRoute.post("/getListTeacherByUser",
  UserController.getListTeacherByUser
)
UserRoute.post("/getDetailTeacher",
  UserController.getDetailTeacher
)
UserRoute.post("/getListStudent",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  UserController.getListStudent
)
UserRoute.post("/inactiveOrActiveAccount",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserController.inactiveOrActiveAccount
)
UserRoute.get("/getListSubjectSettingByTeacher",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.getListSubjectSettingByTeacher
)
UserRoute.get("/createSubjectSetting/:SubjectID",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.createSubjectSetting
)
UserRoute.post("/updateSubjectSetting",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserValidation.updateSubjectSetting,
  UserController.updateSubjectSetting
)
UserRoute.get("/deleteSubjectSetting/:SubjectSettingID",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.deleteSubjectSetting
)
UserRoute.post("/responseConfirmSubjectSetting",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  UserController.responseConfirmSubjectSetting
)
UserRoute.get("/getListTopTeacher",
  UserController.getListTopTeacher
)
UserRoute.post("/changeCareerInformation",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserValidation.changeCareerInformation,
  UserController.changeCareerInformation
)
UserRoute.post("/updateSchedule",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserValidation.updateSchedule,
  UserController.updateSchedule
)
UserRoute.post("/getListSubjectSetting",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  UserController.getListSubjectSetting
)
UserRoute.post("/disabledOrEnabledSubjectSetting",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.disabledOrEnabledSubjectSetting
)
UserRoute.post("/createAccountStaff",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.createAccountStaff,
  UserController.createAccountStaff
)
UserRoute.post("/getListAccountStaff",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserController.getListAccountStaff
)

export default UserRoute
