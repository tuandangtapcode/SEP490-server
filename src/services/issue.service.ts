import response from "../utils/response"
import Issue from "../models/issue"
import { Request } from "express"
import Blog from "../models/blog"
import {
  CreateIssueDTO,
  IssueDTO
} from "../dtos/issue.dto"
import { PaginationDTO } from "../dtos/common.dto"

const fncCreateIssue = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const newCreateIssue = await Issue.create({
      ...req.body as CreateIssueDTO,
      Sender: UserID
    })
    return response(newCreateIssue, false, "Báo cáo đã được gửi", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListIssue = async (req: Request) => {
  try {
    const { CurrentPage, PageSize } = req.body as PaginationDTO
    const Issues = Issue
      .find()
      .populate("Sender", ["_id", "FullName"])
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = Issue.countDocuments()
    const result = await Promise.all([Issues, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra Issue thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListIssueTimeTable = async (req: Request) => {
  // try {
  //   const { CurrentPage, PageSize } = req.body as PaginationDTO
  //   const query = { IsDeleted: false }
  //   const Issues = Issue
  //     .find(query)
  //     .skip((CurrentPage - 1) * PageSize)
  //     .limit(PageSize)
  //     .populate({
  //       path: 'Timetable',
  //       populate: [
  //         { path: 'Teacher', model: 'Users', select: ['_id', 'FullName'] },
  //         { path: 'Sender', model: 'Users', select: ['_id', 'FullName'] }
  //       ]
  //     }) as unknown as IssueDTO[]
  //   const total = Issue.countDocuments(query)
  //   const result = await Promise.all([Issues, total])
  //   const responseList = []
  //   for (const Issue of result[0]) {
  //     const IssueData = {
  //       IssueID: Issue._id,
  //       TeacherID: Issue.Timetable.Teacher._id,
  //       TeacherFullName: Issue.Timetable.Teacher.FullName,
  //       StudentID: Issue.Timetable.Sender._id,
  //       StudentFullName: Issue.Timetable.Sender.FullName,
  //       Title: Issue.Title,
  //       Content: Issue.Content,
  //       IsHandle: Issue.IsHandle,
  //       IsDeleted: Issue.IsDeleted
  //     }
  //     responseList.push(IssueData)
  //   }
  //   return response(
  //     { List: responseList, Total: result[1] },
  //     false,
  //     "Lấy ra Issue thành công",
  //     200
  //   )
  // } catch (error: any) {
  //   return response({}, true, error.toString(), 500)
  // }
}

const fncDeleteIssue = async (req: Request) => {
  try {
    const IssueID = req.params.IssueID
    const deletedIssue = await Blog.findByIdAndUpdate(
      IssueID,
      { IsDeleted: true },
      { new: true }
    )
    if (!deletedIssue) return response({}, true, "Issue không tồn tại", 200)
    return response(deletedIssue, false, "Xoá Issue thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fcnHandleIssue = async (req: Request) => {
  try {
    const IssueID = req.params.IssueID
    const handleIssue = await Issue.findByIdAndUpdate(
      IssueID,
      { IsHandle: true },
      { new: true }
    )
    if (!handleIssue) return response({}, true, "Issue không tồn tại", 200)
    return response(handleIssue, false, "Issue đã được xử lý", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const IssueService = {
  fncCreateIssue,
  fncGetListIssue,
  fncDeleteIssue,
  fncGetListIssueTimeTable,
  fcnHandleIssue
}

export default IssueService
