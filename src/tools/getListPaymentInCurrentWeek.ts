import User from "../models/user"
import Payment from "../models/payment"
import { ADMIN_ID } from "../services/message.service"
import { Roles } from "../utils/constant"
import TimeTable from "../models/timetable"
import { getCurrentWeekRange } from "../utils/dateUtils"
import { randomNumber } from "../utils/randomUtils"
import ProfitPercent from "../models/profitpercent"

const getListPaymentInCurrentWeek = async () => {
  try {
    console.log("cron job getListPaymentInCurrentWeek")
    const { startOfWeek, endOfWeek } = getCurrentWeekRange()
    const profitPercent = await ProfitPercent.find().lean()
    const timetables = await TimeTable.aggregate([
      {
        $match: {
          Status: true,
          IsCancel: false,
          AttendanceTime: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { Teacher: "$Teacher", Subject: "$Subject" },
          StartTime: { $push: "$StartTime" },
          Status: { $first: "$Status" },
          IsCancel: { $first: "$IsCancel" },
          TotalPrice: { $sum: "$Price" }
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.Teacher",
          foreignField: "_id",
          as: "TeacherInfo",
        },
      },
      {
        $unwind: "$TeacherInfo",
      },
      {
        $project: {
          Teacher: "$_id.Teacher",
          Subject: "$_id.Subject",
          StartTime: 1,
          Status: 1,
          IsCancel: 1,
          TotalPrice: 1,
          _id: 0,
          "TeacherID": "$TeacherInfo._id",
          "TeacherName": "$TeacherInfo.FullName",
        },
      },
    ])
    let teacherReported = [] as any
    if (!!timetables.length) {
      timetables.forEach((i: any) => {
        const newPayment = Payment.create({
          Sender: ADMIN_ID,
          Receiver: i.TeacherID,
          PaymentType: 3,
          TraddingCode: randomNumber(),
          TotalFee: i.TotalPrice,
          Description: `Thanh toán tiền dạy học cho giảng viên ${i.TeacherName}`,
          PaymentStatus: 1,
          PaymentMethod: 2,
          Percent: profitPercent[0].Percent
        })
        teacherReported.push(newPayment)
      })
      await Promise.all(teacherReported)
    }
  } catch (error: any) {
    console.log("error cron job getListPaymentInCurrentWeek", error.toString())
  }
}

export default getListPaymentInCurrentWeek
