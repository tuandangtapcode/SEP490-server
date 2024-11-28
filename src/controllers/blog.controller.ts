import { Request, Response } from "express"
import BlogService from "../services/blog.service"

const createBlog = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncCreateBlog(req)
    console.log("Schedules received:", req.body.Schedules);
    return res.status(response.statusCode).json(response)
    
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListBlog = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncGetListBlog(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const deletedBlog = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncDeleteBlog(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getDetailBlog = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncGetDetailBlog(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateBlog = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncUpdateBlog(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListBlogByUser = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncGetListBlogByUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const sendRequestReceive = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncSendRequestReceive(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListBlogByStudent = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncGetListBlogByStudent(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const changeReceiveStatus = async (req: Request, res: Response) => {
  try {
    const response = await BlogService.fncChangeReceiveStatus(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const BlogController = {
  createBlog,
  getListBlog,
  deletedBlog,
  getDetailBlog,
  updateBlog,
  getListBlogByUser,
  sendRequestReceive,
  getListBlogByStudent,
  changeReceiveStatus
}

export default BlogController
