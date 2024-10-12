import express from "express"
import BlogController from "../controllers/blog.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import upload from '../middlewares/clouddinary.middleware'
import BlogValidation from "../validations/blog.validation"

const BlogRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Blogs:
 *      type: object
 *      required: 
 *        - Title
 *        - Contents
 *      properties:
 *        _id:
 *            type: ObjectId
 *        Author: 
 *            type: ObjectId
 *        Title:
 *            type: String
 *        Contents:
 *            type: String
 *        Followers:
 *            type: Number
 *        IsDeleted: 
 *            type: boolean
 */

/**
 * @swagger
 * /blog/createBlog:
 *   post: 
 *     tags: [Blogs]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                User:
 *                  type: ObjectId
 *                Subject:
 *                  type: ObjectId
 *                Title: 
 *                  type: string
 *                Content:
 *                  type: string
 *                Price:
 *                  type: number
 *                NumberSlot:
 *                  type: number
 *                LearnType:
 *                  type: number
 *                Address:
 *                  type: string
 *                 Schedules: 
 *                  type: array
 *                      items: 
 *                          type: object
 *                          properties:
 *                          DateAt:
 *                              type: string
 *                          StartTime:
 *                              type: Date
 *                          EndTime:
 *                              type: Date
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */
BlogRoute.post("/createBlog",
    authMiddleware([Roles.ROLE_TEACHER]),
    BlogValidation.createUpdateBlog,
    BlogController.createBlog
)

/**
 * @swagger
 * /blog/getListBlog:
 *   post:
 *     tags: [Blogs]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra bài viết thành công
 *       500:
 *         description: Internal server error
 */
BlogRoute.post("/getListBlog",
    BlogValidation.getListBlog,
    BlogController.getListBlog
)

/**
 * @swagger
 * /blog/deleteBlog/{BlogID}:
 *   get:
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: BlogID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Xoá bài viết thành công
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
BlogRoute.get("/deleteBlog/:BlogID",
    BlogValidation.getDetailBlog,
    BlogController.deletedBlog
)

/**
 * @swagger
 * /blog/getDetailBlog/{BlogID}:
 *   get:
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: BlogID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
BlogRoute.get("/getDetailBlog/:BlogID",
    BlogValidation.getDetailBlog,
    BlogController.getDetailBlog
)

/**
 * @swagger
 * /blog/updateBlog:
 *   post: 
 *     tags: [Blogs]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                User:
 *                  type: ObjectId
 *                Subject:
 *                  type: ObjectId
 *                Title: 
 *                  type: string
 *                Content:
 *                  type: string
 *                Price:
 *                  type: number
 *                NumberSlot:
 *                  type: number
 *                LearnType:
 *                  type: number
 *                Address:
 *                  type: string
 *                 Schedules: 
 *                  type: array
 *                      items: 
 *                          type: object
 *                          properties:
 *                          DateAt:
 *                              type: string
 *                          StartTime:
 *                              type: Date
 *                          EndTime:
 *                              type: Date
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */
BlogRoute.post("/updateBlog",
    BlogValidation.createUpdateBlog,
    BlogController.updateBlog
)

/**
 * @swagger
 * /blog/getListBlogOfTeacher:
 *   post:
 *     tags: [Blogs]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra bài viết thành công
 *       500:
 *         description: Internal server error
 */
BlogRoute.post("/getListBlogOfUser",
    BlogValidation.getListBlog,
    BlogController.getListBlogOfUser
)

export default BlogRoute
