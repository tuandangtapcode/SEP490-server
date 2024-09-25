import Account from "../models/account"
import User from "../models/user"
import Subject from "../models/subject"
import { Roles } from "../utils/constant"
import sendEmail from "../utils/send-mail"
import { getOneDocument } from "../utils/queryFunction"
import mongoose from "mongoose"
import { Request } from "express"
import iconv from "iconv-lite"
import {
  GetDetailTeacherDTO,
  GetListStudentDTO,
  GetListTeacherByUserDTO,
  GetListTeacherDTO,
  InactiveOrActiveAccountDTO,
  PushOrPullSubjectForTeacherDTO,
  ResponseConfirmRegisterDTO
} from "../dtos/user.dto"
import response from "../utils/response"

const getAllFiedls = {
  _id: 1,
  FullName: 1,
  AvatarPath: 1,
  RoleID: 1,
  Subjects: 1,
  Description: 1,
  Votes: 1,
  IsByGoogle: 1,
  RegisterStatus: 1,
  Quotes: 1,
  Experiences: 1,
  IntroductVideos: 1,
  Price: 1,
  Schedules: 1,
  Educations: 1,
  IsActive: 1,
  LearnTypes: 1,
  Address: 1,
  createdAt: 1,
  Certificates: 1,
  IntroVideos: 1
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
    if (!user[0]) return response({}, true, "Có lỗi xảy ra", 200)
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
    const confirmContent = "Thông tin tài khoản của bạn đã được duyệt. Từ giờ bạn đã trở thành giáo viên của TaTuBoo và bạn đã có thể nhận học viên."
    const noteContent = "LƯU Ý: Hãy tuân thủ tất cả điều khoản của TaTuBoo. Nếu bạn vi phạm tài khoản của bạn sẽ bị khóa vĩnh viễn!"
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
                  <p style="margin-bottom:10px">TaTuBoo thông báo: ${RegisterStatus === 3 ? confirmContent : rejectContent}</p>
                  <p>${RegisterStatus === 3 ? noteContent : ""}</p>
                </body>
                </html>
                `
    await sendEmail(Email, subject, content)
    return response(user, false, "Update thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncPushOrPullSubjectForTeacher = async (req: Request) => {
  try {
    const { SubjectID, Email } = req.body as PushOrPullSubjectForTeacherDTO
    const UserID = req.user.ID
    const user = await getOneDocument(User, "_id", UserID)
    let update
    if (!!user.Subjects.some((i: any) => i.equals(SubjectID))) {
      update = {
        $pull: {
          Subjects: SubjectID,
          Quotes: {
            SubjectID: SubjectID
          }
        }
      }
    } else {
      update = {
        $push: {
          Subjects: SubjectID
        }
      }
    }
    const updateUser = await User
      .findOneAndUpdate(
        { _id: UserID },
        update,
        { new: true }
      )
      .populate("Subjects", ["_id", "SubjectName"])
      .lean()
    return response(
      { ...updateUser, Email: Email },
      false,
      `${user.Subjects.some((i: any) => i.equals(SubjectID)) ? "Xóa" : "Thêm"} thành công`,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTeacher = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, Level, RegisterStatus } =
      req.body as GetListTeacherDTO
    let query = {
      FullName: { $regex: TextSearch, $options: "i" },
      RoleID: Roles.ROLE_TEACHER
    } as any
    if (!!SubjectID) {
      query = {
        ...query,
        Subjects: {
          $elemMatch: { $eq: new mongoose.Types.ObjectId(`${SubjectID}`) }
        }
      }
    }
    if (!!Level.length) {
      query = {
        ...query,
        "Quotes.Levels": { $all: Level }
      }
    }
    if (!!RegisterStatus) {
      query = {
        ...query,
        RegisterStatus: RegisterStatus
      }
    }
    const users = User.aggregate([
      {
        $match: query
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
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "UserID",
          as: "Account"
        }
      },
      { $unwind: "$Account" },
      {
        $project: {
          ...getAllFiedls,
          "Account.Email": 1
        }
      }
    ])
    const total = User.countDocuments(query)
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
    console.log("ipAddress", ipAddress);

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${TeacherID}`),
          RegisterStatus: 3,
          IsActive: true,
          Subjects: {
            $elemMatch: { $eq: new mongoose.Types.ObjectId(`${SubjectID}`) }
          }
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
    if (!user[0]) return response({}, true, "Có lỗi xảy ra", 200)
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

const UserSerivce = {
  fncGetDetailProfile,
  fncChangeProfile,
  fncRequestConfirmRegister,
  fncResponseConfirmRegister,
  fncPushOrPullSubjectForTeacher,
  fncGetListTeacher,
  fncGetListTeacherByUser,
  fncGetDetailTeacher,
  fncGetListStudent,
  fncInactiveOrActiveAccount
}

export default UserSerivce
