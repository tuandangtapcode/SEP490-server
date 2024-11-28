import { CreateFeedbackDTO, GetListFeedbackOfTeacherDTO } from "../dtos/feedback.dto"
import Feedback from "../models/feedback"
import SubjectSetting from "../models/subjectsetting"
import User from "../models/user"
import response from "../utils/response"
import { Request } from "express"

const fncCreateFeedback = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { Teacher, Rate } = req.body as CreateFeedbackDTO
    const newFeedback = await Feedback.create({ ...req.body, User: UserID })
    await SubjectSetting.findOneAndUpdate(
      { Teacher },
      { $push: { Votes: Rate } }
    )
    return response(newFeedback, false, "Tạo Feedback thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListFeedbackOfTeacher = async (req: Request) => {
  try {
    const { CurrentPage, PageSize, TeacherID } =
      req.body as GetListFeedbackOfTeacherDTO
    let query = {
      Teacher: TeacherID
    }
    const feedbacks = Feedback
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    // .populate("User", ["FullName", "AvatarPath"])
    const total = Feedback.countDocuments(query)
    const result = await Promise.all([feedbacks, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteFeedback = async (req: Request) => {
  try {
    const { FeedbackID } = req.params
    const deleteFeedback = await Feedback.findByIdAndUpdate(
      FeedbackID,
      { IsDeleted: true },
      { new: true }
    )
    if (!deleteFeedback) return response({}, true, "Có lỗi xảy ra", 200)
    return response(deleteFeedback, false, "Xóa Messenger thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListFeedback = async (req:Request) => {
  try {
    
  } catch (error) {
    
  }
}

const FeedbackSerivce = {
  fncCreateFeedback,
  fncDeleteFeedback,
  fncGetListFeedbackOfTeacher
}

export default FeedbackSerivce
