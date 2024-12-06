import mongoose from "mongoose"
import LearnHistory from "../models/learnhistory"
import { Roles } from "../utils/constant"
import sendEmail from "../utils/send-mail"
import { Request } from "express"
import {
  CreateLearnHistoryDTO,
  GetListLearnHistoryDTO,
  GetListLearnHistoryOfUserDTO
} from "../dtos/learnhistory.dto"
import EmbeddingPinecone from "../tools/embeddingPinecone"
import response from "../utils/response"
import moment from "moment"

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
    const checkSendMail = await sendEmail(TeacherEmail, subject, content)
    if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    const newLearnHistory = await LearnHistory.create({ ...remainBody, Student: UserID })
    if (newLearnHistory) {
      EmbeddingPinecone.processLearnHistory(UserID)
    }
    return response(newLearnHistory, false, "Thêm thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListLearnHistory = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const { PageSize, CurrentPage, LearnedStatus, TextSearch, SubjectID } = req.body as GetListLearnHistoryDTO
    let query = {
      [RoleID === Roles.ROLE_STUDENT
        ? "Student"
        : "Teacher"
      ]: new mongoose.Types.ObjectId(`${ID}`),
    } as any
    if (!!LearnedStatus) {
      query.LearnedStatus = LearnedStatus
    }
    if (!!SubjectID) {
      query.Subject = new mongoose.Types.ObjectId(`${SubjectID}`)
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
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: '$Student' },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: '$Teacher' },
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
          Teacher: 1,
          Student: 1,
          Subject: 1,
        }
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "LearnHistory",
          as: "Feedback",
          pipeline: [
            {
              $project: {
                _id: 1,
                Rate: 1,
                Content: 1
              }
            }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
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
    const data = result[0].map((i: any) => ({
      ...i,
      IsFeedback: i.LearnedStatus === 2 && !i.Feedback.length ? true : false
    }))
    return response(
      {
        List: data,
        Total: !!result[1].length ? result[1][0].total : 0
      },
      false,
      "Lấy data thành công",
      200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailLearnHistory = async (req: Request) => {
  try {
    const { LearnHistoryID } = req.params
    const learnHistory = await LearnHistory.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${LearnHistoryID}`)
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
        $lookup: {
          from: "timetables",
          localField: "_id",
          foreignField: "LearnHistory",
          as: "Timetables",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "Student",
                foreignField: "_id",
                as: "Student",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      FullName: 1
                    }
                  }
                ]
              }
            },
            { $unwind: "$Student" },
            {
              $lookup: {
                from: "users",
                localField: "Teacher",
                foreignField: "_id",
                as: "Teacher",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      FullName: 1
                    }
                  }
                ]
              }
            },
            { $unwind: "$Teacher" },
            {
              $project: {
                _id: 1,
                Student: 1,
                Documents: 1,
                Status: 1,
                StartTime: 1,
                EndTime: 1,
                IsCancel: 1,
                Teacher: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "LearnHistory",
          as: "Feedback",
          pipeline: [
            {
              $project: {
                _id: 1,
                Rate: 1,
                Content: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          Subject: 1,
          TotalLearned: 1,
          Timetables: 1,
          Feedback: 1
        }
      }
    ])
    if (!learnHistory[0]) return response({}, true, "Có lỗi xảy ra", 200)
    const data = {
      ...learnHistory[0],
      Timetables: learnHistory[0].Timetables.map((i: any) => ({
        ...i,
        IsDisabledAtendance: moment().isBetween(moment(i.EndTime), moment(i.EndTime).endOf("day")) ? false : true
      }))
    }
    return response(data, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListLearnHistoryOfUser = async (req: Request) => {
  try {
    const { TextSearch, PageSize, CurrentPage, UserID, RoleID, LearnedStatus, SubjectID } = req.body as GetListLearnHistoryOfUserDTO
    let query = {
      [RoleID === Roles.ROLE_STUDENT ? "Student" : "Teacher"]: new mongoose.Types.ObjectId(`${UserID}`)
    } as any
    if (!!LearnedStatus) {
      query.LearnedStatus = LearnedStatus
    }
    if (!!SubjectID) {
      query.Subject = new mongoose.Types.ObjectId(`${SubjectID}`)
    }
    const list = LearnHistory.aggregate([
      {
        $match: query
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
        $lookup: {
          from: "users",
          localField: "Student",
          foreignField: "_id",
          as: "Student",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Student" },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $match: {
          $or: [
            { 'Teacher.FullName': { $regex: TextSearch, $options: 'i' } },
            { 'Student.FullName': { $regex: TextSearch, $options: 'i' } },
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
          Teacher: 1,
          Student: 1,
          Subject: 1,
        }
      },
      {
        $sort: { createdAt: -1 }
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
        $lookup: {
          from: "users",
          localField: "Student",
          foreignField: "_id",
          as: "Student",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Student" },
      {
        $lookup: {
          from: "users",
          localField: "Teacher",
          foreignField: "_id",
          as: "Teacher",
          pipeline: [
            {
              $project: {
                _id: 1,
                FullName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Teacher" },
      {
        $match: {
          $or: [
            { 'Teacher.FullName': { $regex: TextSearch, $options: 'i' } },
            { 'Student.FullName': { $regex: TextSearch, $options: 'i' } },
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
  fncGetListLearnHistory,
  fncGetDetailLearnHistory,
  fncGetListLearnHistoryOfUser
}

export default LearnHistoryService
