import response from "../utils/response"
import { Request } from "express"
import Confirm from "../models/confirm"
import { CommonDTO } from "../dtos/common.dto"
import { ChangeConfirmStatusDTO, CreateConfirmDTO, UpdateConfirmDTO } from "../dtos/confirm.dto"
import sendEmail from "../utils/send-mail"
import mongoose from "mongoose"
import { Roles } from "../utils/constant"
import TimeTable from "../models/timetable"
import moment from "moment"
import Course from "../models/course"
import { getOneDocument } from "../utils/queryFunction"

const getStartTime = (listConfirm: any[], confirmID: any) => {
  let listStartTime = [] as any[]
  listConfirm.forEach((i: any) => {
    if (i.ConfirmStatus === 2 && !i._id.equals(confirmID)) {
      i.Schedules.forEach((s: any) => {
        if (moment(s.StartTime).diff(moment(), "hours") > 0) {
          listStartTime.push(new Date(s.StartTime).toISOString())
        }
      })
    }
  })
  return listStartTime
}

const fncCreateConfirm = async (req: Request) => {
  try {
    const { TeacherName, StudentName, SubjectName, TeacherEmail, Times, ...remainBody } =
      req.body as CreateConfirmDTO
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
                  ${Times.map(i => `<div>${i}</div>`).join('')}
                  <p>Giáo viên hãy vào lịch booking của mình để kiểm tra thông tin booking.</p>
                  <div>
                    <span style="color:red; margin-right: 4px">Lưu ý:</span>
                    <span>Trong vòng 48h nếu bạn không xác nhận booking này thì booking này sẽ tự động chuyển thành "Hủy xác nhận".</span>
                  </div>
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
    const { ConfirmID, Sender, Schedules } = req.body as UpdateConfirmDTO
    const checkExistTimeTable = await TimeTable.findOne({
      Student: Sender,
      StartTime: {
        $in: Schedules.map((i: any) => i.StartTime)
      }
    })
    if (!!checkExistTimeTable) {
      return response(
        {},
        true,
        `Bạn đã có lịch học vào ngày ${moment(checkExistTimeTable.StartTime).format("DD/MM/YYYY")} ${moment(checkExistTimeTable.StartTime).format("HH:mm")} - ${moment(checkExistTimeTable.EndTime).format("HH:mm")}`,
        200
      )
    }
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
    const { ConfirmID, ConfirmStatus, Recevier, RecevierName, SenderName, SenderEmail, Reason } = req.body as ChangeConfirmStatusDTO
    const confirm = await getOneDocument(Confirm, "_id", ConfirmID)
    if (!confirm) return response({}, true, "Có lỗi xảy ra", 200)
    // if (ConfirmStatus === 2) {
    //   const checkExistTimeTable = await TimeTable.findOne({
    //     Teacher: Recevier,
    //     StartTime: {
    //       $in: confirm.Schedules.map((i: any) => i.StartTime)
    //     }
    //   })
    //   if (!!checkExistTimeTable) {
    //     return response(
    //       {},
    //       true,
    //       `Bạn đã có lịch dạy vào ngày ${moment(checkExistTimeTable.StartTime).format("DD/MM/YYYY")} ${moment(checkExistTimeTable.StartTime).format("HH:mm")} - ${moment(checkExistTimeTable.EndTime).format("HH:mm")}`,
    //       200
    //     )
    //   }
    if ([2, 3].includes(ConfirmStatus)) {
      const subject = "THÔNG BÁO TRẠNG THÁI ĐĂNG KÝ HỌC"
      const confirmContent = `>Giáo viên ${RecevierName} đã xác nhận booking của bạn. Bạn hãy truy cập vào lịch sử booking của mình để tiến hành thanh toán và hoàn tất booking.>Giáo viên ${RecevierName} đã xác nhận booking của bạn. Bạn hãy truy cập vào lịch sử booking của mình để tiến hành thanh toán và hoàn tất booking.`
      const rejectContent = `Giáo viên ${RecevierName} đã hủy xác nhận booking của bạn với lý do: ${Reason}`
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
        <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO TRẠNG THÁI ĐĂNG KÝ HỌC</p>
        <p style="margin-bottom:10px">Xin chào ${SenderName},</p>
        <p style="margin-bottom:10px">${ConfirmStatus === 2 ? confirmContent : rejectContent}</p>
        ${ConfirmStatus === 2 ?
          `<div>
          <span style="color:red; margin-right: 4px">Lưu ý:</span>
          <span>Trong vòng 48h nếu bạn không thanh toán booking này thì booking này sẽ tự động chuyển thành "Hủy xác nhận".</span>
        </div>`
          : ""
        }
      </body>
      </html>
      `
      const checkSendMail = await sendEmail(SenderEmail, subject, content)
      if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    }
    // }
    const updateConfirm = await Confirm
      .findOneAndUpdate(
        { _id: ConfirmID },
        { ConfirmStatus: ConfirmStatus },
        { new: true }
      )
      .populate("Receiver", ["_id", "FullName"])
      .populate("Subject", ["_id", "SubjectName"])
      .lean() as any
    if (ConfirmStatus == 2 && !!confirm.CourseID) {
      const updateCourse = await Course.findOneAndUpdate(
        { _id: confirm.CourseID },
        {
          $inc: {
            QuantityLearner: 1
          }
        }
      )
      if (!updateCourse) response({}, true, "Có lỗi xảy ra trong quá trình gửi update course", 200)
    }
    return response(
      updateConfirm,
      false,
      ConfirmStatus === 2
        ? "Xác nhận thành công"
        : ConfirmStatus === 3
          ? "Hủy thành công"
          : "Ghi nhận thành công"
      ,
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
              $project: {
                _id: 1,
                FullName: 1,
                Email: 1
              }
            },
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
      // IsUpdate: RoleID === Roles.ROLE_TEACHER || i.ConfirmStatus !== 1 ? false : true,
      IsConfirm: RoleID !== Roles.ROLE_TEACHER || [1, 2, 3].includes(i.ConfirmStatus) ? false : true,
      IsPaid: RoleID === Roles.ROLE_STUDENT && i.ConfirmStatus === 2 && !i.IsPaid ? true : false,
      IsReject: (RoleID === Roles.ROLE_STUDENT && i.ConfirmStatus === 1) ||
        (RoleID === Roles.ROLE_TEACHER && i.ConfirmStatus === 4)
        ? true
        : false,
      IsNoted: RoleID !== Roles.ROLE_TEACHER || [2, 3, 4].includes(i.ConfirmStatus) ? false : true,
      IsDisabledConfirm: i.ConfirmStatus === 4 && i.Schedules
        .map((sche: any) => new Date(sche.StartTime).toISOString())
        .some((schedule: any) => getStartTime(result[0], i._id).includes(schedule)),
    }))
    return response(
      {
        List: data,
        Total: !!result[1].length ? result[1][0].total : 0
      },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailConfirm = async (req: Request) => {
  try {
    const { ConfirmID } = req.params
    if (!mongoose.Types.ObjectId.isValid(`${ConfirmID}`)) {
      return response({}, true, "ID Booking không tồn tại", 200)
    }
    const confirm = await Confirm.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${ConfirmID}`)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "Receiver",
          foreignField: "_id",
          as: "Receiver",
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
                Email: "$Account.Email"
              }
            },
            {
              $project: {
                _id: 1,
                FullName: 1,
                Email: 1
              }
            },
          ]
        }
      },
      { $unwind: "$Receiver" },
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
    ])
    if (!confirm[0]) return response({}, true, "Booking không tồn tại", 200)
    return response(confirm[0], false, "Lấy dữ liệu thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeConfirmPaid = async (req: Request) => {
  try {
    const { ConfirmID } = req.params
    const updateConfirm = await Confirm.updateOne(
      { _id: ConfirmID },
      { IsPaid: true },
      { new: true }
    )
    if (!updateConfirm) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updateConfirm, false, "Thanh toán thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const ConfirmService = {
  fncCreateConfirm,
  fncUpdateConfirm,
  fncChangeConfirmStatus,
  fncGetListConfirm,
  fncGetDetailConfirm,
  fncChangeConfirmPaid
}

export default ConfirmService