import express, { Request, Response } from "express"
import UserController from "../controllers/user.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import UserValidation from "../validations/user.validation"
import User from "../models/user"
import SubjectSetting from "../models/subjectsetting"
import Payment from "../models/payment"
import Account from "../models/account"
import BankingInfor from "../models/bankinginfor"
import LearnHistory from "../models/learnhistory"
import Notification from "../models/notification"
import Subject from "../models/subject"

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
UserRoute.post("/getListTopTeacher",
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
UserRoute.get("/resetPasswordAccountStaff/:UserID",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserController.resetPasswordAccountStaff
)
UserRoute.post("/updateAccountStaff",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.updateAccountStaff,
  UserController.updateAccountStaff
)
UserRoute.get("/updatePrice", async (req: Request, res: Response) => {
  // const account = await Subject.find().lean()
  // const list = await Subject.find({
  //   UserID: {
  //     $nin: account.map((i: any) => i._id)
  //   }
  // })
  // let updateList = [] as any[]
  // account.forEach((i: any) => {
  //   updateList.push(
  //     Subject.updateOne(
  //       { _id: i._id },
  //       { Description: `${i.SubjectName} là một nhạc cụ tuyệt vời, phù hợp với mọi lứa tuổi và không yêu cầu kinh nghiệm trước đó, nhưng sẽ đặc biệt thích hợp với những người kiên nhẫn, tỉ mỉ và có tinh thần kỷ luật. Học piano không chỉ đòi hỏi đam mê với âm nhạc mà còn cần khả năng tập trung, sự chăm chỉ luyện tập và mong muốn cải thiện bản thân. Dù bạn là người sáng tạo, thích thử thách hay đơn giản tìm kiếm niềm vui, hành trình chinh phục những phím đàn sẽ giúp bạn phát triển kỹ năng tư duy, cảm xúc và khả năng biểu đạt âm nhạc một cách đầy cảm hứng.` }
  //     )
  //   )
  // })
  // await Promise.all(updateList)
  const result = await Subject.updateMany(
    { IsDeleted: true }, // Điều kiện: Tài liệu không có trường Votes
    { IsDeleted: false }        // Thêm trường Votes với giá trị là mảng rỗng
  )
  return res.status(200).json("Update thành công")
})

export default UserRoute
