import User from "../models/user"
import Payment from "../models/payment"
import { ADMIN_ID } from "../services/message.service"
import { getCurrentWeekRange, randomNumber } from "../utils/commonFunction"
import { Roles } from "../utils/constant"

const getListPaymentInCurrentWeek = async () => {
  try {
    const { startOfWeek, endOfWeek } = getCurrentWeekRange()
    const teachers = await User.aggregate([
      {
        $match: {
          RoleID: Roles.ROLE_TEACHER
        }
      },
      {
        $lookup: {
          from: "timetables",
          localField: "_id",
          foreignField: "Teacher",
          as: "TimeTables",
          pipeline: [
            {
              $match: {
                "DateAt": { $gte: startOfWeek, $lte: endOfWeek },
                "Status": true,
              }
            }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          FullName: 1,
          Price: 1,
          "TimeTables._id": 1,
        }
      }
    ])
    let teacherReported = []
    teachers.forEach(teacher => {
      if (!!teacher.TimeTables.length) {
        const newPayment = Payment.create({
          Sender: ADMIN_ID,
          Receiver: teacher._id,
          PaymentType: 3,
          TraddingCode: randomNumber(),
          TotalFee: teacher.Price * teacher.TimeTables.length * 1000,
          Description: `Thanh toán tiền dạy học cho giảng viên ${teacher.FullName}`,
          PaymentStatus: 1,
        })
        teacherReported.push(newPayment)
      }
    })
    await Promise.all(teacherReported)
  } catch (error) {
    console.log("error", error.toString())
  }
}

export default getListPaymentInCurrentWeek
