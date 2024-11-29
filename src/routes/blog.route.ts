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
  authMiddleware([Roles.ROLE_STUDENT]),
  BlogController.getListBlogByUser
)
BlogRoute.get("/sendRequestReceive/:BlogID",
  authMiddleware([Roles.ROLE_TEACHER]),
  BlogController.sendRequestReceive
)
BlogRoute.post("/getListBlogByStudent",
  authMiddleware([Roles.ROLE_STUDENT]),
  BlogController.getListBlogByStudent
)

BlogRoute.post("/changeReceiveStatus",
  authMiddleware([Roles.ROLE_STUDENT]),
  BlogController.changeReceiveStatus
)

BlogRoute.post("/changeRegisterStatus",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  BlogController.changeRegisterStatus
)

export default BlogRoute
