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
  GetListStudentDTO,
  GetListSubjectSettingDTO,
  GetListTeacherByUserDTO,
  GetListTeacherDTO,
  InactiveOrActiveAccountDTO,
  ResponseConfirmRegisterDTO,
  UpdateSchedulesDTO,
  UpdateSubjectSettingDTO
} from "../dtos/user.dto"
import response from "../utils/response"
import SubjectSetting from "../models/subjectsetting"

export const defaultSelectField = {
  forAggregate: {
    _id: 1,
    FullName: 1,
    AvatarPath: 1,
    RoleID: 1,
    Description: 1,
    Votes: 1,
    Address: 1,
    DateOfBirth: 1,
    Phone: 1,
    IsFirstLogin: 1,
    IsByGoogle: 1,
    Gender: 1,
    RegisterStatus: 1
  },
  forFind: "_id FullName AvatarPath RoleID Description Votes Address DateOfBirth Phone IsFirstLogin IsByGoogle Gender RegisterStatus"
}

export const selectFieldForTeacher = {
  forAggregate: {
    Experiences: 1,
    Educations: 1,
    Description: 1,
    Schedules: 1,
    Certificates: 1,
    Votes: 1,
  },
  forFind: "Experiences Educations Description Schedules Certificates Votes"
}

export const selectFieldForStudent = {
  forAggregate: {
    Subjects: 1
  },
  forFind: "Subjects"
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
                BankID: 1,
                UserBankAccount: 1,
                UserBankName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$BankingInfor" },
      {
        $project: {
          ...defaultSelectField.forAggregate,
          ...selectFieldForTeacher.forAggregate,
          Account: 1,
          BankingInfor: 1
        }
      }
    ])
    const total = User.countDocuments(queryUser)
    const result = await Promise.all([users, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsConfirm: i.RegisterStatus !== 2 || !i.Account.IsActive,
      IsReject: i.RegisterStatus !== 2 || !i.Account.IsActive,
      IsLockUnLock: i.RegisterStatus !== 3 && !!i.Account.IsActive
    }))
    return response(
      {
        List: data,
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
    const subject = await getOneDocument(Subject, "_id", SubjectID)
    if (!subject) return response({}, true, "Có lỗi xảy ra", 200)
    if (!!Level.length) {
      query = {
        ...query,
        Levels: { $in: Level }
      }
    }
    if (!!LearnType.length) {
      query = {
        ...query,
        LearnTypes: { $in: LearnType }
      }
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
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
            {
              $addFields: {
                TotalVotes: { $sum: "$Votes" }
              }
            },
            {
              $project: {
                _id: 1,
                FullName: 1,
                RegisterStatus: 1,
                Gender: 1,
                AvatarPath: 1,
                Address: 1,
                Votes: 1,
                TotalVotes: 1
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
        $project: {
          Price: 1,
          "Teacher._id": 1,
          "Teacher.FullName": 1,
          "Teacher.AvatarPath": 1,
          "Teacher.Address": 1,
          "Teacher.TotalVotes": 1,
          "Teacher.Votes": 1,
        }
      },
      {
        $sort: { Price: SortByPrice }
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
                Votes: 1
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
        Subject: subject,
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
        Quote: 0
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
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
            {
              $addFields: {
                TotalVotes: { $sum: "$Votes" }
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
                AvatarPath: 1,
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
        RegisterStatus: 3
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
    if (!updateSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Duyệt môn học cho giáo viên thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTopTeacherBySubject = async (req: Request) => {
  try {
    const { SubjectID } = req.params
    if (!mongoose.Types.ObjectId.isValid(`${SubjectID}`)) {
      return response({}, true, "ID môn học không tồn tại", 200)
    }
    const topTeachers = await User.aggregate([
      {
        $match: {
          RoleID: Roles.ROLE_TEACHER,
          RegisterStatus: 3
        }
      },
      {
        $addFields: {
          TotalVotes: { $sum: "$Votes" }
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
                LearnTypes: 1,
                IsActive: 1
              }
            }
          ]
        }
      },
      { $unwind: "$SubjectSetting" },
      {
        $match: {
          "SubjectSetting.Subject": new mongoose.Types.ObjectId(`${SubjectID}`),
          "SubjectSetting.RegisterStatus": 3
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

const fncGetListSubjectSetting = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, Level, LearnType, RegisterStatus } =
      req.body as GetListSubjectSettingDTO
    let query = {} as any
    if (!!SubjectID) {
      query = {
        ...query,
        Subject: new mongoose.Types.ObjectId(`${SubjectID}`)
      }
    }
    if (!!Level.length) {
      query = {
        ...query,
        Levels: { $in: Level }
      }
    }
    if (!!LearnType.length) {
      query = {
        ...query,
        LearnTypes: { $in: LearnType }
      }
    }
    if (!!RegisterStatus) {
      query = {
        ...query,
        RegisterStatus: RegisterStatus
      }
    }
    let teacherQuery = {
      "Teacher.FullName": { $regex: TextSearch, $options: "i" },
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
    return response(updateSubjectSetting, false, "Ẩn môn học thành công", 200)
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
  fncGetListTopTeacherBySubject,
  fncChangeCareerInformation,
  fncUpdateSchedule,
  fncGetListSubjectSetting,
  fncDisabledOrEnabledSubjectSetting
}

export default UserSerivce
