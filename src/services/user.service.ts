import Account from "../models/account"
import User from "../models/user"
import Subject from "../models/subject"
import { Roles } from "../utils/constant"
import sendEmail from "../utils/send-mail"
import { getOneDocument } from "../utils/queryFunction"
import mongoose from "mongoose"
import { Request } from "express"
import {
  ConfirmSubjectSettingDTO,
  GetDetailTeacherDTO,
  GetListStudentDTO,
  GetListTeacherByUserDTO,
  GetListTeacherDTO,
  InactiveOrActiveAccountDTO,
  ResponseConfirmRegisterDTO,
  UpdateSubjectSettingDTO
} from "../dtos/user.dto"
import response from "../utils/response"
import ProfitPercent from "../models/profitpercent"
import SubjectSetting from "../models/subjectsetting"

const getAllFiedls = {
  _id: 1,
  FullName: 1,
  AvatarPath: 1,
  RoleID: 1,
  Subjects: 1,
  Description: 1,
  Votes: 1,
  Schedules: 1,
  Address: 1,
  DateOfBirth: 1,
  Phone: 1
}

const fncGetDetailProfile = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${UserID}`)
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "UserID",
          as: "Account"
        }
      },
      { $unwind: '$Account' },
      {
        $addFields: {
          Email: "$Account.Email"
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "Subjects",
          foreignField: "_id",
          as: "Subjects",
          pipeline: [
            {
              $project: {
                _id: 1,
                SubjectName: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          ...getAllFiedls,
          Email: 1,
        }
      }
    ])
    return response(user[0], false, "Lấy ra thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeProfile = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { Email } = req.body as { Email: string }
    let account
    const user = await getOneDocument(User, "_id", UserID)
    if (!user) return response({}, true, "Có lỗi xảy ra", 200)
    const updateProfile = await User
      .findOneAndUpdate(
        { _id: UserID },
        { ...req.body },
        { new: true }
      )
      .populate("Subjects", ["_id", "SubjectName"])
      .lean()
    if (!!Email) {
      account = await Account.findOneAndUpdate({ UserID }, { Email }, { new: true })
    } else {
      account = await getOneDocument(Account, "UserID", UserID)
    }
    if (!account) return response({}, true, "Có lỗi xảy ra", 200)
    return response({ ...updateProfile, Email: account.Email }, false, "Chỉnh sửa trang cá nhân thành công thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncRequestConfirmRegister = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const user = await User
      .findOneAndUpdate({ _id: UserID }, { RegisterStatus: 2 }, { new: true })
      .populate("Subjects", ["_id", "SubjectName"])
    if (!user) return response({}, true, "Có lỗi xảy ra", 200)
    return response(user, false, "Yêu cầu của bạn đã được gửi. Hệ thống sẽ phản hồi yêu cầu của bạn trong 48h!", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncResponseConfirmRegister = async (req: Request) => {
  try {
    const { TeacherID, RegisterStatus, FullName, Email } = req.body as ResponseConfirmRegisterDTO
    const user = await User.findOneAndUpdate({ _id: TeacherID }, { RegisterStatus }, { new: true })
    if (!user) return response({}, true, "Có lỗi xảy ra", 200)
    const confirmContent = "Thông tin tài khoản của bạn đã được duyệt. Từ giờ bạn đã trở thành giáo viên của Talent LearningHub và bạn đã có thể nhận học viên."
    const noteContent = "LƯU Ý: Hãy tuân thủ tất cả điều khoản của Talent LearningHub. Nếu bạn vi phạm tài khoản của bạn sẽ bị khóa vĩnh viễn!"
    const rejectContent = "Thông tin tài khoản của bạn đã bị hủy. Chúng tôi nhận thấy profile của bạn có nhiều thông tin không chứng thực. Bạn có thể phản hồi để làm rõ."
    const subject = "THÔNG BÁO KIỂM DUYỆT PROFILE"
    const content = `
                <html>
                <head>
                <style>
                    p {
                        color: #333;
                    }
                </style>
                </head>
                <body>
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO KIỂM DUYỆT PROFILE</p>
                  <p style="margin-bottom:10px">Xin chào ${FullName},</p>
                  <p style="margin-bottom:10px">Talent LearningHub thông báo: ${RegisterStatus === 3 ? confirmContent : rejectContent}</p>
                  <p>${RegisterStatus === 3 ? noteContent : ""}</p>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(Email, subject, content)
    if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    return response(user, false, "Update thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTeacher = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, Level, RegisterStatus } =
      req.body as GetListTeacherDTO
    let queryUser = {
      FullName: { $regex: TextSearch, $options: "i" },
      RoleID: Roles.ROLE_TEACHER
    } as any
    if (!!RegisterStatus) {
      queryUser = {
        ...queryUser,
        RegisterStatus: RegisterStatus
      }
    }
    let querySubjectSetting = {} as any
    if (!!SubjectID) {
      querySubjectSetting = {
        ...querySubjectSetting,
        "SubjectSettings.Subject._id": new mongoose.Types.ObjectId(`${SubjectID}`)
      }
    }
    if (!!Level.length) {
      querySubjectSetting = {
        ...querySubjectSetting,
        "SubjectSettings.Levels": { $all: Level }
      }
    }
    const users = User.aggregate([
      {
        $match: queryUser
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "UserID",
          as: "Account"
        }
      },
      { $unwind: "$Account" },
      {
        $lookup: {
          from: "subjectsettings",
          localField: "_id",
          foreignField: "Teacher",
          as: "SubjectSettings",
          pipeline: [
            {
              $lookup: {
                from: "subjects",
                localField: "Subject",
                foreignField: "_id",
                as: "Subject",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      SubjectName: 1
                    }
                  }
                ]
              }
            },
            { $unwind: "$Subject" }
          ]
        }
      },
      {
        $match: querySubjectSetting
      },
      {
        $project: {
          ...getAllFiedls,
          "Account.Email": 1,
          SubjectSettings: 1
        }
      }
    ])
    const total = User.countDocuments(queryUser)
    const result = await Promise.all([users, total])
    return response(
      {
        List: result[0],
        Total: result[1]
      },
      false,
      "Lay dat thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTeacherByUser = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, Level, FromPrice, ToPrice, LearnType, SortByPrice } =
      req.body as GetListTeacherByUserDTO
    let query = {
      FullName: { $regex: TextSearch, $options: "i" },
      RoleID: Roles.ROLE_TEACHER,
      RegisterStatus: 3,
      IsActive: true,
      Price: { $gte: FromPrice, $lte: ToPrice },
      Subjects: {
        $elemMatch: { $eq: SubjectID }
      }
    } as any
    const subject = await getOneDocument(Subject, "_id", SubjectID)
    if (!subject) return response({}, true, "Có lỗi xảy ra", 200)
    if (!!Level.length) {
      query = {
        ...query,
        "Quotes.Levels": { $all: Level }
      }
    }
    if (!!LearnType.length) {
      query = {
        ...query,
        LearnTypes: { $all: LearnType }
      }
    }
    const users = User
      .find(query)
      .sort({ Price: SortByPrice })
      .populate("Subjects", ["_id", "SubjectName"])
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = User.countDocuments(query)
    const result = await Promise.all([users, total])
    return response(
      {
        Subject: subject,
        List: result[0],
        Total: result[1]
      },
      false,
      "Lay dat thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailTeacher = async (req: Request) => {
  try {
    const { TeacherID, SubjectID } = req.body as GetDetailTeacherDTO
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const user = await SubjectSetting.aggregate([
      {
        $match: {
          Teacher: new mongoose.Types.ObjectId(`${TeacherID}`),
          IsActive: true,
          Subject: new mongoose.Types.ObjectId(`${SubjectID}`),
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
            {
              $addFields: {
                TotalVotes: { $size: "$Votes" }
              }
            },
            {
              $match: {
                RegisterStatus: 3
              }
            },
            {
              $project: {
                FullName: 1,
                Address: 1,
                Schedules: 1,
                TotalVotes: 1,
                Votes: 1,
                AvatarPath: 1
              }
            },
            // {
            //   $lookup: {
            //     from: "accounts",
            //     localField: "_id",
            //     foreignField: "UserID",
            //     as: "Account"
            //   }
            // },
            // { $unwind: '$Account' },
            // {
            //   $addFields: {
            //     Email: "$Account.Email"
            //   }
            // },
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "Subject",
          pipeline: [
            {
              $project: {
                _id: 1,
                SubjectName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Subject" },
      {
        $project: {
          IsActive: 0
        }
      }
    ])
    if (!user[0]) return response({}, true, "Giáo viên không tồn tại", 200)
    return response({ ...user[0], ipAddress }, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListStudent = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SortByBookQuantity } =
      req.body as GetListStudentDTO
    let query = {
      RoleID: Roles.ROLE_STUDENT
    }
    const users = User.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "learnhistorys",
          localField: "_id",
          foreignField: "Student",
          as: "LearnHistory"
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "UserID",
          as: "Account"
        }
      },
      { $unwind: '$Account' },
      {
        $addFields: {
          Email: "$Account.Email",
          BookQuantity: { $size: "$LearnHistory" }
        }
      },
      {
        $sort: {
          BookQuantity: SortByBookQuantity
        }
      },
      {
        $match: {
          $or: [
            { FullName: { $regex: TextSearch, $options: "i" } },
            { Email: { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      {
        $project: {
          ...getAllFiedls,
          Email: 1,
          BookQuantity: 1
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = User.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "UserID",
          as: "Account"
        }
      },
      { $unwind: '$Account' },
      {
        $addFields: {
          Email: "$Account.Email",
        }
      },
      {
        $match: {
          $or: [
            { FullName: { $regex: TextSearch, $options: "i" } },
            { Email: { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      {
        $group: {
          _id: "$_id"
        }
      },
      {
        $count: "total"
      }
    ])
    const result = await Promise.all([users, total])
    return response(
      {
        List: result[0],
        Total: !!result[1].length ? result[1][0].total : 0
      },
      false,
      "Lay dat thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncInactiveOrActiveAccount = async (req: Request) => {
  try {
    const { UserID, IsActive, RegisterStatus } =
      req.body as InactiveOrActiveAccountDTO
    const updateAccount = await User.findOneAndUpdate(
      { _id: UserID },
      {
        IsActive: IsActive,
        RegisterStatus: RegisterStatus
      },
      { new: true }
    )
    if (!updateAccount) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Tài khoản đã bị khóa", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListSubjectSettingByTeacher = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const list = await SubjectSetting
      .find({
        Teacher: UserID
      })
      .populate("Subject", ["_id", "SubjectName"])
    return response(list, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncCreateSubjectSetting = async (req: Request) => {
  try {
    const { SubjectID } = req.params
    const UserID = req.user.ID
    const newSubjectSetting = await SubjectSetting.create({
      Subject: SubjectID,
      Teacher: UserID,
    })
    return response(newSubjectSetting, false, "Môn học có thể giảng dạy đã được thêm", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateSubjectSetting = async (req: Request) => {
  try {
    const { SubjectSettingID, SubjectID } = req.body as UpdateSubjectSettingDTO
    const UserID = req.user.ID
    const updateSubjectSetting = await SubjectSetting
      .findOneAndUpdate(
        {
          _id: SubjectSettingID,
          Teacher: UserID,
          Subject: SubjectID
        },
        { ...req.body },
        { new: true }
      )
      .populate("Subject", ["_id", "SubjectName"])
    if (!updateSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updateSubjectSetting, false, "Cập nhật môn học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteSubjectSetting = async (req: Request) => {
  try {
    const { SubjectSettingID } = req.params
    const deleteSubjectSetting = await SubjectSetting.findOneAndDelete({
      _id: SubjectSettingID
    })
    if (!deleteSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Xóa môn học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncConfirmSubjectSetting = async (req: Request) => {
  try {
    const { SubjectSettingID, FullName, Email } = req.body as ConfirmSubjectSettingDTO
    const confirmContent = "Môn học của bạn đã được duyệt. Từ giờ học viên có thể nhìn thấy môn học của bạn và có thể thực hiện booking."
    const subject = "THÔNG BÁO KIỂM DUYỆT MÔN HỌC"
    const content = `
                <html>
                <head>
                <style>
                    p {
                        color: #333;
                    }
                </style>
                </head>
                <body>
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO KIỂM DUYỆT PROFILE</p>
                  <p style="margin-bottom:10px">Xin chào ${FullName},</p>
                  <p style="margin-bottom:10px">Talent LearningHub thông báo: ${confirmContent}</p>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(Email, subject, content)
    if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    const updateSubjectSetting = await SubjectSetting.findOneAndUpdate(
      { _id: SubjectSettingID },
      { IsActive: true },
      { new: true }
    )
    if (!updateSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Duyệt môn học cho giáo viên thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTopTeacherBySubject = async (req: Request) => {
  try {
    const { SubjectID } = req.params
    const topTeachers = await User.aggregate([
      {
        $match: {
          RoleID: Roles.ROLE_TEACHER,
          IsActive: true,
          RegisterStatus: 3
        }
      },
      {
        $addFields: {
          TotalVotes: { $size: "$Votes" }
        }
      },
      {
        $sort: {
          TotalVotes: -1
        }
      },
      {
        $lookup: {
          from: "subjectsettings",
          localField: "_id",
          foreignField: "Teacher",
          as: "SubjectSetting",
          pipeline: [
            {
              $project: {
                Subject: 1,
                Levels: 1,
                Price: 1,
                LearnTypes: 1
              }
            }
          ]
        }
      },
      { $unwind: "$SubjectSetting" },
      {
        $match: {
          "SubjectSetting.Subject": new mongoose.Types.ObjectId(`${SubjectID}`)
        }
      },
      {
        $limit: 4
      }
    ])
    return response(topTeachers, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListSubjectOfTeacher = async (req: Request) => {
  try {
    const { TeacherID } = req.params
    const list = await SubjectSetting
      .find({
        Teacher: TeacherID
      })
      .populate("Subject", ["_id", "SubjectName"])
      .select("Subject")
    return response(list, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const UserSerivce = {
  fncGetDetailProfile,
  fncChangeProfile,
  fncRequestConfirmRegister,
  fncResponseConfirmRegister,
  fncGetListTeacher,
  fncGetListTeacherByUser,
  fncGetDetailTeacher,
  fncGetListStudent,
  fncInactiveOrActiveAccount,
  fncGetListSubjectSettingByTeacher,
  fncCreateSubjectSetting,
  fncUpdateSubjectSetting,
  fncDeleteSubjectSetting,
  fncConfirmSubjectSetting,
  fncGetListTopTeacherBySubject,
  fncGetListSubjectOfTeacher
}

export default UserSerivce
