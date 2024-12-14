import TimeTable from "../models/timetable"
import LearnHistory from "../models/learnhistory"
import { Roles } from "../utils/constant"
import { Request } from "express"
import {
  AttendanceOrCancelTimeTableDTO,
  CreateTimeTableDTO,
  UpdateTimeTableDTO
} from "../dtos/timetable.dto"
import response from "../utils/response"
import moment from "moment"
import mongoose from "mongoose"
import Blog from "../models/blog"

const fncCreateTimeTable = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const data = (req.body as CreateTimeTableDTO[]).map((i) => ({
      ...i,
      Student: UserID
    }))
    const newTimeTable = await TimeTable.insertMany(data, { ordered: true })
    return response(newTimeTable, false, "Thêm thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetTimeTableOfTeacherOrStudent = async (req: Request) => {
  try {
    const { RoleID } = req.user
    const { UserID, IsBookingPage } = req.body
    let schedulesInBlog = [] as any[]
    if (RoleID === Roles.ROLE_STUDENT && !!IsBookingPage) {
      const blogs = await Blog
        .find({
          "TeacherReceive.Teacher": UserID,
          "TeacherReceive.ReceiveStatus": 1,
          IsDeleted: false
        })
        .select("_id RealSchedules")
        .lean()
      blogs.forEach((b: any) => {
        b.RealSchedules.forEach((r: any) => {
          schedulesInBlog.push({
            StartTime: r.StartTime,
            EndTime: r.EndTime
          })
        })
      })
    }
    const timetables = await TimeTable
      .find({
        [RoleID === Roles.ROLE_TEACHER ? "Student" : "Teacher"]: UserID,
        StartTime: { $gte: new Date() },
        IsCancel: false
      })
      .select("StartTime EndTime")
    return response(
      RoleID === Roles.ROLE_STUDENT && !!IsBookingPage
        ? [...timetables, ...schedulesInBlog]
        : timetables,
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncAttendanceTimeTable = async (req: Request) => {
  try {
    const TimeTableID = req.params.TimeTableID
    const timetable = await TimeTable.findOneAndUpdate(
      { _id: TimeTableID },
      {
        Status: true,
        AttendanceTime: Date.now()
      },
      { new: true }
    )
    if (!timetable) return response({}, true, "Có lỗi xảy ra", 200)
    const learnHistory = await LearnHistory
      .findOneAndUpdate(
        { _id: timetable.LearnHistory },
        {
          $inc: {
            LearnedNumber: 1
          }
        },
        { new: true }
      )
      .lean()
    if (!learnHistory) return response({}, true, "Có lỗi xảy ra", 200)
    if (learnHistory.LearnedNumber === learnHistory.TotalLearned) {
      await LearnHistory
        .findOneAndUpdate(
          { _id: timetable.LearnHistory },
          {
            LearnedStatus: 2
          },
          { new: true }
        )
    }
    return response({}, false, "Điểm danh thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateTimeTable = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { TimeTableID, StartTime, EndTime } = req.body as UpdateTimeTableDTO
    const checkExistTimetable = await TimeTable
      .findOne({
        StartTime: {
          $gte: StartTime,
          $lte: EndTime
        },
        _id: {
          $ne: TimeTableID
        }
      })
      .lean()
    if (!!checkExistTimetable) {
      if (checkExistTimetable.Teacher.equals(UserID)) {
        return response(checkExistTimetable, true, "Bạn đã có lịch học vào thời điểm này", 200)
      } else {
        return response(checkExistTimetable, true, "Học sinh của bạn đã có lịch học vào thời điểm này", 200)
      }
    }
    const updateTimetable = await TimeTable
      .findOneAndUpdate(
        { _id: TimeTableID },
        { ...req.body },
        { new: true }
      )
      .populate("Teacher", ["_id", "FullName"])
      .populate("Student", ["_id", "FullName"])
      .populate("Subject", ["_id", "SubjectName"])
      .lean()
    return response(updateTimetable, false, "Cập nhật lịch học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetTimeTableByUser = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const { IsBookingPage } = req.body
    let schedulesInBlog = [] as any[]
    const ButtonShow = {
      IsShowBtnAttendance: RoleID === Roles.ROLE_TEACHER ? true : false,
      IsShowBtnUpdateTimeTable: RoleID === Roles.ROLE_TEACHER ? true : false
    }
    if (!!IsBookingPage) {
      const blogs = await Blog
        .find({
          User: ID,
          IsDeleted: false
        })
        .select("_id RealSchedules")
        .lean()
      blogs.forEach((b: any) => {
        b.RealSchedules.forEach((r: any) => {
          schedulesInBlog.push({
            StartTime: r.StartTime,
            EndTime: r.EndTime
          })
        })
      })
    }
    const timetables = await TimeTable.aggregate([
      {
        $match: {
          [RoleID === Roles.ROLE_STUDENT ? "Student" : "Teacher"]: new mongoose.Types.ObjectId(`${ID}`),
          IsCancel: false
        }
      },
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
    const data = timetables.map((i: any) => ({
      ...i,
      IsAttendance: (moment().isAfter(i.StartTime) &&
        moment().isBefore(moment(i.EndTime).add(24, "hours")) &&
        !i.Status)
        ? true
        : false,
      IsUpdateTimeTable: moment().isBefore(moment(i.StartTime).diff(12, "hours")) &&
        moment().isBefore(moment(i.StartTime)) ||
        moment().isAfter(i.EndTime)
        ? false
        : true,
    }))
    return response({ List: data, ButtonShow }, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncAttendanceOrCancelTimeTable = async (req: Request) => {
  try {
    const { TimeTables, Type, LearnHistoryID } = req.body as AttendanceOrCancelTimeTableDTO
    const updateTimeTables = await TimeTable.updateMany(
      {
        _id: {
          $in: TimeTables
        }
      },
      {
        [`${Type}`]: true,
        AttendanceTime: Date.now()
      }
    )
    if (!updateTimeTables.acknowledged) return response({}, true, "Có lỗi xảy ra", 200)
    if (Type === "Status") {
      const learnHistory = await LearnHistory
        .findOneAndUpdate(
          { _id: LearnHistoryID },
          {
            $inc: {
              LearnedNumber: TimeTables.length
            }
          },
          { new: true }
        )
        .lean()
      if (!learnHistory) return response({}, true, "Có lỗi xảy ra", 200)
      if (learnHistory.LearnedNumber === learnHistory.TotalLearned) {
        await LearnHistory
          .findOneAndUpdate(
            { _id: LearnHistoryID },
            {
              LearnedStatus: 2
            },
            { new: true }
          )
      }
    }
    return response({}, false, "Cập nhật thời khóa biểu thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const TimeTableService = {
  fncCreateTimeTable,
  fncGetTimeTableOfTeacherOrStudent,
  fncAttendanceTimeTable,
  fncUpdateTimeTable,
  fncGetTimeTableByUser,
  fncAttendanceOrCancelTimeTable
}

export default TimeTableService
