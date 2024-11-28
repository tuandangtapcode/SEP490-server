import User from "../models/user"
import Payment from "../models/payment"
import { ADMIN_ID } from "../services/message.service"
import { getCurrentWeekRange, randomNumber } from "../utils/commonFunction"
import { Roles } from "../utils/constant"
import TimeTable from "../models/timetable"
import SubjectSetting from "../models/subjectsetting"

const getListPaymentInCurrentWeek = async () => {
  try {
    console.log("cron job getListPaymentInCurrentWeek");
    const { startOfWeek, endOfWeek } = getCurrentWeekRange()
    const timetables = await TimeTable
      .find(
        {
          StartTime: { $gte: startOfWeek, $lte: endOfWeek },
          Status: true,
        }
      )
      .select("_id Teacher Subject")
      .lean()
    const subjectSetting = timetables.map((i: any) => (
      SubjectSetting
        .findOne(
          {
            Teacher: i.Teacher,
            Subject: i.Subject
          }
        )
        .populate("Teacher", ["_id", "FullName"])
        .select("_id Teacher Subject Price")
        .lean()
    ))
    const result = await Promise.all(subjectSetting)
    const data = result.map((i: any) => ({
      ...i,
      TimeTables: timetables.filter((p: any) => p.Teacher.equals(i.Teacher._id) && p.Subject.equals(i.Subject))
    }))
    let teacherReported = [] as any
    data.forEach((i: any) => {
      if (!!i.TimeTables.length) {
        const newPayment = Payment.create({
          Sender: ADMIN_ID,
          Receiver: i.Teacher._id,
          PaymentType: 3,
          TraddingCode: randomNumber(),
          TotalFee: i.Price * i.TimeTables.length * 1000,
          Description: `Thanh toán tiền dạy học cho giảng viên ${i.Teacher.FullName}`,
          PaymentStatus: 1,
          PaymentMethod: 2
        })
        teacherReported.push(newPayment)
      }
    })
    await Promise.all(teacherReported)
  } catch (error: any) {
    console.log("error cron job getListPaymentInCurrentWeek", error.toString())
  }
}

export default getListPaymentInCurrentWeek
