import TimeTable from "../models/timetable"
import LearnHistory from "../models/learnhistory"
import { Roles } from "../utils/constant"
import { getOneDocument } from "../utils/queryFunction"
import { Request } from "express"
import {
  CreateTimeTableDTO,
  UpdateTimeTableDTO
} from "../dtos/timetable.dto"
import response from "../utils/response"

const fncCreateTimeTable = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const data = (req.body as CreateTimeTableDTO[]).map((i) => ({
      ...i,
      Student: UserID
    }))
    const findTimeTableExist = (req.body as CreateTimeTableDTO[]).map((i) =>
      TimeTable.findOne({
        Teacher: i.Teacher,
        StartTime: i.StartTime,
        EndTime: i.EndTime
      }).lean()
    )
    const checkTimeTableExist = await Promise.all(findTimeTableExist)
    if (!!checkTimeTableExist[0])
      return response(
        checkTimeTableExist.map((i: any) => ({
          StartTime: i.StartTime,
          EndTime: i.EndTime,
          DateAt: i.DateAt
        })),
        false,
        "Lịch học đã được đăng ký",
        200
      )
    const newTimeTable = await TimeTable.insertMany(data, { ordered: true })
    return response(newTimeTable, false, "Thêm thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetTimeTableByUser = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const ButtonShow = {
      isAttendance: RoleID === Roles.ROLE_STUDENT ? false : true,
      isUpdateTimeTable: RoleID === Roles.ROLE_STUDENT ? false : true
    }

    const timetables = await TimeTable
      .find({
        [RoleID === Roles.ROLE_STUDENT ? "Student" : "Teacher"]: ID
      })
      .populate("Teacher", ["_id", "FullName"])
      .populate("Student", ["_id", "FullName"])
      .populate("Subject", ["_id", "SubjectName"])
    return response({ List: timetables, ButtonShow }, false, "Lấy data thành công", 200)
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
    const { TimeTableID, StartTime, EndTime } =
      req.body as UpdateTimeTableDTO
    const timetable = await getOneDocument(TimeTable, "_id", TimeTableID)
    if (!timetable) return response({}, true, "Lịch học không tồn tại", 200)
    const checkDateTime = await TimeTable.findOne({
      StartTime, EndTime
    })
    if (!!checkDateTime && !timetable._id.equals(checkDateTime._id))
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

const TimeTableService = {
  fncCreateTimeTable,
  fncGetTimeTableByUser,
  fncAttendanceTimeTable,
  fncUpdateTimeTable
}

export default TimeTableService
