import * as dotenv from "dotenv"
dotenv.config()
import { Roles } from "../utils/constant"
import ExcelJS from "exceljs"
import Payment from "../models/payment"
import sendEmail from "../utils/send-mail"
import iconv from "iconv-lite"
import { Request, Response } from "express"
import {
  ChangePaymentStatusDTO,
  CreatePaymentDTO,
  GetListPaymentDTO,
  GetListPaymentHistoryByUserDTO,
  GetListTransferDTO,
} from "../dtos/payment.dto"
import response from "../utils/response"
import { formatMoney } from "../utils/stringUtils"

const PaymentType = [
  {
    Key: 1,
    Name: "Thanh toán book giáo viên"
  },
  {
    Key: 2,
    Name: "Hoàn tiền"
  },
  {
    Key: 3,
    Name: "Thanh toán tiền dạy cho giáo viên"
  }
]

const PaymentStatus = [
  {
    Key: 1,
    Name: "Chờ thanh toán"
  },
  {
    Key: 2,
    Name: "Đã thanh toán"
  },
  {
    Key: 3,
    Name: "Hủy thanh toán"
  }
]

const fncCreatePayment = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const newPayment = await Payment.create({
      ...req.body as CreatePaymentDTO,
      Sender: UserID
    })
    return response(newPayment, false, "Lấy link thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListPaymentHistoryByUser = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { PageSize, CurrentPage, TraddingCode, PaymentStatus, PaymentType } =
      req.body as GetListPaymentHistoryByUserDTO
    let query = {
      $or: [
        { Sender: UserID },
        { Receiver: UserID }
      ],
      TraddingCode: { $regex: TraddingCode, $options: "i" }
    } as any
    if (!!PaymentStatus) {
      query.PaymentStatus = PaymentStatus
    }
    if (!!PaymentType) {
      query.PaymentType = PaymentType
    }
    const payments = Payment
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = Payment.countDocuments(query)
    const result = await Promise.all([payments, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lay data thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangePaymentStatus = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { PaymentID, PaymentStatus, TotalFee, FullName, Email, RoleID } =
      req.body as ChangePaymentStatusDTO
    const updatePayment = await Payment.findOneAndUpdate(
      { _id: PaymentID, Sender: UserID },
      { PaymentStatus }
    )
    if (!updatePayment) return response({}, true, "Có lỗi xảy ra", 200)
    let attachments
    if (!!req.file) {
      const buffer = Buffer.from(req.file.originalname, 'latin1')
      attachments = [
        {
          filename: iconv.decode(buffer, 'utf8'),
          path: req.file.path,
          cid: "myBill"
        }
      ]
    }
    const subject = +RoleID === Roles.ROLE_TEACHER
      ? "THÔNG BÁO THANH TOÁN TIỀN GIẢNG DẠY"
      : "THÔNG BÁO HOÀN TIỀN"
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
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">
                    ${+RoleID === Roles.ROLE_TEACHER
        ? "THÔNG BÁO THANH TOÁN TIỀN GIẢNG DẠY"
        : "THÔNG BÁO HOÀN TIỀN"
      }
                  </p>
                  <p style="margin-bottom:10px">Xin chào ${FullName},</p>
                  <p style="margin-bottom:10px">
                    ${+RoleID === Roles.ROLE_TEACHER
        ? `Chúng tôi đã hoàn tất quá trình thanh toán tiền giảng dạy cho 1 tuần vừa qua của bạn với số tiền là ${formatMoney(TotalFee)}VNĐ. Vui lòng kiểm tra hình ảnh thông tin giao dịch dưới đây và đăng nhập ngân hàng để kiểm tra số tài khoản.`
        : `Chúng tôi đã kiểm tra report của bạn và không nhận được phản hồi từ giáo viên nên chúng tôi đã hoàn lại cho bạn 80% số tiền của buổi học đó tương đương ${formatMoney(TotalFee)}VNĐ. Vui lòng kiểm tra hình ảnh thông tin giao dịch dưới đây và đăng nhập ngân hàng để kiểm tra số tài khoản.`
      }
                  </p>
                  <p style="margin-bottom:10px">Mọi thắc mắc vui lòng gửi đến địa chỉ email này.</p>
                  <img style="width: 150px; height: 300px" src="cid:myBill" />
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(Email, subject, content, attachments)
    if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    return response(updatePayment, false, "Thanh toán thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListPayment = async (req: Request) => {
  try {
    const { PageSize, CurrentPage, TextSearch, PaymentType } =
      req.body as GetListPaymentDTO
    let query = {
      PaymentStatus: 2
    } as any
    if (!!PaymentType) {
      query.PaymentType = PaymentType
    }
    const payments = Payment.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "Sender",
          foreignField: "_id",
          as: "Sender"
        }
      },
      { $unwind: '$Sender' },
      {
        $match: {
          $or: [
            { 'Sender.FullName': { $regex: TextSearch, $options: 'i' } },
            { TraddingCode: { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          TraddingCode: 1,
          TotalFee: 1,
          Description: 1,
          PaymentStatus: 1,
          PaymentType: 1,
          PaymentTime: 1,
          'Sender._id': 1,
          'Sender.FullName': 1,
        }
      },
      { $sort: { PaymentTime: -1 } },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = Payment.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "Sender",
          foreignField: "_id",
          as: "Sender"
        }
      },
      { $unwind: '$Sender' },
      {
        $match: {
          $or: [
            { 'Sender.FullName': { $regex: TextSearch, $options: 'i' } },
            { TraddingCode: { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      {
        $count: "total"
      }
    ])
    const result = await Promise.all([payments, total])
    return response(
      {
        List: result[0],
        Total: !!result[1].length ? result[1][0].total : 0
      },
      false,
      "Lay data thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncExportExcel = async (res: Response) => {
  try {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("My payment")
    worksheet.columns = [
      { header: "STT", key: "STT", width: 10 },
      { header: "Mã giao dịch", key: "TraddingCode", width: 15 },
      { header: "Người giao dịch", key: "FullName", width: 25 },
      { header: "Nội dung giao dịch", key: "Description", width: 60 },
      { header: "Số tiền", key: "TotalFee", width: 20 },
      { header: "Loại thanh toán", key: "PaymentType", width: 40 },
      { header: "Trạng thái thanh toán", key: "PaymentStatus", width: 20 },
    ]
    const payments =
      await Payment.find().populate("Sender", ["_id", "FullName"])
    const listColumCenter = ['A', 'B', 'C', 'E', 'F', 'G']
    payments.forEach((payment: any, idx) => {
      const row = worksheet.addRow({
        STT: idx + 1,
        TraddingCode: payment.TraddingCode,
        FullName: payment.Sender.FullName,
        Description: payment.Description,
        TotalFee: payment.TotalFee,
        PaymentType: PaymentType.find(i => i.Key === payment.PaymentType)?.Name,
        PaymentStatus: PaymentStatus.find(i => i.Key === payment.PaymentStatus)?.Name,
      })
      listColumCenter.forEach(col => {
        row.getCell(col).alignment = { vertical: 'middle', horizontal: 'center' }
      })
    })
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
    const file = await workbook.xlsx.writeBuffer()
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=payment.xlsx')
    res.send(file)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTransfer = async (req: Request) => {
  try {
    const { PageSize, CurrentPage, FromDate, ToDate } = req.body as GetListTransferDTO
    const payments = await Payment.aggregate([
      {
        $match: {
          $or: [
            { PaymentType: 3 },
            { PaymentType: 2 }
          ],
          PaymentStatus: 1,
          PaymentTime: { $gte: new Date(FromDate), $lte: new Date(ToDate) }
        }
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "Receiver",
          as: "Receiver",
          pipeline: [
            {
              $lookup: {
                from: "timetables",
                foreignField: "Teacher",
                localField: "_id",
                as: "TimeTables",
                pipeline: [
                  {
                    $match: {
                      "StartTime": { $gte: new Date(FromDate), $lte: new Date(ToDate) },
                      "Status": true,
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
                      DateAt: 1,
                      StartTime: 1,
                      EndTime: 1,
                      LearnType: 1,
                      Address: 1,
                      Subject: 1
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
                TimeTables: 1,
                Email: 1,
                RoleID: 1
              }
            },
          ]
        }
      },
      { $unwind: "$Receiver" },
      {
        $sort: { PaymentTime: -1 }
      },
    ])
    return response(payments, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncCancelPaymentOfTeacher = async (req: Request) => {
  try {
    // const {PaymentID,}
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const PaymentService = {
  fncCreatePayment,
  fncGetListPaymentHistoryByUser,
  fncChangePaymentStatus,
  fncGetListPayment,
  fncExportExcel,
  fncGetListTransfer,
}

export default PaymentService
