import response from "../utils/response"
import { Request } from "express"
import Confirm from "../models/confirm"
import { CommonDTO } from "../dtos/common.dto"
import { ChangeConfirmStatusDTO, CreateUpdateConfirmDTO } from "../dtos/confirm.dto"
import sendEmail from "../utils/send-mail"
import mongoose from "mongoose"
import { Roles } from "../utils/constant"

const fncCreateConfirm = async (req: Request) => {
  try {
    const { TeacherName, StudentName, SubjectName, TeacherEmail, Times, ...remainBody } =
      req.body as CreateUpdateConfirmDTO
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
    const newConfirm = await Confirm.create(remainBody)
    return response(newConfirm, false, "Yêu cầu booking của bạn đã được gửi. Hãy chờ giáo viên xác nhận.", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateConfirm = async (req: Request) => {
  try {
    const { ConfirmID } = req.body as CreateUpdateConfirmDTO
    const updateConfirm = await Confirm.findOneAndUpdate(
      {
        _id: ConfirmID
      },
      { ...req.body },
      { new: true }
    )
    if (!updateConfirm) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updateConfirm, false, "Chỉnh sửa thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeConfirmStatus = async (req: Request) => {
  try {
    const { ConfirmID, ConfirmStatus } = req.body as ChangeConfirmStatusDTO
    const updateConfirm = await Confirm.findOneAndUpdate(
      {
        _id: ConfirmID
      },
      { ConfirmStatus: ConfirmStatus },
      { new: true }
    )
    if (!updateConfirm) return response({}, true, "Có lỗi xảy ra", 200)
    return response(
      updateConfirm,
      false,
      ConfirmStatus === 2
        ? "Xác nhận thành công"
        : "Hủy thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListConfirm = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const { PageSize, CurrentPage, TextSearch } = req.body as CommonDTO
    const confirms = Confirm.aggregate([
      {
        $match: {
          [RoleID === Roles.ROLE_TEACHER
            ? "Receiver"
            : "Sender"
          ]: new mongoose.Types.ObjectId(`${ID}`)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: RoleID === Roles.ROLE_TEACHER
            ? "Sender"
            : "Receiver",
          foreignField: "_id",
          as: RoleID === Roles.ROLE_TEACHER
            ? "Sender"
            : "Receiver",
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
      {
        $unwind: RoleID === Roles.ROLE_TEACHER
          ? "$Sender"
          : "$Receiver"
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
        $match: {
          $or: [
            {
              [RoleID === Roles.ROLE_TEACHER
                ? "Sender.FullName"
                : "Receiver.FullName"
              ]: { $regex: TextSearch, $options: "i" },
            },
            {
              "Subject.SubjectName": { $regex: TextSearch, $options: "i" },
            }
          ]
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = Confirm.aggregate([
      {
        $match: {
          [RoleID === Roles.ROLE_TEACHER
            ? "Receiver"
            : "Sender"
          ]: new mongoose.Types.ObjectId(`${ID}`)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: RoleID === Roles.ROLE_TEACHER
            ? "Sender"
            : "Receiver",
          foreignField: "_id",
          as: RoleID === Roles.ROLE_TEACHER
            ? "Sender"
            : "Receiver",
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
      {
        $unwind: RoleID === Roles.ROLE_TEACHER
          ? "$Sender"
          : "$Receiver"
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
        $match: {
          $or: [
            {
              [RoleID === Roles.ROLE_TEACHER
                ? "Sender.FullName"
                : "Receiver.FullName"
              ]: { $regex: TextSearch, $options: "i" },
            },
            {
              "Subject.SubjectName": { $regex: TextSearch, $options: "i" },
            }
          ]
        }
      },
    ])
    const result = await Promise.all([confirms, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsView: true,
      IsUpdate: RoleID === Roles.ROLE_TEACHER ? false : true,
      IsAccept: RoleID === Roles.ROLE_TEACHER ? true : false,
      IsReject: true
    }))
    return response(
      { List: data, Total: !!result[1].length ? result[1][0].total : 0 },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const ConfirmService = {
  fncCreateConfirm,
  fncUpdateConfirm,
  fncChangeConfirmStatus,
  fncGetListConfirm
}

export default ConfirmService