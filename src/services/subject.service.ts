import { Request } from "express"
import Subject from "../models/subject"
import { response } from "../utils/lib"
import { getOneDocument } from "../utils/queryFunction"
import {
  CreateSubjectDTO,
  GetListSubjectDTO,
  UpdateSubjectDTO
} from "../dtos/subject.dto"

const fncCreateSubject = async (req: Request) => {
  try {
    const { SubjectCateID, SubjectName } = req.body as CreateSubjectDTO
    const subject = await getOneDocument(Subject, "SubjectName", SubjectName)
    if (!!subject) return response({}, true, `Môn ${SubjectName} đã tồn tại`, 200)
    const newSubject = await Subject.create({
      SubjectCateID,
      SubjectName,
      AvatarPath: !!req.file ? req.file.path : undefined
    })
    return response(newSubject, false, "Tạo môn học thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListSubject = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize, SubjectCateID } =
      req.body as GetListSubjectDTO
    let query = {
      SubjectName: { $regex: TextSearch, $options: "i" },
      IsDeleted: false
    } as any
    if (!!SubjectCateID) {
      query = {
        ...query,
        SubjectCateID: SubjectCateID
      }
    }
    const subject = Subject
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = Subject.countDocuments(query)
    const result = await Promise.all([subject, total])
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

const fncUpdateSubject = async (req: Request) => {
  try {
    const { SubjectCateID, SubjectName, SubjectID } = req.body as UpdateSubjectDTO
    const checkExist = await getOneDocument(Subject, "_id", SubjectID)
    if (!checkExist) return response({}, true, "Môn học không tồn tại", 200)
    const checkExistName = await getOneDocument(Subject, "SubjectName", SubjectName)
    if (!!checkExistName && !checkExist._id.equals(checkExistName._id))
      return response({}, true, `Môn học ${SubjectName} đã tồn tại`, 200)
    const updatedSubject = await Subject.findByIdAndUpdate(
      SubjectID,
      {
        SubjectCateID,
        SubjectName,
        AvatarPath: !!req.file ? req.file.path : checkExist?.AvatarPath
      },
      { new: true, runValidators: true }
    )
    if (!updatedSubject) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updatedSubject, false, "Cập nhật môn học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteSubject = async (req: Request) => {
  try {
    const { SubjectID } = req.params
    const deletedSubject = await Subject.findByIdAndUpdate(
      SubjectID,
      { IsDeleted: true },
      { new: true }
    )
    if (!deletedSubject) return response({}, true, "Có lỗi xảy ra", 200)
    return response(deletedSubject, false, "Xoá môn học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailSubject = async (req: Request) => {
  try {
    const SubjectID = req.params.SubjectID
    const subject = await getOneDocument(Subject, "_id", SubjectID)
    if (!subject) return response({}, true, "Môn học không tồn tại", 200)
    return response(subject, true, "Môn học không tồn tại", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const Subjectervice = {
  fncCreateSubject,
  fncGetListSubject,
  fncUpdateSubject,
  fncDeleteSubject,
  fncGetDetailSubject
}

export default Subjectervice
