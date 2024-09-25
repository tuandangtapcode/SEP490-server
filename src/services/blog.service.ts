import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import Blog from "../models/blog"
import { Request } from "express"
import { CreateUpdateBlogDTO } from "../dtos/blog.dto"
import { PaginationDTO } from "../dtos/common.dto"

const fncCreateBlog = async (req: Request) => {
  try {
    const { Title } = req.body as CreateUpdateBlogDTO
    const UserID = req.user.ID
    const blog = await getOneDocument(Blog, "Title", Title)
    if (!!blog) return response({}, true, "Tiêu đề blog đã tồn tại", 200)
    const newCreateBlog = await Blog.create({
      ...req.body,
      Teacher: UserID,
    })
    return response(newCreateBlog, false, "Tạo bài viết thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailBlog = async (req: Request) => {
  try {
    const BlogID = req.params.BlogID
    const blog = await getOneDocument(Blog, "_id", BlogID)
    if (!blog) return response({}, true, "Blog không tồn tại", 200)
    return response(blog, false, "Blog tồn tại", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBlog = async (req: Request) => {
  try {
    const { CurrentPage, PageSize } = req.body as PaginationDTO
    const query = { IsDeleted: false }
    const blogs = Blog
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = Blog.countDocuments(query)
    const result = await Promise.all([blogs, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra bài viết thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteBlog = async (req: Request) => {
  try {
    const { BlogID } = req.params
    const deletedBlog = await Blog.findByIdAndUpdate(
      BlogID,
      { IsDeleted: true },
      { new: true }
    )
    if (!deletedBlog) return response({}, true, "Bài viết không tồn tại", 200)
    return response(deletedBlog, false, "Xoá bài viết thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateBlog = async (req: Request) => {
  try {
    const { BlogID, Title } = req.body as CreateUpdateBlogDTO
    const checkExistTitle = await Blog.findOne({
      Title: Title,
      _id: {
        $ne: BlogID
      }
    })
    if (!!checkExistTitle)
      return response({}, true, "Tiêu đề blog đã tồn tại", 200)
    const updateBlog = await Blog.findOneAndUpdate(
      { _id: BlogID },
      { ...req.body },
      { new: true }
    )
    if (!updateBlog) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updateBlog, false, "Cập nhật blog thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBlogOfTeacher = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { CurrentPage, PageSize } = req.body as PaginationDTO
    const query = {
      Teacher: UserID,
      IsDeleted: false,
    }
    const blogs = Blog
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = Blog.countDocuments(query)
    const result = await Promise.all([blogs, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra bài viết thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const BlogService = {
  fncCreateBlog,
  fncGetListBlog,
  fncDeleteBlog,
  fncGetDetailBlog,
  fncUpdateBlog,
  fncGetListBlogOfTeacher
}

export default BlogService
