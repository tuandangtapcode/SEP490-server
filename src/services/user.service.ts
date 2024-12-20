import Account from "../models/account"
import User from "../models/user"
import Subject from "../models/subject"
import { Roles } from "../utils/constant"
import sendEmail from "../utils/send-mail"
import { getDetailProfile, getOneDocument } from "../utils/queryFunction"
import mongoose, { ObjectId } from "mongoose"
import { Request } from "express"
import {
  ChangeCareerInformationDTO,
  ChangeProfileDTO,
  ConfirmSubjectSettingDTO,
  CreateAccountStaff,
  GetListStudentDTO,
  GetListSubjectSettingDTO,
  GetListTeacherByUserDTO,
  GetListTeacherDTO,
  InactiveOrActiveAccountDTO,
  ResponseConfirmRegisterDTO,
  UpdateAccountStaffDTO,
  UpdateSchedulesDTO,
  UpdateSubjectSettingDTO
} from "../dtos/user.dto"
import response from "../utils/response"
import SubjectSetting from "../models/subjectsetting"
import EmbeddingPinecone from "../tools/embeddingPinecone"
import PineconeService from "./pinecone.service"
import bcrypt from "bcrypt"
import { CommonDTO } from "../dtos/common.dto"

export const defaultSelectField = {
  forAggregate: {
    _id: 1,
    FullName: 1,
    AvatarPath: 1,
    RoleID: 1,
    Description: 1,
    Address: 1,
    DateOfBirth: 1,
    Phone: 1,
    IsFirstLogin: 1,
    IsByGoogle: 1,
    Gender: 1,
    RegisterStatus: 1
  },
  forFind: "_id FullName AvatarPath RoleID Description Address DateOfBirth Phone IsFirstLogin IsByGoogle Gender RegisterStatus"
}

export const selectFieldForTeacher = {
  forAggregate: {
    Experiences: 1,
    Educations: 1,
    Description: 1,
    Schedules: 1,
    Certificates: 1,
  },
  forFind: "Experiences Educations Description Schedules Certificates"
}

export const selectFieldForStudent = {
  forAggregate: {
    // Subjects: 1
  },
  forFind: ""
}

const fncGetDetailProfile = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const user = await getDetailProfile(ID, RoleID)
    if (!user) return response({}, true, "Có lỗi xảy ra", 200)
    return response(user, false, "Lấy ra thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeProfile = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const dataUpdate = RoleID === Roles.ROLE_STUDENT
      ? {
        ...req.body as ChangeProfileDTO,
        IsFirstLogin: false,
        RegisterStatus: 3
      }
      : {
        ...req.body as ChangeProfileDTO,
        IsFirstLogin: false
      }
    const updateProfile = await User.findOneAndUpdate(
      { _id: ID },
      { ...dataUpdate }
    )
    if (!updateProfile) return response({}, true, "Có lỗi xảy ra khi update", 200)
    const user = await getDetailProfile(ID, RoleID)
    if (!user) return response({}, true, "Có lỗi xảy ra khi get profile", 200)
    return response(user, false, "Chỉnh sửa thông tin nhân thành công", 200)
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
    const { TeacherID, RegisterStatus, FullName, Email, Reason } = req.body as ResponseConfirmRegisterDTO
    const user = await User.findOneAndUpdate({ _id: TeacherID }, { RegisterStatus }, { new: true })
    if (!user) return response({}, true, "Có lỗi xảy ra", 200)
    const confirmContent = "Thông tin tài khoản của bạn đã được duyệt. Từ giờ bạn đã trở thành giáo viên của Talent LearningHub và bạn đã có thể nhận học viên."
    const noteContent = "LƯU Ý: Hãy tuân thủ tất cả điều khoản của Talent LearningHub. Nếu bạn vi phạm tài khoản của bạn sẽ bị khóa vĩnh viễn!"
    const rejectContent = `Thông tin tài khoản của bạn không được duyệt với lý do: ${Reason}. Bạn có thể phản hồi để làm rõ.`
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
    const { TextSearch, CurrentPage, PageSize, RegisterStatus } = req.body as GetListTeacherDTO
    const { RoleID } = req.user
    let queryUser = {
      FullName: { $regex: TextSearch, $options: "i" },
      RoleID: Roles.ROLE_TEACHER
    } as any
    if (!!RegisterStatus) {
      queryUser.RegisterStatus = RegisterStatus
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
          as: "Account",
          pipeline: [
            {
              $project: {
                _id: 1,
                Email: 1,
                IsActive: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Account" },
      {
        $lookup: {
          from: "bankinginfors",
          localField: "_id",
          foreignField: "User",
          as: "BankingInfor",
          pipeline: [
            {
              $project: {
                _id: 1,
                BankID: 1,
                UserBankAccount: 1,
                UserBankName: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$BankingInfor",
          preserveNullAndEmptyArrays: true
        }
      },
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
            { $unwind: "$Subject" },
            {
              $project: {
                _id: 1,
                Subject: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          ...defaultSelectField.forAggregate,
          ...selectFieldForTeacher.forAggregate,
          Account: 1,
          SubjectSettings: 1,
          BankingInfor: 1,
          updatedAt: 1
        }
      },
      {
        $sort: { updatedAt: -1 }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = User.countDocuments(queryUser)
    const result = await Promise.all([users, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsConfirm: i.RegisterStatus === 2 || !i.Account.IsActive ? false : true,
      IsReject: i.RegisterStatus === 2 || !i.Account.IsActive ? false : true,
    }))
    return response(
      {
        List: data,
        Total: result[1],
        IsViewLockUnLock: RoleID === Roles.ROLE_ADMIN ? true : false
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
    const { TextSearch, CurrentPage, PageSize, SubjectID, Level, FromPrice, ToPrice, LearnType, SortByPrice, Gender } =
      req.body as GetListTeacherByUserDTO
    if (!mongoose.Types.ObjectId.isValid(`${SubjectID}`)) {
      return response({}, true, "Môn học không tồn tại", 200)
    }
    let query = {
      Subject: new mongoose.Types.ObjectId(`${SubjectID}`),
      Price: {
        $gte: +FromPrice,
        $lte: +ToPrice
      },
      RegisterStatus: 3,
      IsDisabled: false
    } as any
    if (!!Level.length) {
      query.Levels = { $in: Level }
    }
    if (!!LearnType.length) {
      query.LearnTypes = { $in: LearnType }
    }
    let teacherQuery = {
      "Teacher.FullName": { $regex: TextSearch, $options: "i" },
      "Teacher.RegisterStatus": 3,
    } as any
    if (!!Gender) {
      teacherQuery = {
        ...teacherQuery,
        "Teacher.Gender": Gender
      }
    }
    const teachers = SubjectSetting.aggregate([
      {
        $match: query
      },
      {
        $addFields: {
          TotalVotes: { $sum: "$Votes" }
        }
      },
      {
        $addFields: {
          TotalVotes: { $sum: "$Votes" }
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
                IsActive: "$Account.IsActive",
              }
            },
            {
              $project: {
                FullName: 1,
                AvatarPath: 1,
                RegisterStatus: 1,
                IsActive: 1,
              }
            }
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $match: {
          "Teacher.RegisterStatus": 3,
          "Teacher.IsActive": true,
        }
      },
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
          _id: 1,
          Subject: 1,
          Levels: 1,
          Price: 1,
          LearnTypes: 1,
          Teacher: 1,
          TotalVotes: 1,
          Votes: 1
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = SubjectSetting.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
            {
              $project: {
                FullName: 1,
                RoleID: 1,
                RegisterStatus: 1,
                Gender: 1,
                AvatarPath: 1,
                Address: 1,
              }
            }
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $match: teacherQuery
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
    const result = await Promise.all([teachers, total])
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

const fncGetDetailTeacher = async (req: Request) => {
  try {
    const { TeacherID, SubjectID, IsBookingPage } = req.body
    if (!mongoose.Types.ObjectId.isValid(`${SubjectID}`)) {
      return response({}, true, "ID môn học không tồn tại", 200)
    }
    if (!mongoose.Types.ObjectId.isValid(`${TeacherID}`)) {
      return response({}, true, "ID giáo viên không tồn tại", 200)
    }
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const projectField = !!IsBookingPage
      ? {
        Experiences: 0,
        Educations: 0,
        Certificates: 0,
        IntroVideos: 0,
        Levels: 0,
        Quote: 0,
      }
      : {}
    const user = await SubjectSetting.aggregate([
      {
        $match: {
          Teacher: new mongoose.Types.ObjectId(`${TeacherID}`),
          RegisterStatus: 3,
          Subject: new mongoose.Types.ObjectId(`${SubjectID}`),
        }
      },
      {
        $addFields: {
          TotalVotes: { $sum: "$Votes" },
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
                RegisterStatus: 3
              }
            },
            {
              $project: {
                FullName: 1,
                Address: 1,
                Schedules: 1,
                AvatarPath: 1,
                Email: 1
              }
            },
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
          IsActive: 0,
          ...projectField
        }
      }
    ])
    const listSubjects = await SubjectSetting
      .find({
        Teacher: TeacherID,
        RegisterStatus: 3,
        IsDisabled: false
      })
      .populate("Subject", ["_id", "SubjectName"])
      .select("Subject")
    if (!user[0]) return response({}, true, "Giáo viên không tồn tại", 200)
    return response(
      !!IsBookingPage
        ? { ...user[0], ipAddress }
        : {
          TeacherInfor: { ...user[0], ipAddress },
          Subjects: listSubjects
        },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListStudent = async (req: Request) => {
  try {
    const { RoleID } = req.user
    const { TextSearch, CurrentPage, PageSize, SortByBookQuantity } = req.body as GetListStudentDTO
    let query = {
      RoleID: Roles.ROLE_STUDENT
    }
    const users = User.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "learnhistories",
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
          IsActive: "$Account.IsActive",
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
          ...defaultSelectField.forAggregate,
          IsActive: 1,
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
        Total: !!result[1].length ? result[1][0].total : 0,
        IsViewLockUnLock: RoleID === Roles.ROLE_ADMIN ? true : false
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
    const { UserID, IsActive } =
      req.body as InactiveOrActiveAccountDTO
    const updateAccount = await Account.findOneAndUpdate(
      { UserID: UserID },
      {
        IsActive: IsActive,
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
      .lean()
    const data = list.map((i: any) => ({
      ...i,
      IsUpdate: i.RegisterStatus === 2,
      IsDisabledBtn: i.RegisterStatus === 2 ? true : false
    }))
    return response(data, false, "Lấy data thành công", 200)
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
        {
          ...req.body,
          RegisterStatus: 2
        },
        { new: true }
      )
      .populate("Subject", ["_id", "SubjectName"])
    if (!!updateSubjectSetting) {
      EmbeddingPinecone.updateSubjectSetting(SubjectSettingID.toString())
    }
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
    if (!!deleteSubjectSetting) {
      PineconeService.deleteVector(SubjectSettingID, "teacher")
    }
    if (!deleteSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Xóa môn học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncResponseConfirmSubjectSetting = async (req: Request) => {
  try {
    const { SubjectSettingID, FullName, Email, Reason, RegisterStatus } = req.body as ConfirmSubjectSettingDTO
    const confirmContent = "Môn học của bạn đã được duyệt. Từ giờ học viên có thể nhìn thấy môn học của bạn và có thể thực hiện booking."
    const rejectContent = `Môn học của bạn không được duyệt với lý do: ${Reason}. Bạn có thể phản hồi để làm rõ.`
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
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO KIỂM DUYỆT MÔN HỌC</p>
                  <p style="margin-bottom:10px">Xin chào ${FullName},</p>
                  <p style="margin-bottom:10px">Talent LearningHub thông báo: ${RegisterStatus === 3 ? confirmContent : rejectContent}</p>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(Email, subject, content)
    if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    const updateSubjectSetting = await SubjectSetting.findOneAndUpdate(
      { _id: SubjectSettingID },
      { RegisterStatus: RegisterStatus },
      { new: true }
    )
    if (!!updateSubjectSetting) {
      EmbeddingPinecone.processSubjectSetting(SubjectSettingID.toString())
    }
    if (!updateSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Duyệt môn học cho giáo viên thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTopTeacher = async (req: Request) => {
  try {
    const { IsBlogPage } = req.body
    const selectFiled = !!IsBlogPage
      ? {
        _id: 1,
        Subject: 1,
        Teacher: 1,
        TotalVotes: 1,
        Votes: 1
      }
      : {
        _id: 1,
        Subject: 1,
        Levels: 1,
        Price: 1,
        LearnTypes: 1,
        Teacher: 1,
        TotalVotes: 1,
        Votes: 1
      }
    const topTeachers = await SubjectSetting.aggregate([
      {
        $match: {
          RegisterStatus: 3,
          IsDisabled: false
        }
      },
      {
        $addFields: {
          TotalVotes: { $sum: "$Votes" }
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
                IsActive: "$Account.IsActive",
              }
            },
            {
              $project: {
                FullName: 1,
                AvatarPath: 1,
                RegisterStatus: 1,
                IsActive: 1,
              }
            }
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $match: {
          "Teacher.RegisterStatus": 3,
          "Teacher.IsActive": true,
        }
      },
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
        $project: selectFiled
      },
      {
        $sort: {
          TotalVotes: -1
        }
      },
      { $limit: !!IsBlogPage ? 3 : 8 },
    ])
    return response(topTeachers, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListSubjectSetting = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, Level, LearnType, RegisterStatus } =
      req.body as GetListSubjectSettingDTO
    let query = {} as any
    if (!!SubjectID) {
      query.Subject = new mongoose.Types.ObjectId(`${SubjectID}`)
    }
    if (!!Level.length) {
      query.Levels = { $in: Level }
    }
    if (!!LearnType.length) {
      query.LearnTypes = { $in: LearnType }
    }
    if (!!RegisterStatus) {
      query.RegisterStatus = RegisterStatus
    }
    let teacherQuery = {
      "Teacher.FullName": { $regex: TextSearch, $options: "i" },
      "Teacher.IsActive": true
    } as any
    const teachers = SubjectSetting.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
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
                IsActive: "$Account.IsActive"
              }
            },
            {
              $project: {
                FullName: 1,
                RegisterStatus: 1,
                Email: 1,
                IsActive: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $match: teacherQuery
      },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "Subject",
          pipeline: [
            {
              $project: {
                SubjectName: 1,
              }
            }
          ]
        }
      },
      { $unwind: "$Subject" },
      {
        $sort: { updatedAt: -1 }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = SubjectSetting.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
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
                IsActive: "$Account.IsActive"
              }
            },
            {
              $project: {
                FullName: 1,
                RegisterStatus: 1,
                Email: 1,
                IsActive: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $match: teacherQuery
      },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "Subject",
          pipeline: [
            {
              $project: {
                SubjectName: 1,
              }
            }
          ]
        }
      },
      { $unwind: "$Subject" },
      {
        $group: {
          _id: "$_id"
        }
      },
      {
        $count: "total"
      }
    ])
    const result = await Promise.all([teachers, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsConfirm: i.RegisterStatus !== 2 || !i.Teacher.IsActive || i.Teacher.RegisterStatus !== 3,
      IsReject: i.RegisterStatus !== 2 || !i.Teacher.IsActive || i.Teacher.RegisterStatus !== 3
    }))
    return response(
      {
        List: data,
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

const fncChangeCareerInformation = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const { Subjects } = req.body as ChangeCareerInformationDTO
    if (RoleID === Roles.ROLE_TEACHER) {
      const bulkOps = Subjects.map((i: any) => ({
        updateOne: {
          filter: { Teacher: ID, Subject: i },
          update: { $setOnInsert: { Teacher: ID, Subject: i } },
          upsert: true
        }
      }))
      await SubjectSetting.bulkWrite(bulkOps)
    }
    const updateInfor = await User
      .findOneAndUpdate(
        { _id: ID },
        {
          ...req.body as ChangeCareerInformationDTO,
          RegisterStatus: 2,
          Subjects: RoleID === Roles.ROLE_STUDENT
            ? Subjects
            : []
        }
      )
    if (!updateInfor) return response({}, true, "Có lỗi xảy ra khi update", 200)
    const user = await getDetailProfile(ID, RoleID)
    if (!user) return response({}, true, "Có lỗi xảy ra khi get profile", 200)
    return response(user, false, "Chỉnh sửa thông tin nghề nghiệp thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateSchedule = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const { Schedules } = req.body as UpdateSchedulesDTO
    const updateUser = await User
      .findOneAndUpdate(
        { _id: ID },
        { Schedules: Schedules },
        { new: true }
      )
      .lean()
    if (!updateUser) return response({}, true, "Có lỗi xảy ra", 200)
    const user = await getDetailProfile(ID, RoleID)
    if (!user) return response({}, true, "Có lỗi xảy ra khi get profile", 200)
    return response(user, false, "Chỉnh sửa thông tin nghề nghiệp thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDisabledOrEnabledSubjectSetting = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { SubjectSettingID, IsDisabled } = req.body as { SubjectSettingID: ObjectId, IsDisabled: Boolean }
    const updateSubjectSetting = await SubjectSetting
      .findOneAndUpdate(
        {
          _id: SubjectSettingID,
          Teacher: UserID
        },
        { IsDisabled: IsDisabled },
        { new: true }
      )
      .lean()
    if (!updateSubjectSetting) return response({}, true, "Có lỗi xảy ra khi update", 200)
    return response(
      updateSubjectSetting,
      false,
      !!IsDisabled ? "Ẩn môn học thành công" : "Hiện môn học thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncCreateAccountStaff = async (req: Request) => {
  try {
    const { Email, FullName, Phone, Password } = req.body as CreateAccountStaff
    const checkExist = await getOneDocument(Account, "Email", Email)
    if (!!checkExist) return response({}, true, "Email đã tồn tại", 200)
    const hashPassword = bcrypt.hashSync(Password, 10)
    const newUser = await User.create({
      FullName,
      RoleID: 2,
      IsFirstLogin: false,
      RegisterStatus: 3,
      Phone
    })
    await Account.create({
      Email,
      RoleID: 2,
      Password: hashPassword,
      UserID: newUser._id
    })
    return response({}, false, "Tạo tài khoản staff thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListAccountStaff = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize } = req.body as CommonDTO
    const query = {
      RoleID: 2,
      FullName: { $regex: TextSearch, $options: "i" },
    }
    const users = User.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "UserID",
          as: "Account",
          pipeline: [
            {
              $project: {
                _id: 1,
                Email: 1,
                IsActive: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Account" },
      {
        $addFields: {
          Email: "$Account.Email",
          IsActive: "$Account.IsActive",
        }
      },
      {
        $project: {
          _id: 1,
          FullName: 1,
          Email: 1,
          IsActive: 1,
          Phone: 1
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = User.countDocuments(query)
    const result = await Promise.all([users, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra bài viết thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncResetPasswordAccountStaff = async (req: Request) => {
  try {
    const { UserID } = req.params
    const hashPassword = bcrypt.hashSync("Ab123456", 10)
    const updateAccount = await Account.findOneAndUpdate(
      { UserID },
      { Password: hashPassword },
      { new: true }
    )
    if (!updateAccount) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Reset mật khẩu thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateAccountStaff = async (req: Request) => {
  try {
    const { UserID } = req.body as UpdateAccountStaffDTO
    const updateAccount = await User.findOneAndUpdate(
      { _id: UserID },
      { ...req.body }
    )
    if (!updateAccount) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Chỉnh sửa thông tin staff thành công", 200)
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
  fncResponseConfirmSubjectSetting,
  fncGetListTopTeacher,
  fncChangeCareerInformation,
  fncUpdateSchedule,
  fncGetListSubjectSetting,
  fncDisabledOrEnabledSubjectSetting,
  fncCreateAccountStaff,
  fncGetListAccountStaff,
  fncResetPasswordAccountStaff,
  fncUpdateAccountStaff
}

export default UserSerivce
