import { CommonDTO } from "../dtos/common.dto"
import { CreateFeedbackDTO, GetListFeedbackOfTeacherDTO } from "../dtos/feedback.dto"
import Feedback from "../models/feedback"
import SubjectSetting from "../models/subjectsetting"
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
      Teacher: TeacherID,
      IsDeleted: false
    }
    const feedbacks = Feedback
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .sort({ createdAt: -1 })
      .populate("User", ["FullName", "AvatarPath"])
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

const fncGetListFeedback = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize } = req.body as CommonDTO
    const feedbacks = Feedback.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "_id",
          as: "User",
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
      { $unwind: "$User" },
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
        $match: {
          $or: [
            { "User.FullName": { $regex: TextSearch, $options: "i" } },
            { "Teacher.FullName": { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = Feedback.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "_id",
          as: "User",
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
      { $unwind: "$User" },
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
        $match: {
          $or: [
            { "User.FullName": { $regex: TextSearch, $options: "i" } },
            { "Teacher.FullName": { $regex: TextSearch, $options: "i" } }
          ]
        }
      },
      {
        $group: {
          _id: "$_id"
        }
      },
      {
        $count: "total"
      }
    ])
    const result = await Promise.all([feedbacks, total])
    return response(
      {
        List: result[0],
        Total: !!result[1].length ? result[1][0].total : 0,
      },
      false,
      "Lay dat thanh cong",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const FeedbackSerivce = {
  fncCreateFeedback,
  fncDeleteFeedback,
  fncGetListFeedbackOfTeacher,
  fncGetListFeedback
}

export default FeedbackSerivce
