import SubjectSetting from "../models/subjectsetting"
import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import { Request } from "express"
import { PaginationDTO } from "../dtos/common.dto"
import Subject from "../models/subject"

const fncCreateSubjectSetting = async (req: Request) => {
    try {
        const newSubjectSetting = await SubjectSetting.create({ ...req.body })
        return response(newSubjectSetting, false, "Tạo gói học thành công", 201)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncGetListSubjectSetting = async (req: Request) => {
    try {
        const { CurrentPage, PageSize } = req.body as PaginationDTO
        const subjectSetting = SubjectSetting
            .find()
            .skip((CurrentPage - 1) * PageSize)
            .limit(PageSize)
        const total = SubjectSetting.countDocuments()
        const result = await Promise.all([subjectSetting, total])
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

const fncUpdateSubjectSetting = async (req: Request) => {
    try {
        const { SubjectSettingID } = req.body
        const updateSubjectSetting = await SubjectSetting.findByIdAndUpdate(
            SubjectSettingID,
            { ...req.body },
            { new: true, runValidators: true }
        )
        if (!updateSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
        return response(updateSubjectSetting, false, "Cập nhật gói học thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncDeleteSubjectSetting = async (req: Request) => {
    try {
        const { SubjectSettingID } = req.params
        const deletedSubjectSetting = await SubjectSetting.findByIdAndUpdate(
            SubjectSettingID,
            { IsActive: true },
            { new: true }
        )
        if (!deletedSubjectSetting) return response({}, true, "Có lỗi xảy ra", 200)
        return response(deletedSubjectSetting, false, "Xoá gói học thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const fncGetListTeacherSubjectTeacherandSubject = async (req: Request) => {
    try {
        const { Teacher, Subject } = req.body
        const list = await SubjectSetting
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

const fncGetListSubjectSettingByTeacher = async (req: Request) => {
    try {
        const UserID = req.user.ID
        const list = await SubjectSetting
            .find({
                Teacher: UserID
            })
            .populate("Subject", ["_id", "SubjectName"])
        return response(list, false, "Lấy data thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const SubjectSettingService = {
    fncCreateSubjectSetting,
    fncGetListSubjectSetting,
    fncUpdateSubjectSetting,
    fncDeleteSubjectSetting,
    fncGetListTeacherSubjectTeacherandSubject,
    fncGetListSubjectSettingByTeacher
}

export default SubjectSettingService
