
import { Request } from "express"
import LearnHistory from "../models/learnhistory"
import Payment from "../models/payment"
import User from "../models/user"
import { Roles } from "../utils/constant"
import response from "../utils/response"
import { getCurrentWeekRange } from "../utils/dateUtils"
import Confirm from "../models/confirm"
import { PaginationDTO } from "../dtos/common.dto"

interface StatisticBookingDTO extends PaginationDTO {
  Key: string
}

const getResultData = (TotalTeacher: number, TotalStudent: number) => {
  return {
    TotalTeacher: TotalTeacher,
    TotalStudent: TotalStudent,
    Total: TotalTeacher + TotalStudent
  }
}

const fncStatisticTotalUser = async () => {
  try {
    let listTeacher = [], listStudent = []
    const currentDate = new Date()
    for (let i = 1; i <= 12; i++) {
      const totalTeacher = User.countDocuments({
        RoleID: Roles.ROLE_TEACHER,
        createdAt: {
          $gte: new Date(`${currentDate.getFullYear()}-${i}-01`),
          $lt: new Date(`
            ${i === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${i === 12 ? 1 : i + 1}-
            01`
          )
        }
      })
      const totalStudent = User.countDocuments({
        RoleID: Roles.ROLE_STUDENT,
        createdAt: {
          $gte: new Date(`${currentDate.getFullYear()}-${i}-01`),
          $lt: new Date(`
            ${i === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${i === 12 ? 1 : i + 1}-
            01`
          )
        }
      })
      listTeacher.push(totalTeacher)
      listStudent.push(totalStudent)
    }
    const totalUser = await User
      .find({
        RoleID: {
          $in: [Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]
        }
      })
      .select("_id RoleID") as any
    const resultTeacher = await Promise.all(listTeacher)
    const resultStudent = await Promise.all(listStudent)
    const dataTeacher = resultTeacher.map((i, idx) => ({
      Month: `Tháng ${idx + 1}`,
      Total: i
    }))
    const dataStudent = resultStudent.map((i, idx) => ({
      Month: `Tháng ${idx + 1}`,
      Total: i
    }))
    return response(
      {
        DataTotal: getResultData(
          totalUser.filter((i: any) => i.RoleID === Roles.ROLE_TEACHER).length,
          totalUser.filter((i: any) => i.RoleID === Roles.ROLE_STUDENT).length,
        ),
        DataTeacher: dataTeacher,
        DataStudent: dataStudent,
      },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticNewRegisteredUser = async () => {
  try {
    const { startOfWeek, endOfWeek } = getCurrentWeekRange()
    const currentDate = new Date()
    const totalUser = User.countDocuments({
      RoleID: {
        $in: [Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]
      }
    })
    const totalNewUser = User.countDocuments({
      RoleID: {
        $in: [Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]
      },
      createdAt: {
        $gte: startOfWeek,
        $lt: endOfWeek
      }
    })
    let totalUserByMonth = [], totalNewUserByMonth = []
    for (let i = 1; i <= 12; i++) {
      const totalUser = User.countDocuments({
        RoleID: {
          $in: [Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]
        },
        createdAt: {
          $gte: new Date(`${currentDate.getFullYear()}-01-01`),
          $lt: new Date(`
            ${i === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${i === 12 ? 1 : i + 1}-
            01`
          )
        }
      })
      const totalNewUser = User.countDocuments({
        RoleID: {
          $in: [Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]
        },
        createdAt: {
          $gte: new Date(`${currentDate.getFullYear()}-${i}-01`),
          $lt: new Date(`
            ${i === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${i === 12 ? 1 : i + 1}-
            01`
          )
        }
      })
      totalUserByMonth.push(totalUser)
      totalNewUserByMonth.push(totalNewUser)
    }
    const resultTotal = await Promise.all([totalUser, totalNewUser])
    const resultTotalUserByMonth = await Promise.all(totalUserByMonth)
    const resultTotalNewUserByMonth = await Promise.all(totalNewUserByMonth)
    const dataTotalUserByMonth = resultTotalUserByMonth.map((i, idx) => ({
      Month: `Tháng ${idx + 1}`,
      Total: i
    }))
    const dataTotalNewUserByMonth = resultTotalNewUserByMonth.map((i, idx) => ({
      Month: `Tháng ${idx + 1}`,
      Total: i
    }))
    return response(
      {
        TotalUser: resultTotal[0],
        TotalNewUser: resultTotal[1],
        TotalUserByMonth: dataTotalUserByMonth,
        TotalNewUserByMonth: dataTotalNewUserByMonth
      },
      false,
      "Lay data thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticTotalBooking = async () => {
  try {
    const totalBooking = await Confirm.find().select("_id ConfirmStatus")
    return response(
      {
        TotalBooking: totalBooking.length,
        SuccessBooking: totalBooking.filter((i: any) => i.ConfirmStatus === 2).length,
        CancelBooking: totalBooking.filter((i: any) => i.ConfirmStatus === 3).length,
      },
      false,
      "Lấy data thành công",
      200
    )
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
          PaymentType: 1
        }
      },
      {
        $group: {
          _id: null,
          totalFeeSum: {
            $sum: {
              $multiply: ["$TotalFee", { $subtract: [1, "$Percent"] }]
            }
          }
        }
      }
    ])
    const costPaid = Payment.aggregate([
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
    const result = await Promise.all([revenue, expense, costPaid])
    return response(
      {
        Revenue: !!result[0][0]?.totalFeeSum ? result[0][0]?.totalFeeSum : 0,
        Expense: !!result[1][0]?.totalFeeSum ? result[1][0]?.totalFeeSum : 0,
        CostPaid: !!result[2][0]?.totalFeeSum ? result[2][0]?.totalFeeSum : 0,
        Profit: !!result[0][0]?.totalFeeSum && !!result[1][0]?.totalFeeSum
          ? result[0][0]?.totalFeeSum - result[1][0]?.totalFeeSum
          : 0
      },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticTopTeacher = async () => {
  try {
    const topTeachers = await User.aggregate([
      {
        $match: {
          RoleID: Roles.ROLE_TEACHER
        }
      },
      {
        $lookup: {
          from: "subjectsettings",
          localField: "_id",
          foreignField: "Teacher",
          as: "SubjectSetting",
          pipeline: [
            { $unwind: '$Votes' },
            {
              $group: {
                _id: "$Teacher",
                TotalVotes: { $sum: "$Votes" },
                Votes: { $push: "$Votes" }
              }
            }
          ]
        }
      },
      { $unwind: "$SubjectSetting" },
      {
        $lookup: {
          from: "confirms",
          localField: "_id",
          foreignField: "Receiver",
          as: "Confirm",
          pipeline: [
            {
              $group: {
                _id: "$Teacher",
                Total: { $sum: 1 },
              }
            },
            {
              $project: {
                _id: 0,
                Total: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Confirm" },
      {
        $project: {
          _id: 1,
          FullName: 1,
          AvatarPath: 1,
          TotalVotes: "$SubjectSetting.TotalVotes",
          Votes: "$SubjectSetting.Votes",
          TotalBook: "$Confirm.Total"
        }
      },
      {
        $sort: {
          TotalVotes: -1
        }
      },
      { $limit: 3 },
    ])
    return response(topTeachers, false, "Lay data thanh cong", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncStatisticBooking = async (req: Request) => {
  try {
    const { CurrentPage, PageSize, Key } = req.body as StatisticBookingDTO
    let bookings, total, result
    switch (Key) {
      case "Day":
        bookings = Confirm
          .find({
            createdAt: Date.now()
          })
          .populate("Sender", ["_id", "FullName"])
          .select("_id Sender TotalFee createdAt ConfirmStatus")
          .sort({
            createdAt: -1
          })
          .skip((CurrentPage - 1) * PageSize)
          .limit(PageSize)
        total = Confirm.countDocuments({
          createdAt: Date.now()
        })
        result = await Promise.all([bookings, total])
        return response(
          { List: result[0], Total: result[1] },
          false,
          "Lấy data thành công",
          200
        )
      case "Week":
        const { startOfWeek, endOfWeek } = getCurrentWeekRange()
        bookings = Confirm
          .find({
            createdAt: {
              $gte: startOfWeek,
              $lt: endOfWeek
            }
          })
          .populate("Sender", ["_id", "FullName"])
          .select("_id Sender TotalFee createdAt ConfirmStatus")
          .sort({
            createdAt: -1
          })
          .skip((CurrentPage - 1) * PageSize)
          .limit(PageSize)
        total = Confirm.countDocuments({
          createdAt: {
            $gte: startOfWeek,
            $lt: endOfWeek
          }
        })
        result = await Promise.all([bookings, total])
        return response(
          { List: result[0], Total: result[1] },
          false,
          "Lấy data thành công",
          200
        )
      case "Month":
        const currentDate = new Date()
        let queryDate = {
          $gte: new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-01`),
          $lt: new Date(`
            ${currentDate.getMonth() + 1 === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}-
            ${currentDate.getMonth() + 1 === 12 ? "01" : currentDate.getMonth() + 2}-
            01`
          )
        }
        bookings = Confirm
          .find({
            createdAt: queryDate
          })
          .populate("Sender", ["_id", "FullName"])
          .select("_id Sender TotalFee createdAt ConfirmStatus")
          .sort({
            createdAt: -1
          })
          .skip((CurrentPage - 1) * PageSize)
          .limit(PageSize)
        total = Confirm.countDocuments({
          createdAt: queryDate
        })
        result = await Promise.all([bookings, total])
        return response(
          { List: result[0], Total: result[1] },
          false,
          "Lấy data thành công",
          200
        )
      default:
        bookings = Confirm
          .find({
            createdAt: Date.now()
          })
          .populate("Sender", ["_id, FullName"])
          .select("_id Sender TotalFee createdAt ConfirmStatus")
          .sort({
            createdAt: -1
          })
          .skip((CurrentPage - 1) * PageSize)
          .limit(PageSize)
        total = Confirm.countDocuments({
          createdAt: Date.now()
        })
        result = await Promise.all([bookings, total])
        return response(
          { List: result[0], Total: result[1] },
          false,
          "Lấy data thành công",
          200
        )
    }
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const StatisticService = {
  fncStatisticTotalUser,
  fncStatisticNewRegisteredUser,
  fncStatisticTotalBooking,
  fncStatisticFinancial,
  fncStatisticTopTeacher,
  fncStatisticBooking
}

export default StatisticService
