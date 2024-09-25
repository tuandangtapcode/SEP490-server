import { CreateCommentDTO, GetListCommentOfTeacherDTO } from "../dtos/comment.dto"
import Comment from "../models/comment"
import User from "../models/user"
import response from "../utils/response"
import { Request } from "express"

const fncCreateComment = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { Teacher, Rate } = req.body as CreateCommentDTO
    const newComment = await Comment.create({ ...req.body, User: UserID })
    await User.findByIdAndUpdate(
      Teacher,
      { $push: { Votes: Rate } }
    )
    return response(newComment, false, "Tạo comment thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListCommentOfTeacher = async (req: Request) => {
  try {
    const { CurrentPage, PageSize, TeacherID } =
      req.body as GetListCommentOfTeacherDTO
    let query = {
      Teacher: TeacherID
    }
    const comments = Comment
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("User", ["FullName", "AvatarPath"])
    const total = Comment.countDocuments(query)
    const result = await Promise.all([comments, total])
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

const fncDeleteComment = async (req: Request) => {
  try {
    const { CommentID } = req.params
    const deleteComment = await Comment.findByIdAndUpdate(
      CommentID,
      { IsDeleted: true },
      { new: true }
    )
    if (!deleteComment) return response({}, true, "Có lỗi xảy ra", 200)
    return response(deleteComment, false, "Xóa Messenger thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const CommentSerivce = {
  fncCreateComment,
  fncDeleteComment,
  fncGetListCommentOfTeacher
}

export default CommentSerivce
