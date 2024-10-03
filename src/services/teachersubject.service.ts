import TeacherSubject from "../models/teachersubject"
import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import { Request } from "express"
import { PaginationDTO  } from "../dtos/common.dto"

const fncCreateTeacherSubject = async (req: Request) => {
    try {
        const newTeacherSubject = await TeacherSubject.create({ ...req.body })
        return response(newTeacherSubject, false, "Tạo gói học thành công", 201)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncGetListTeacherSubject = async (req: Request) => {
    try {
        const { CurrentPage, PageSize } = req.body as PaginationDTO
        const teacherSubject = TeacherSubject
            .find()
            .skip((CurrentPage - 1) * PageSize)
            .limit(PageSize)
        const total = TeacherSubject.countDocuments()
        const result = await Promise.all([teacherSubject, total])
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

const fncUpdateTeacherSubject = async (req: Request) => {
    try {
        const { TeacherSubjectID } = req.body 
        const updateTeacherSubject = await TeacherSubject.findByIdAndUpdate(
            TeacherSubjectID,
            { ...req.body },
            { new: true, runValidators: true }
        )
        if (!updateTeacherSubject) return response({}, true, "Có lỗi xảy ra", 200)
            return response(updateTeacherSubject, false, "Cập nhật gói học thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncDeleteTeacherSubject = async (req: Request) => {
    try {
        const { TeacherSubjectID } = req.params
        const deletedTeacherSubject= await TeacherSubject.findByIdAndUpdate(
            TeacherSubjectID,
          { IsDeleted: true },
          { new: true }
        )
        if (!deletedTeacherSubject) return response({}, true, "Có lỗi xảy ra", 200)
        return response(deletedTeacherSubject, false, "Xoá gói học thành công", 200)
      } catch (error: any) {
        return response({}, true, error.toString(), 500)
      }
}

const fncGetListTeacherSubjectTeacherandSubject = async (req: Request) => {
    try {
        
    } catch (error : any) {
        return response({}, true, error.toString(), 500)
    }
}

const TeacherSubjectService = {
    fncCreateTeacherSubject,
    fncGetListTeacherSubject,
    fncUpdateTeacherSubject,
    fncDeleteTeacherSubject,
    fncGetListTeacherSubjectTeacherandSubject
}

export default TeacherSubjectService
