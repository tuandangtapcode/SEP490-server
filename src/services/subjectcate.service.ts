import SubjectCate from "../models/subjectcate"
import Subject from "../models/subject"
import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import { Request } from "express"
import {
  CreateUpdateSubjectCateDTO,
  GetDetailSubjectCateDTO,
} from "../dtos/subjectcate.dto"
import { CommonDTO } from "../dtos/common.dto"
import mongoose from "mongoose"

const fncCreateSubjectCate = async (req: Request) => {
  try {
    const { SubjectCateName, Description } = req.body as CreateUpdateSubjectCateDTO
    const subjectCate = await getOneDocument(SubjectCate, "SubjectCateName", SubjectCateName)
    if (!!subjectCate) return response({}, true, "Loại môn đã tồn tại", 200)
    const newSubjectCate = await SubjectCate.create({
      SubjectCateName,
      Description
    })
    return response(newSubjectCate, false, "Tạo mới môn học thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}


const fncGetListSubjectCate = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize } = req.body as CommonDTO
    const query = {
      SubjectCateName: { $regex: TextSearch, $options: "i" },
      IsDeleted: false,
    }
    const subjectCates = SubjectCate
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = SubjectCate.countDocuments(query)
    const result = await Promise.all([subjectCates, total])
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

const fncUpdateSubjectCate = async (req: Request) => {
  try {
    const { SubjectCateID, SubjectCateName } =
      req.body as CreateUpdateSubjectCateDTO
    const checkExistName = await SubjectCate.findOne({
      SubjectCateName,
      _id: {
        $ne: SubjectCateID
      }
    })
    if (!!checkExistName)
      return response({}, true, `Loại danh mục ${SubjectCateName} đã tồn tại`, 200)
    const updatedSubjectCate = await SubjectCate.findByIdAndUpdate(
      SubjectCateID,
      { ...req.body },
      { new: true, runValidators: true }
    )
    if (!updatedSubjectCate) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updatedSubjectCate, false, "Cập nhật danh mục thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteSubjectCate = async (req: Request) => {
  try {
    const { SubjectCateID, IsDeleted } = req.body
    const deletedSubjectCate = await SubjectCate.findByIdAndUpdate(
      SubjectCateID,
      { IsDeleted: IsDeleted },
      { new: true }
    )
    if (!deletedSubjectCate) return response({}, true, "Có lỗi xảy ra", 200)
    return response(
      deletedSubjectCate,
      false,
      !!IsDeleted ? "Ẩn danh mục môn học thành công" : "Hiện danh mục môn học thành công",
      200)

  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailSubjectCate = async (req: Request) => {
  try {
    const { SubjectCateID, PageSize, CurrentPage, TextSearch } =
      req.body as GetDetailSubjectCateDTO
    if (!mongoose.Types.ObjectId.isValid(`${SubjectCateID}`)) {
      return response({}, true, "Môn học không tồn tại", 200)
    }
    const subjectcate = await getOneDocument(SubjectCate, "_id", SubjectCateID)
    if (!subjectcate) return response({}, true, "Không tìm thấy danh mục", 200)
    const query = {
      SubjectCateID: SubjectCateID,
      SubjectName: { $regex: TextSearch, $options: "i" },
    }
    const subjects = Subject
      .find(query)
    // .skip((CurrentPage - 1) * PageSize)
    // .limit(PageSize)
    const total = Subject.countDocuments(query)
    const result = await Promise.all([subjects, total])
    return response(
      {
        SubjectCate: subjectcate,
        ListSubject: result[0],
        Total: result[1]
      },
      false,
      "Get thanh cong",
      200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListSubjectCateAndSubject = async () => {
  try {
    const subjectcates = SubjectCate.find().lean()
    const subjects = Subject.find().lean()
    const result = await Promise.all([subjectcates, subjects])
    const list = result[0].map(i => ({
      ...i,
      Subjects: result[1].filter(item => item?.SubjectCateID.equals(i._id)).splice(0, 8)
    }))
    return response(list, false, "Lay data thanh cong", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListSubjectCateByAdmin = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize } = req.body as CommonDTO
    const query = {
      SubjectCateName: { $regex: TextSearch, $options: "i" },
    }
    const subjectCates = SubjectCate
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = SubjectCate.countDocuments(query)
    const result = await Promise.all([subjectCates, total])
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

const SubjectCateService = {
  fncCreateSubjectCate,
  fncGetListSubjectCate,
  fncUpdateSubjectCate,
  fncDeleteSubjectCate,
  fncGetDetailSubjectCate,
  fncGetListSubjectCateAndSubject,
  fncGetListSubjectCateByAdmin
}

export default SubjectCateService
