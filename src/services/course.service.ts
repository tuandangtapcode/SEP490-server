import Course from "../models/course"
import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import { Request } from "express"
import { PaginationDTO } from "../dtos/common.dto"
import Subject from "../models/subject"

const fncCreateCourse = async (req: Request) => {
    try {
        const newCourse = await Course.create({ ...req.body })
        return response(newCourse, false, "Tạo gói học thành công", 201)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncGetListCourse = async (req: Request) => {
    try {
        const { CurrentPage, PageSize } = req.body as PaginationDTO
        const course = Course
            .find()
            .skip((CurrentPage - 1) * PageSize)
            .limit(PageSize)
        const total = Course.countDocuments()
        const result = await Promise.all([Course, total])
        return response(
            { List: result[0], Total: result[1] },
            false,
            "Lấy ra thành công",
            200
        )
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncUpdateCourse = async (req: Request) => {
    try {
        const { CourseID } = req.body
        const updateCourse = await Course.findByIdAndUpdate(
            CourseID,
            { ...req.body },
            { new: true, runValidators: true }
        )
        if (!updateCourse) return response({}, true, "Có lỗi xảy ra", 200)
        return response(updateCourse, false, "Cập nhật gói học thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncDeleteCourse = async (req: Request) => {
    try {
        const { CourseID } = req.params
        const deletedCourse = await Course.findByIdAndUpdate(
            CourseID,
            { IsActive: true },
            { new: true }
        )
        if (!deletedCourse) return response({}, true, "Có lỗi xảy ra", 200)
        return response(deletedCourse, false, "Xoá gói học thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncGetListCourseTeacherandSubject = async (req: Request) => {
    try {
        const { Teacher, Subject } = req.body
        const list = await Course
            .find({
                Teacher: Teacher,
                Subject: Subject
            })
            .populate("Subject", ["_id", "SubjectName"])
        return response(list, false, "Lấy data thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncGetListCourseByTeacher = async (req: Request) => {
    try {
        const UserID = req.user.ID
        const list = await Course
            .find({
                Teacher: UserID
            })
            .populate("Subject", ["_id", "SubjectName"])
        return response(list, false, "Lấy data thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const CourseService = {
    fncCreateCourse,
    fncGetListCourse,
    fncUpdateCourse,
    fncDeleteCourse,
    fncGetListCourseTeacherandSubject,
    fncGetListCourseByTeacher
}

export default CourseService
