import { Request, Response } from "express"
import CommentSerivce from "../services/comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const response = await CommentSerivce.fncCreateComment(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListCommentOfTeacher = async (req: Request, res: Response) => {
  try {
    const response = await CommentSerivce.fncGetListCommentOfTeacher(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const deletedComment = async (req: Request, res: Response) => {
  try {
    const response = await CommentSerivce.fncDeleteComment(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const CommentController = {
  createComment,
  getListCommentOfTeacher,
  deletedComment
}

export default CommentController
