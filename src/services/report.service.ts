import response from "../utils/response"
import Report from "../models/report"
import { Request } from "express"
import Blog from "../models/blog"
import {
  CreateReportDTO,
  ReportDTO
} from "../dtos/report.dto"
import { PaginationDTO } from "../dtos/common.dto"

const fncCreateReport = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const newCreateReport = await Report.create({
      ...req.body as CreateReportDTO,
      Sender: UserID
    })
    return response(newCreateReport, false, "Báo cáo đã được gửi", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListReport = async (req: Request) => {
  try {
    const { CurrentPage, PageSize } = req.body as PaginationDTO
    const reports = Report
      .find()
      .populate("Sender", ["_id", "FullName"])
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = Report.countDocuments()
    const result = await Promise.all([reports, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra Report thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListReportTimeTable = async (req: Request) => {
  // try {
  //   const { CurrentPage, PageSize } = req.body as PaginationDTO
  //   const query = { IsDeleted: false }
  //   const reports = Report
  //     .find(query)
  //     .skip((CurrentPage - 1) * PageSize)
  //     .limit(PageSize)
  //     .populate({
  //       path: 'Timetable',
  //       populate: [
  //         { path: 'Teacher', model: 'Users', select: ['_id', 'FullName'] },
  //         { path: 'Sender', model: 'Users', select: ['_id', 'FullName'] }
  //       ]
  //     }) as unknown as ReportDTO[]
  //   const total = Report.countDocuments(query)
  //   const result = await Promise.all([reports, total])
  //   const responseList = []
  //   for (const report of result[0]) {
  //     const reportData = {
  //       ReportID: report._id,
  //       TeacherID: report.Timetable.Teacher._id,
  //       TeacherFullName: report.Timetable.Teacher.FullName,
  //       StudentID: report.Timetable.Sender._id,
  //       StudentFullName: report.Timetable.Sender.FullName,
  //       Title: report.Title,
  //       Content: report.Content,
  //       IsHandle: report.IsHandle,
  //       IsDeleted: report.IsDeleted
  //     }
  //     responseList.push(reportData)
  //   }
  //   return response(
  //     { List: responseList, Total: result[1] },
  //     false,
  //     "Lấy ra Report thành công",
  //     200
  //   )
  // } catch (error: any) {
  //   return response({}, true, error.toString(), 500)
  // }
}

const fncDeleteReport = async (req: Request) => {
  try {
    const ReportID = req.params.ReportID
    const deletedReport = await Blog.findByIdAndUpdate(
      ReportID,
      { IsDeleted: true },
      { new: true }
    )
    if (!deletedReport) return response({}, true, "Report không tồn tại", 200)
    return response(deletedReport, false, "Xoá report thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fcnHandleReport = async (req: Request) => {
  try {
    const ReportID = req.params.ReportID
    const handleReport = await Report.findByIdAndUpdate(
      ReportID,
      { IsHandle: true },
      { new: true }
    )
    if (!handleReport) return response({}, true, "Report không tồn tại", 200)
    return response(handleReport, false, "Report đã được xử lý", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const ReportService = {
  fncCreateReport,
  fncGetListReport,
  fncDeleteReport,
  fncGetListReportTimeTable,
  fcnHandleReport
}

export default ReportService
