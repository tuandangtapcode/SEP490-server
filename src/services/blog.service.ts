import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import Blog from "../models/blog"
import User from "../models/user"
import { Request } from "express"
import {
  ChangeRegisterStatusDTO,
  CreateUpdateBlogDTO,
  GetListBlogDTO
} from "../dtos/blog.dto"
import sendEmail from "../utils/send-mail"
import mongoose, { ObjectId } from "mongoose"

const fncCreateBlog = async (req: Request) => {
  try {
    // const { Title } = req.body as CreateUpdateBlogDTO
    const UserID = req.user.ID
    // const blog = await getOneDocument(Blog, "Title", Title)
    // if (!!blog) return response({}, true, "Tiêu đề blog đã tồn tại", 200)
    const newCreateBlog = await Blog.create({
      ...req.body,
      RegisterStatus: 2,
      User: UserID,
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

const fncGetListBlogByTeacher = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, LearnType, RoleID, UserID } = req.body as GetListBlogDTO
    let query = {} as any
    if (!!SubjectID) {
      query = {
        ...query,
        Subject: new mongoose.Types.ObjectId(`${SubjectID}`)
      }
    }
    if (!!LearnType) {
      query = {
        ...query,
        LearnType: LearnType
      }
    }
    if (!!TextSearch) {
      query = {
        ...query,
        Title: { $regex: TextSearch, $options: "i" }
      }
    }
    const blogs = Blog
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("Subject", ["_id", "SubjectName"])
      .populate("User", ["_id", "FullName"])
      .populate("TeacherReceive.Teacher", ["_id", "FullName"])
      .lean()
    const total = Blog.countDocuments(query)
    const result = await Promise.all([blogs, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsRegister: !!RoleID
        ? !!i.TeacherReceive.some((t: any) => t.Teacher._id.equals(UserID))
          ? false
          : true
        : false
    }))
    return response(
      { List: data, Total: result[1] },
      false,
      "Lấy ra bài viết thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBlog = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, RegisterStatus, LearnType } = req.body as GetListBlogDTO
    let query = {
    } as any
    if (!!SubjectID) {
      query = {
        ...query,
        Subject: new mongoose.Types.ObjectId(`${SubjectID}`)
      }
    }
    if (!!RegisterStatus) {
      query = {
        ...query,
        RegisterStatus: RegisterStatus
      }
    }
    if (!!LearnType.length) {
      query = {
        ...query,
        LearnType: LearnType
      }
    }
    const blogs = Blog.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "_id",
          as: "User",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "_id",
                foreignField: "UserID",
                as: "Account",
              }
            },
            { $unwind: '$Account' },
            {
              $addFields: {
                Email: "$Account.Email",
              }
            },
            {
              $project: {
                _id: 1,
                FullName: 1,
                Email: 1
              }
            }
          ]
        }
      },
      { $unwind: "$User" },
      {
        $match: {
          "User.FullName": { $regex: TextSearch, $options: "i" }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "Subject",
          pipeline: [
            {
              $project: {
                _id: 1,
                SubjectName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Subject" },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = Blog.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "_id",
          as: "User",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "_id",
                foreignField: "UserID",
                as: "Account",
              }
            },
            { $unwind: '$Account' },
            {
              $addFields: {
                Email: "$Account.Email",
              }
            },
            {
              $project: {
                _id: 1,
                FullName: 1,
                Email: 1
              }
            }
          ]
        }
      },
      { $unwind: "$User" },
      {
        $match: {
          "User.FullName": { $regex: TextSearch, $options: "i" }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "Subject",
          pipeline: [
            {
              $project: {
                _id: 1,
                SubjectName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Subject" },
      {
        $group: {
          _id: "$_id"
        }
      },
      {
        $count: "total"
      }
    ])
    const result = await Promise.all([blogs, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsConfirm: i.RegisterStatus === 1 ? false : true,
      IsReject: i.RegisterStatus === 1 ? false : true
    }))
    return response(
      {
        List: data,
        Total: !!result[1].length ? result[1][0].total : 0
      },
      false,
      "Lấy ra tất cả các bài viết thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteBlog = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { BlogID } = req.params
    const deletedBlog = await Blog.findOneAndUpdate(
      {
        _id: BlogID,
        User: UserID
      },
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

const fncGetListBlogByUser = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, RegisterStatus, LearnType } = req.body as GetListBlogDTO
    let query = {} as any
    if (!!SubjectID) {
      query = {
        ...query,
        Subject: new mongoose.Types.ObjectId(`${SubjectID}`)
      }
    }
    if (!!RegisterStatus) {
      query = {
        ...query,
        RegisterStatus: RegisterStatus
      }
    }
    if (!!TextSearch) {
      query = {
        ...query,
        Title: { $regex: TextSearch, $options: "i" }
      }
    }
    const blogs = Blog.find(query)
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("Subject", ["_id", "SubjectName"])
      .populate("TeacherReceive.Teacher", ["_id", "FullName"])
    const total = Blog.countDocuments(query)
    const result = await Promise.all([blogs, total])
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra bài viết thành công",
      200
    )
  } catch (error: any) {
    console.error(error)
    return response({}, true, error.toString(), 500)
  }
}

const fncSendRequestReceive = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { BlogID } = req.params
    const updateBlog = await Blog.findOneAndUpdate(
      { _id: BlogID },
      {
        $push: {
          TeacherReceive: { Teacher: UserID }
        }
      },
      { new: true }
    )
    if (!updateBlog) return response({}, true, "Blog không tồn tại", 200)
    return response(updateBlog, false, "Gửi yêu cầu thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeReceiveStatus = async (req: Request) => {
  try {
    const { BlogID, TeacherID } = req.body
    const blog = await Blog.findById(BlogID)
    if (!blog) return response({}, true, "Không tìm thấy bài viết", 200)
    blog.TeacherReceive.forEach((teacher) => {
      if (teacher.Teacher && teacher.Teacher.toString() === TeacherID) {
        teacher.ReceiveStatus = 3
      } else {
        teacher.ReceiveStatus = 2
      }
    })
    await blog.save()
    return response(
      {},
      false,
      "Trạng thái nhận bài viết đã được cập nhật thành công",
      200
    )
  } catch (error: any) {
    console.error(error)
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeRegisterStatus = async (req: Request) => {
  try {
    const { BlogID, FullName, Email, Reason, RegisterStatus } = req.body as ChangeRegisterStatusDTO
    const confirmContent = "Bài đăng tìm kiếm của bạn đã được duyệt. Từ giờ giáo viên có thể nhìn thấy bài đăng của bạn và có thể thực hiện nhận việc."
    const rejectContent = `Bài đăng của bạn không được duyệt với lý do: ${Reason}. Bạn có thể phản hồi để làm rõ.`
    const subject = "THÔNG BÁO KIỂM DUYỆT BÀI ĐĂNG TÌM KIẾM GIÁO VIÊN"
    const content = `
                <html>
                <head>
                <style>
                    p {
                        color: #333
                    }
                </style>
                </head>
                <body>
                  <p style="margin-top: 30px margin-bottom:30px text-align:center font-weigth: 700 font-size: 20px">THÔNG BÁO KIỂM DUYỆT BÀI ĐĂNG TÌM KIẾM GIÁO VIÊN</p>
                  <p style="margin-bottom:10px">Xin chào ${FullName},</p>
                  <p style="margin-bottom:10px">Talent LearningHub thông báo: ${RegisterStatus === 3 ? confirmContent : rejectContent}</p>
                </body>
                </html>
                `
    const checkSendMail = await sendEmail(Email, subject, content)
    if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
    const updateBlog = await Blog.findOneAndUpdate(
      { _id: BlogID },
      { RegisterStatus: RegisterStatus },
      { new: true }
    )
    if (!updateBlog) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Duyệt blog cho giáo viên thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBlogApproval = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const blogs = await Blog
      .find(
        { "TeacherReceive.Teacher": UserID },
        { TeacherReceive: 0 }
      )
    return response(blogs, false, "Lấy data thành công", 200)
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
  fncGetListBlogByUser,
  fncSendRequestReceive,
  fncGetListBlogByTeacher,
  fncChangeReceiveStatus,
  fncChangeRegisterStatus,
  fncGetListBlogApproval
}

export default BlogService
