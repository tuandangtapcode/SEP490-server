import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import Blog from "../models/blog"
import { Request } from "express"
import { CreateUpdateBlogDTO } from "../dtos/blog.dto"
import { PaginationDTO } from "../dtos/common.dto"
import { cache } from "joi"
import mongoose from "mongoose"

const fncCreateBlog = async (req: Request) => {
  try {
    // const { Title } = req.body as CreateUpdateBlogDTO
    const UserID = req.user.ID
    // const blog = await getOneDocument(Blog, "Title", Title)
    // if (!!blog) return response({}, true, "Tiêu đề blog đã tồn tại", 200)
    const newCreateBlog = await Blog.create({
      ...req.body,
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

const fncGetListBlog = async (req: Request) => {
  try {
    const { CurrentPage, PageSize, title, minPrice, maxPrice, subject } = req.body;

    const query: any = {};

    if (title) {
      query.Title = { $regex: title, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.Price = {};
      if (minPrice) query.Price.$gte = parseFloat(minPrice);
      if (maxPrice) query.Price.$lte = parseFloat(maxPrice);
    }

    if (subject) {
      query.Subject = subject;
    }

    query.IsDeleted = false;
    query.IsActivate = true;

    const blogs = Blog
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("Subject", ["_id", "SubjectName"])
    const total = Blog.countDocuments(query);
    const result = await Promise.all([blogs, total]);

    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra bài viết thành công",
      200
    );
  } catch (error: any) {
    return response({}, true, error.toString(), 500);
  }
};

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
    // const checkExistTitle = await Blog.findOne({
    //   Title: Title,
    //   _id: {
    //     $ne: BlogID
    //   }
    // })
    // if (!!checkExistTitle)
    //   return response({}, true, "Tiêu đề blog đã tồn tại", 200)
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
    const UserID = req.user.ID; // Assuming `req.user` contains authenticated user info
    const { CurrentPage, PageSize, Title, SubjectID } = req.body;

    // Validate UserID
    if (!mongoose.Types.ObjectId.isValid(UserID)) {
      return response({}, true, "Người dùng không tồn tại", 400);
    }

    // Build the query with filters
    const query: any = {
      User: UserID, // Filter blogs by UserID
      IsDeleted: false, // Only include non-deleted blogs
    };

    // Add Title filter (case-insensitive partial match)
    if (Title) {
      query.Title = { $regex: Title, $options: "i" };
    }

    // Add Subject filter
    if (SubjectID) {
      query.Subject = SubjectID;
    }

    // Fetch blogs with pagination and populate necessary fields
    const blogs = Blog.find(query)
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
      .populate("Subject", ["_id", "SubjectName"]); // Populate Subject field with specific fields

    // Count total blogs for the user (for pagination)
    const total = Blog.countDocuments(query);

    // Wait for both promises to resolve
    const result = await Promise.all([blogs, total]);

    // Return response with blog list and total count
    return response(
      { List: result[0], Total: result[1] },
      false,
      "Lấy ra bài viết thành công",
      200
    );
  } catch (error: any) {
    console.error(error);
    return response({}, true, error.toString(), 500);
  }
};


const fncSendRequestReceive = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { BlogID } = req.params
    if (!mongoose.Types.ObjectId.isValid(`${BlogID}`)) {
      return response({}, true, "Blog không tồn tại", 200)
    }
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
    const { BlogID, TeacherID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(BlogID)) {
      return response({}, true, "Blog không tồn tại", 200);
    }
    if (!mongoose.Types.ObjectId.isValid(TeacherID)) {
      return response({}, true, "Giáo viên không tồn tại", 200);
    }

    const blog = await Blog.findById(BlogID);
    if (!blog) {
      return response({}, true, "Không tìm thấy bài viết", 404);
    }

    blog.TeacherReceive.forEach((teacher) => {
      if (teacher.Teacher && teacher.Teacher.toString() === TeacherID) {
        teacher.ReceiveStatus = 3;
      } else {
        teacher.ReceiveStatus = 2;
      }
    });

    blog.IsActivate = false;
    await blog.save();

    return response(
      { BlogID, TeacherID },
      false,
      "Trạng thái nhận bài viết đã được cập nhật thành công",
      200
    );
  } catch (error: any) {
    console.error(error);
    return response({}, true, error.toString(), 500);
  }
};

const fncGetListBlogByStudent = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { CurrentPage, PageSize } = req.body as PaginationDTO
    const query = {
      User: UserID
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
  fncGetListBlogByUser,
  fncSendRequestReceive,
  fncGetListBlogByStudent,
  fncChangeReceiveStatus
}

export default BlogService
