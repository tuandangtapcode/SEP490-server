import express from "express"
import BlogController from "../controllers/blog.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import BlogValidation from "../validations/blog.validation"
import { parameterValidation } from "../validations/common.validation"

const BlogRoute = express.Router()

BlogRoute.post("/createBlog",
  authMiddleware([Roles.ROLE_TEACHER]),
  BlogValidation.createUpdateBlog,
  BlogController.createBlog
)
BlogRoute.post("/getListBlog",
  BlogController.getListBlog
)
BlogRoute.get("/deleteBlog/:BlogID",
  BlogController.deletedBlog
)
BlogRoute.get("/getDetailBlog/:BlogID",
  BlogController.getDetailBlog
)
BlogRoute.post("/updateBlog",
  BlogValidation.createUpdateBlog,
  BlogController.updateBlog
)
BlogRoute.post("/getListBlogOfUser",
  BlogController.getListBlogOfUser
)

export default BlogRoute
