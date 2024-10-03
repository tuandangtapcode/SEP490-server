import mongoose from "mongoose"
import LearnHistory from "../models/learnhistory"
import { Roles } from "../utils/constant"
import sendEmail from "../utils/send-mail"
import { Request } from "express"
import {
  CreateLearnHistoryDTO,
  GetListLearnHistoryDTO
} from "../dtos/learnhistory.dto"
import response from "../utils/response"

const fncCreateLearnHistory = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { TeacherName, StudentName, SubjectName, StudentEmail, TeacherEmail, Times, ...remainBody } =
      req.body as CreateLearnHistoryDTO
    const subject = "THÔNG BÁO HỌC SINH ĐĂNG KÝ HỌC"
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
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO HỌC SINH ĐĂNG KÝ HỌC</p>
                  <p style="margin-bottom:10px">Xin chào ${TeacherName},</p>
                  <p style="margin-bottom:10px">Thông tin giảng dạy cho học sinh mới đăng ký</p>
                  <p>Tên học sinh: ${StudentName}</p>
                  <p>Email học sinh: ${StudentEmail}</p>
                  <p>Môn học: ${SubjectName}</p>
                  <p>Thời gian học:</p>
                  ${Times.map(i =>
      `<div>${i}</div>`
    )}
                  <p>Giáo viên hãy vào lịch dạy của mình để kiểm tra thông tin lịch dạy.</p>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(TeacherName, subject, content)
    if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    const newLearnHistory = await LearnHistory.create({ ...remainBody, Student: UserID })
    return response(newLearnHistory, false, "Thêm thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListLearnHistory = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const { PageSize, CurrentPage, LearnedStatus, TextSearch } =
      req.body as GetListLearnHistoryDTO
    let query = {
      [RoleID === Roles.ROLE_STUDENT
        ? "Student"
        : "Teacher"
      ]: new mongoose.Types.ObjectId(`${ID}`),
    } as any
    if (!!LearnedStatus) {
      query = {
        ...query,
        LearnedStatus: LearnedStatus
      }
    }
    const list = LearnHistory.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "Student",
          foreignField: "_id",
          as: "Student",
        }
      },
      { $unwind: '$Student' },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
        }
      },
      { $unwind: '$Teacher' },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "Subject",
        }
      },
      { $unwind: '$Subject' },
      {
        $match: {
          $or: [
            { 'Subject.SubjectName': { $regex: TextSearch, $options: 'i' } },
            { 'Teacher.FullName': { $regex: TextSearch, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          TotalLearned: 1,
          LearnedNumber: 1,
          LearnedStatus: 1,
          RegisterDate: 1,
          'Teacher._id': 1,
          'Teacher.FullName': 1,
          'Student._id': 1,
          'Student.FullName': 1,
          'Subject._id': 1,
          'Subject.SubjectName': 1,
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = LearnHistory.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "Subject",
        }
      },
      { $unwind: '$Subject' },
      {
        $match: {
          $or: [
            { 'Subject.SubjectName': { $regex: TextSearch, $options: 'i' } },
            { 'Teacher.FullName': { $regex: TextSearch, $options: 'i' } }
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
    const result = await Promise.all([list, total])
    return response(
      {
        List: result[0],
        Total: !!result[1].length ? result[1][0].total : 0
      },
      false,
      "Lấy data thành công",
      200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const LearnHistoryService = {
  fncCreateLearnHistory,
  fncGetListLearnHistory
}

export default LearnHistoryService
