import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import Blog from "../models/blog"
import User from "../models/user"
import { Request } from "express"
import {
  ChangeRegisterStatusDTO,
  CreateUpdateBlogDTO,
  GetListBlogApprovalDTO,
  GetListBlogDTO
} from "../dtos/blog.dto"
import sendEmail from "../utils/send-mail"
import mongoose from "mongoose"
import { getRealScheduleForBlog } from "../utils/dateUtils"
import TimeTable from "../models/timetable"
import moment from "moment"
import { Roles } from "../utils/constant"
import Confirm from "../models/confirm"

const fncCreateBlog = async (req: Request) => {
  try {
    const { NumberSlot, Schedules, StartDate } = req.body as CreateUpdateBlogDTO
    const UserID = req.user.ID
    const realSchdules = getRealScheduleForBlog(NumberSlot, Schedules, StartDate)
    let checkExistSchedules = [] as any[]
    const blogs = await Blog
      .find({
        User: UserID,
        IsDeleted: false
      })
      .select("_id RealSchedules")
      .lean()
    blogs.forEach((i: any) => {
      i.RealSchedules.forEach((r: any) => {
        const check = realSchdules.find((re: any) =>
          new Date(r.StartTime) >= new Date(re.StartTime) &&
          new Date(r.StartTime) <= new Date(re.EndTime)
        )
        if (!!check) checkExistSchedules.push(check)
      })
    })
    if (!!checkExistSchedules.length)
      return response(checkExistSchedules, true, "Lịch học của bạn đã trùng với bài đăng khác", 200)
    const timetables = await TimeTable
      .find({
        Student: UserID,
        StartTime: { $gte: new Date() },
        IsCancel: false,
        Status: false
      })
      .select("StartTime EndTime")
      .lean()
    timetables.forEach((i: any) => {
      const check = realSchdules.find((re: any) =>
        new Date(i.StartTime) >= new Date(re.StartTime) &&
        new Date(i.StartTime) <= new Date(re.EndTime)
      )
      if (!!check) checkExistSchedules.push(check)
    })
    if (!!checkExistSchedules.length)
      return response(checkExistSchedules, true, "Lịch học của bạn đã trùng với lịch học trong thời khóa biểu", 200)
    const confirms = await Confirm
      .find({
        ConfirmStatus: { $ne: 3 },
        Sender: UserID
      })
      .select("Schedules")
      .lean()
    confirms.forEach((i: any) => {
      i.Schedules.forEach((r: any) => {
        const check = realSchdules.find((re: any) =>
          new Date(r.StartTime) >= new Date(re.StartTime) &&
          new Date(r.StartTime) <= new Date(re.EndTime)
        )
        if (!!check) checkExistSchedules.push(check)
      })
    })
    if (!!checkExistSchedules.length)
      return response(checkExistSchedules, true, "Lịch học của bạn đã trùng với 1 booking", 200)
    const newCreateBlog = await Blog.create({
      ...req.body,
      RegisterStatus: 2,
      User: UserID,
      RealSchedules: getRealScheduleForBlog(NumberSlot, Schedules, StartDate)
    })
    return response(newCreateBlog, false, "Tạo bài viết thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailBlog = async (req: Request) => {
  try {
    const BlogID = req.params.BlogID
    const blog = await Blog.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${BlogID}`)
        }
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
        $unwind: {
          path: "$TeacherReceive",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "TeacherReceive.Teacher",
          foreignField: "_id",
          as: "TeacherReceive.Teacher",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "_id",
                foreignField: "UserID",
                as: "Account",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      Email: 1,
                    }
                  }
                ]
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
      {
        $unwind: {
          path: "$TeacherReceive.Teacher",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          User: { $first: "$User" },
          Subject: { $first: "$Subject" },
          Gender: { $first: "$Gender" },
          Title: { $first: "$Title" },
          Price: { $first: "$Price" },
          NumberSlot: { $first: "$NumberSlot" },
          LearnType: { $first: "$LearnType" },
          Address: { $first: "$Address" },
          ProfessionalLevel: { $first: "$ProfessionalLevel" },
          Schedules: { $first: "$Schedules" },
          RealSchedules: { $first: "$RealSchedules" },
          StartDate: { $first: "$StartDate" },
          TeacherReceive: { $push: "$TeacherReceive" },
          IsDeleted: { $first: "$IsDeleted" },
          RegisterStatus: { $first: "$RegisterStatus" },
          IsPaid: { $first: "$IsPaid" },
        }
      },
      {
        $addFields: {
          TeacherReceive: {
            $filter: {
              input: "$TeacherReceive",
              as: "item",
              cond: { $ne: ["$$item", {}] }
            }
          }
        }
      },
    ])
    const teacher = blog[0].TeacherReceive.find((i: any) => i.ReceiveStatus === 3)
    if (!teacher) return response({}, true, "Booking chưa được phép thanh toán", 200)
    const data = {
      TotalFee: blog[0].Price * blog[0].NumberSlot,
      Receiver: teacher.Teacher,
      Subject: blog[0].Subject,
      Schedules: blog[0].RealSchedules,
      IsPaid: blog[0].IsPaid,
      LearnType: blog[0].LearnType[0],
    }
    return response(data, false, "Blog tồn tại", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBlogByTeacher = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID } = req.body as GetListBlogDTO
    let query = {
      RegisterStatus: 3,
      IsDeleted: false
    } as any
    if (!!SubjectID) {
      query.Subject = new mongoose.Types.ObjectId(`${SubjectID}`)
    }
    if (!!TextSearch) {
      query.Title = { $regex: TextSearch, $options: "i" }
    }
    const blogs = Blog
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("Subject", ["_id", "SubjectName"])
      .populate("User", ["_id", "FullName"])
      .select("_id User Subject Gender Title Price NumberSlot LearnType Address ProfessionalLevel Schedules StartDate ExpensePrice")
      .lean()
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

const fncGetListBlog = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectID, RegisterStatus, LearnType } = req.body as GetListBlogDTO
    let query = {} as any
    if (!!SubjectID) {
      query.Subject = new mongoose.Types.ObjectId(`${SubjectID}`)
    }
    if (!!RegisterStatus) {
      query.RegisterStatus = RegisterStatus
    }
    if (!!LearnType.length) {
      query.LearnType = LearnType
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
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      Email: 1,
                      IsActive: 1
                    }
                  }
                ]
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
        $unwind: {
          path: "$TeacherReceive",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "TeacherReceive.Teacher",
          foreignField: "_id",
          as: "TeacherReceive.Teacher",
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
      {
        $unwind: {
          path: "$TeacherReceive.Teacher",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          User: { $first: "$User" },
          Subject: { $first: "$Subject" },
          Gender: { $first: "$Gender" },
          Title: { $first: "$Title" },
          Price: { $first: "$Price" },
          NumberSlot: { $first: "$NumberSlot" },
          LearnType: { $first: "$LearnType" },
          Address: { $first: "$Address" },
          ProfessionalLevel: { $first: "$ProfessionalLevel" },
          Schedules: { $first: "$Schedules" },
          StartDate: { $first: "$StartDate" },
          TeacherReceive: { $push: "$TeacherReceive" },
          IsDeleted: { $first: "$IsDeleted" },
          RegisterStatus: { $first: "$RegisterStatus" },
        }
      },
      {
        $addFields: {
          TeacherReceive: {
            $filter: {
              input: "$TeacherReceive",
              as: "item",
              cond: { $ne: ["$$item", {}] }
            }
          }
        }
      },
      {
        $sort: { updatedAt: -1 }
      },
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
      IsConfirm: i.RegisterStatus === 2 ? false : true,
      IsReject: i.RegisterStatus === 2 ? false : true
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
    const { BlogID, IsDeleted } = req.body
    const deletedBlog = await Blog.findOneAndUpdate(
      {
        _id: BlogID,
        User: UserID
      },
      { IsDeleted: IsDeleted },
      { new: true }
    )
    if (!deletedBlog) return response({}, true, "Bài viết không tồn tại", 200)
    return response(
      {},
      false,
      !!IsDeleted
        ? "Ẩn bài viết thành công"
        : "Hiện bài viết thành công",
      200
    )
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
    const UserID = req.user.ID
    const { TextSearch, CurrentPage, PageSize, SubjectID, RegisterStatus, LearnType } = req.body as GetListBlogDTO
    let query = {
      User: new mongoose.Types.ObjectId(`${UserID}`)
    } as any
    if (!!SubjectID) {
      query.Subject = new mongoose.Types.ObjectId(`${SubjectID}`)
    }
    if (!!RegisterStatus) {
      query.RegisterStatus = RegisterStatus
    }
    if (!!TextSearch) {
      query.Title = { $regex: TextSearch, $options: "i" }
    }
    const blogs = Blog.find(query)
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("Subject", ["_id", "SubjectName"])
      .populate("TeacherReceive.Teacher", ["_id", "FullName"])
      .select("_id User Subject Gender Title Price NumberSlot LearnType Address ProfessionalLevel Schedules StartDate TeacherReceive RegisterStatus RealSchedules IsDeleted createdAt")
      .lean()
    const total = Blog.countDocuments(query)
    const result = await Promise.all([blogs, total])
    const data = result[0].map((i: any) => ({
      ...i,
      TeacherReceive: i.TeacherReceive.map((t: any) => ({
        ...t,
        IsConfirm: t.ReceiveStatus === 1 ? false : true,
        IsReject: t.ReceiveStatus === 1 ? false : true,
      })),
      IsPayment: !i.IsPaid
        ? !!i.TeacherReceive.some((t: any) => t.ReceiveStatus === 3)
        : false,
      IsDisabled: new Date() > new Date(i.StartDate) || !!i.TeacherReceive.some((t: any) => t.ReceiveStatus === 3)
        ? false
        : true

    }))
    return response(
      { List: data, Total: result[1] },
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
    let checkExistSchedules = [] as any[]
    const blog = await getOneDocument(Blog, "_id", BlogID)
    if (!blog) return response({}, true, "Blog không tồn tại", 200)
    const teacher = blog.TeacherReceive.find((i: any) => i.Teacher.equals(UserID))
    if (!!teacher) return response({}, true, "Bạn đã đăng ký lớp học này", 200)
    const realSchdules = getRealScheduleForBlog(blog.NumberSlot, blog.Schedules, blog.StartDate)
    const timetables = await TimeTable
      .find({
        Student: UserID,
        StartTime: { $gte: new Date() },
        IsCancel: false,
        Status: false
      })
      .select("StartTime EndTime")
      .lean()
    timetables.forEach((i: any) => {
      const check = realSchdules.find((re: any) =>
        new Date(i.StartTime) >= new Date(re.StartTime) &&
        new Date(i.StartTime) <= new Date(re.EndTime)
      )
      if (!!check) checkExistSchedules.push(check)
    })
    if (!!checkExistSchedules.length)
      return response(checkExistSchedules, true, "Lịch dạy của bạn đã trùng với lịch học của học sinh đăng bài", 200)
    const blogs = await Blog
      .find({
        "TeacherReceive.Teacher": UserID,
        "TeacherReceive.ReceiveStatus": {
          $ne: 2
        }
      })
      .select("_id RealSchedules")
      .lean()
    blogs.forEach((i: any) => {
      i.RealSchedules.forEach((r: any) => {
        const check = realSchdules.find((re: any) =>
          new Date(r.StartTime) >= new Date(re.StartTime) &&
          new Date(r.StartTime) <= new Date(re.EndTime)
        )
        if (!!check) checkExistSchedules.push(check)
      })
    })
    if (!!checkExistSchedules.length)
      return response(checkExistSchedules, true, "Bạn bị trùng lịch dạy với 1 bài đăng đã nhận lớp", 200)
    const confirms = await Confirm
      .find({
        ConfirmStatus: { $ne: 3 },
        Receiver: UserID
      })
      .select("Schedules")
      .lean()
    confirms.forEach((i: any) => {
      i.Schedules.forEach((r: any) => {
        const check = realSchdules.find((re: any) =>
          new Date(r.StartTime) >= new Date(re.StartTime) &&
          new Date(r.StartTime) <= new Date(re.EndTime)
        )
        if (!!check) checkExistSchedules.push(check)
      })
    })
    if (!!checkExistSchedules.length)
      return response(checkExistSchedules, true, "Bạn đã bị trùng lịch dạy với 1 yêu cầu booking", 200)
    await Blog.updateOne(
      { _id: BlogID },
      {
        $push: {
          TeacherReceive: { Teacher: UserID }
        }
      }
    )
    return response({}, false, "Gửi yêu cầu thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeReceiveStatus = async (req: Request) => {
  try {
    const { RoleID } = req.user
    const { BlogID, TeacherID, ReceiveStatus } = req.body
    let newTeacherReceive = [] as any[]
    const blog = await getOneDocument(Blog, "_id", BlogID) as any
    if (!blog) return response({}, true, "Không tìm thấy bài viết", 200)
    if (ReceiveStatus === 3) {
      newTeacherReceive = blog.TeacherReceive.map((i: any) => {
        if (i.Teacher.equals(TeacherID)) {
          return {
            ...i,
            ReceiveStatus: 3
          }
        } else {
          return {
            ...i,
            ReceiveStatus: 2
          }
        }
      })
      blog.IsDeleted = true
    } else {
      newTeacherReceive = blog.TeacherReceive.map((i: any) => {
        if (i.Teacher.equals(TeacherID)) {
          return {
            ...i,
            ReceiveStatus: 2
          }
        } else {
          return i
        }
      })
    }
    let data = {} as any
    if (RoleID === Roles.ROLE_TEACHER) {
      const newBlog = await Blog
        .findOneAndUpdate(
          { _id: BlogID },
          {
            ...blog,
            TeacherReceive: newTeacherReceive
          },
          { new: true }
        )
        .populate("Subject", ["_id", "SubjectName"])
        .populate("TeacherReceive.Teacher", ["_id", "FullName"])
        .select("_id User Subject Gender Title Price NumberSlot LearnType Address ProfessionalLevel Schedules StartDate TeacherReceive RegisterStatus RealSchedules")
        .lean() as any
      data = {
        ...newBlog,
        TeacherReceive: newBlog.TeacherReceive.map((t: any) => ({
          ...t,
          IsConfirm: t.ReceiveStatus === 1 ? false : true,
          IsReject: t.ReceiveStatus === 1 ? false : true,
        }))
      }
    } else {
      const newBlog = await Blog
        .findOneAndUpdate(
          { _id: BlogID },
          {
            ...blog,
            TeacherReceive: newTeacherReceive
          },
          { new: true }
        )
        .populate("Subject", ["_id", "SubjectName"])
        .populate("TeacherReceive.Teacher", ["_id", "FullName"])
        .populate("User", ["_id", "FullName"])
        .select("_id User Subject Gender Title Price NumberSlot LearnType Address ProfessionalLevel Schedules StartDate TeacherReceive RegisterStatus")
        .lean() as any
      data = {
        _id: newBlog._id,
        User: newBlog.User,
        Subject: newBlog.Subject,
        Gender: newBlog.Gender,
        Title: newBlog.Title,
        Price: newBlog.Price,
        NumberSlot: newBlog.NumberSlot,
        LearnType: newBlog.LearnType,
        Address: newBlog.Address,
        ProfessionalLevel: newBlog.ProfessionalLevel,
        Schedules: newBlog.Schedules,
        StartDate: newBlog.StartDate,
        RegisterStatus: newBlog.RegisterStatus,
        TeacherReceive: newBlog.TeacherReceive.map((t: any) => ({
          ...t,
          IsConfirm: t.ReceiveStatus === 1 ? false : true,
          IsReject: t.ReceiveStatus === 1 ? false : true,
        })),
      }
    }
    return response(data, false, "Trạng thái đăng ký của bài đăng đã được cập nhật", 200)
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
    const { SubjectID, ReceiveStatus, CurrentPage, PageSize, ReceiveDate } = req.body as GetListBlogApprovalDTO
    let query = {
      "TeacherReceive.Teacher": UserID
    } as any
    if (!!SubjectID) {
      query.Subject = SubjectID
    }
    if (!!ReceiveStatus) {
      query["TeacherReceive.ReceiveStatus"] = ReceiveStatus
    }
    if (!!ReceiveDate) {
      query["TeacherReceive.ReceiveDate"] = ReceiveDate
    }
    const blogs = Blog
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("User", ["_id", "FullName"])
      .populate("Subject", ["_id", "SubjectName"])
      .select("_id User Subject Gender Title Price NumberSlot LearnType Address ProfessionalLevel Schedules StartDate TeacherReceive")
    const total = Blog.countDocuments(query)
    const result = await Promise.all([blogs, total])
    const data = result[0].map((i: any) => ({
      _id: i._id,
      User: i.User,
      Subject: i.Subject,
      Gender: i.Gender,
      Title: i.Title,
      Price: i.Price,
      NumberSlot: i.NumberSlot,
      LearnType: i.LearnType,
      Address: i.Address,
      ProfessionalLevel: i.ProfessionalLevel,
      Schedules: i.Schedules,
      StartDate: i.StartDate,
      ReceiveStatus: i.TeacherReceive.find((t: any) => t.Teacher.equals(UserID)).ReceiveStatus,
      ReceiveDate: i.TeacherReceive.find((t: any) => t.Teacher.equals(UserID)).ReceiveDate,
      IsCancel: i.TeacherReceive.find((t: any) => t.Teacher.equals(UserID)).ReceiveStatus === 1 ? false : true
    }))
    return response(
      { List: data.reverse(), Total: result[1] },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeBlogPaid = async (req: Request) => {
  try {
    const { BlogID } = req.params
    const updateBlog = await Blog
      .findOneAndUpdate(
        { _id: BlogID },
        { IsPaid: true },
        { new: true }
      )
      .lean() as any
    if (!updateBlog) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updateBlog, false, "Thanh toán thành công", 200)
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
  fncGetListBlogApproval,
  fncChangeBlogPaid
}

export default BlogService
