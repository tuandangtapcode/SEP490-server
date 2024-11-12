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
    // const findTimeTableExist = (req.body as CreateTimeTableDTO[]).map((i) =>
    //   TimeTable.findOne({
    //     Teacher: i.Teacher,
    //     StartTime: i.StartTime,
    //     EndTime: i.EndTime
    //   }).lean()
    // )
    // const checkTimeTableExist = await Promise.all(findTimeTableExist)
    // if (!!checkTimeTableExist[0])
    //   return response(
    //     checkTimeTableExist.map((i: any) => ({
    //       StartTime: i.StartTime,
    //       EndTime: i.EndTime,
    //       DateAt: i.DateAt
    //     })),
    //     false,
    //     "Lịch học đã được đăng ký",
    //     200
    //   )
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
    const { TimeTableID, StartTime } =
      req.body as UpdateTimeTableDTO
    const checkExistTimetable = await TimeTable.findOne({
      StartTime,
      _id: {
        $ne: TimeTableID
      }
    })
    if (!!checkExistTimetable)
      return response({}, true, "Bạn đã có lịch học vào thời điểm này", 200)
    const updateTimetable = await TimeTable.findOneAndUpdate(
      { _id: TimeTableID },
      { ...req.body },
      { new: true }
    )
    return response(updateTimetable, false, "Cập nhật lịch học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetTimeTableByUser = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const ButtonShow = {
      isShowBtnAttendance: RoleID === Roles.ROLE_TEACHER ? true : false,
      isShowBtnUpdateTimeTable: RoleID === Roles.ROLE_TEACHER ? true : false
    }

    const timetables = await TimeTable
      .find({
        [RoleID === Roles.ROLE_STUDENT ? "Student" : "Teacher"]: ID
      })
      .populate("Teacher", ["_id", "FullName"])
      .populate("Student", ["_id", "FullName"])
      .populate("Subject", ["_id", "SubjectName"])
      .lean()
    const data = timetables.map((i: any) => ({
      ...i,
      isAttendance: (moment().isAfter(i.StartTime) &&
        moment().isBefore(moment(i.EndTime).add(24, "hours")) &&
        !i.Status)
        ? true
        : false,
      isUpdateTimeTable: true,
      isSubmitIssue: (moment().isAfter(i.EndTime) &&
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
