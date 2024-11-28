import TimeTable from "../models/timetable"
import LearnHistory from "../models/learnhistory"
import { Roles } from "../utils/constant"
import { Request } from "express"
import {
  CreateTimeTableDTO,
  UpdateTimeTableDTO
} from "../dtos/timetable.dto"
import response from "../utils/response"
import moment from "moment"

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
    const { UserID } = req.params
    const timetables = await TimeTable
      .find({
        [RoleID === Roles.ROLE_TEACHER ? "Student" : "Teacher"]: UserID,
        StartTime: { $gte: new Date() }
      })
      .select("StartTime EndTime")
    return response(timetables, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncAttendanceTimeTable = async (req: Request) => {
  try {
    // const UserID = req.user.ID
    const TimeTableID = req.params.TimeTableID
    const timetable = await TimeTable.findOneAndUpdate({ _id: TimeTableID }, { Status: true }, { new: true })
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
    const { TimeTableID, StartTime, EndTime } =
      req.body as UpdateTimeTableDTO
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
    const ButtonShow = {
      IsShowBtnAttendance: RoleID === Roles.ROLE_TEACHER ? true : false,
      IsShowBtnUpdateTimeTable: RoleID === Roles.ROLE_TEACHER ? true : false
    }

    const timetables = await TimeTable
      .find({
        [RoleID === Roles.ROLE_STUDENT ? "Student" : "Teacher"]: ID,
      })
      .populate("Teacher", ["_id", "FullName"])
      .populate("Student", ["_id", "FullName"])
      .populate("Subject", ["_id", "SubjectName"])
      .lean()
    const data = timetables.map((i: any) => ({
      ...i,
      IsAttendance: (moment().isAfter(i.StartTime) &&
        moment().isBefore(moment(i.EndTime).add(24, "hours")) &&
        !i.Status)
        ? true
        : false,
      IsUpdateTimeTable: moment().isAfter(moment(i.StartTime).diff(12, "hours")) &&
        moment().isBefore(moment(i.EndTime))
        ? true
        : false,
      IsSubmitIssue: RoleID === Roles.ROLE_STUDENT &&
        (moment().isAfter(i.EndTime) &&
          moment().isBefore(moment(i.EndTime).add(24, "hours")))
        ? true
        : false
    }))
    return response({ List: data, ButtonShow }, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const TimeTableService = {
  fncCreateTimeTable,
  fncGetTimeTableOfTeacherOrStudent,
  fncAttendanceTimeTable,
  fncUpdateTimeTable,
  fncGetTimeTableByUser
}

export default TimeTableService
