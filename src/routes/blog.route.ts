import express from "express"
import BlogController from "../controllers/blog.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import BlogValidation from "../validations/blog.validation"

const BlogRoute = express.Router()

BlogRoute.post("/createBlog",
  authMiddleware([Roles.ROLE_STUDENT]),
  BlogValidation.createUpdateBlog,
  BlogController.createBlog
)
BlogRoute.post("/getListBlog",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  BlogController.getListBlog
)
BlogRoute.get("/deleteBlog/:BlogID",
  authMiddleware([Roles.ROLE_STUDENT]),
  BlogController.deletedBlog
)
BlogRoute.get("/getDetailBlog/:BlogID",
  BlogController.getDetailBlog
)
BlogRoute.post("/updateBlog",
  authMiddleware([Roles.ROLE_STUDENT]),
  BlogValidation.createUpdateBlog,
  BlogController.updateBlog
)
BlogRoute.post("/getListBlogByUser",
  BlogController.getListBlogByUser
)
BlogRoute.get("/sendRequestReceive/:BlogID",
  authMiddleware([Roles.ROLE_TEACHER]),
  BlogController.sendRequestReceive
)
BlogRoute.post("/getListBlogByStudent",
  authMiddleware([Roles.ROLE_STUDENT]),
  BlogController.sendRequestReceive
)

export default BlogRoute
