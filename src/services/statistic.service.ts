
import { Request } from "express"
import LearnHistory from "../models/learnhistory"
import Payment from "../models/payment"
import User from "../models/user"
import { getCurrentWeekRange } from "../utils/commonFunction"
import { Roles } from "../utils/constant"
import { StatisticTotalUserDTO } from "../dtos/statistic.dto"
import response from "../utils/response"

const getResultData = (TotalTeacher: number, TotalStudent: number) => {
  return {
    TotalTeacher: TotalTeacher,
    TotalStudent: TotalStudent,
    Total: TotalTeacher + TotalStudent
  }
}

const fncStatisticTotalUser = async (req: Request) => {
  try {
    const { FromDate, ToDate } = req.body as StatisticTotalUserDTO
    const queryDate = {
      $gte: FromDate,
      $lte: ToDate
    }
    const teacher = User.countDocuments({
      RoleID: Roles.ROLE_TEACHER,
      createdAt: queryDate
    })
    const student = User.countDocuments({
      RoleID: Roles.ROLE_STUDENT,
      createdAt: queryDate
    })
    const result = await Promise.all([teacher, student])
    return response(
      getResultData(result[0], result[1]),
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticNewRegisteredUser = async (req: Request) => {
  try {
    const { Key } = req.query as { Key: string }
    const currentDate = new Date()
    let teacher, student, result, queryDate
    switch (Key) {
      case "Day":
        teacher = User.countDocuments({
          RoleID: Roles.ROLE_TEACHER,
          createdAt: Date.now()
        })
        student = User.countDocuments({
          RoleID: Roles.ROLE_STUDENT,
          createdAt: Date.now()
        })
        result = await Promise.all([teacher, student])
        return response(
          getResultData(result[0], result[1]),
          false,
          "Lấy data thành công",
          200
        )
      case "Week":
        const { startOfWeek, endOfWeek } = getCurrentWeekRange()
        queryDate = {
          $gte: startOfWeek,
          $lt: endOfWeek
        }
        teacher = User.countDocuments({
          RoleID: Roles.ROLE_TEACHER,
          createdAt: queryDate
        })
        student = User.countDocuments({
          RoleID: Roles.ROLE_STUDENT,
          createdAt: queryDate
        })
        result = await Promise.all([teacher, student])
        return response(
          getResultData(result[0], result[1]),
          false,
          "Lấy data thành công",
          200
        )
      case "Month":
        queryDate = {
          $gte: new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-01`),
          $lt: new Date(`
            ${currentDate.getMonth() + 1 === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${currentDate.getMonth() + 1 === 12 ? "01" : currentDate.getMonth() + 2}-
            01`
          )
        }
        teacher = User.countDocuments({
          RoleID: Roles.ROLE_TEACHER,
          createdAt: queryDate
        })
        student = User.countDocuments({
          RoleID: Roles.ROLE_STUDENT,
          createdAt: queryDate
        })
        result = await Promise.all([teacher, student])
        return response(
          getResultData(result[0], result[1]),
          false,
          "Lấy data thành công",
          200
        )
      default:
        return response({}, true, "Key không tồn tại", 404)
    }
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticBooking = async () => {
  try {
    let listBooking = []
    const currentDate = new Date()
    for (let i = 1; i <= 12; i++) {
      const totalBooking = LearnHistory.countDocuments({
        RegisterDate: {
          $gte: new Date(`${currentDate.getFullYear()}-${i}-01`),
          $lt: new Date(`
            ${i === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${i === 12 ? 1 : i + 1}-
            01`
          )
        }
      })
      listBooking.push(totalBooking)
    }
    const listTotal = await Promise.all(listBooking)
    const list = listTotal.map((i, idx) => ({
      Month: `Tháng ${idx + 1}`,
      Total: i
    }))
    return response(list, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticFinancial = async (req: Request) => {
  try {
    const { FromDate, ToDate } = req.body
    let query = {
      PaymentStatus: 2,
      // PaymentTime: { $gte: FromDate, $lte: ToDate }
    }
    const revenue = Payment.aggregate([
      {
        $match: {
          ...query,
          PaymentType: 1
        }
      },
      {
        $group: {
          _id: null,
          totalFeeSum: { $sum: "$TotalFee" }
        }
      }
    ])
    const expense = Payment.aggregate([
      {
        $match: {
          ...query,
          $or: [
            { PaymentType: 2 },
            { PaymentType: 3 }
          ]
        },
      },
      {
        $group: {
          _id: null,
          totalFeeSum: { $sum: "$TotalFee" }
        }
      }
    ])
    const result = await Promise.all([revenue, expense])
    return response(
      {
        Revenue: result[0][0].totalFeeSum,
        Expense: result[1][0].totalFeeSum,
        Profit: result[0][0].totalFeeSum - result[1][0].totalFeeSum
      },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const StatisticService = {
  fncStatisticTotalUser,
  fncStatisticNewRegisteredUser,
  fncStatisticBooking,
  fncStatisticFinancial
}

export default StatisticService
