import { Request } from "express"
import Subject from "../models/subject"
import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import {
  CreateUpdateSubjectDTO,
  GetListSubjectDTO,
} from "../dtos/subject.dto"
import mongoose, { ObjectId } from "mongoose"
import Confirm from "../models/confirm"

const fncCreateSubject = async (req: Request) => {
  try {
    const { SubjectCateID, SubjectName } = req.body as CreateUpdateSubjectDTO
    const subject = await getOneDocument(Subject, "SubjectName", SubjectName)
    if (!!subject) return response({}, true, `Môn ${SubjectName} đã tồn tại`, 200)
    const newSubject = await Subject.create({ ...req.body })
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
      query.SubjectCateID = SubjectCateID
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
    const { SubjectName, SubjectID } = req.body as CreateUpdateSubjectDTO
    const checkExistName = await Subject.findOne({
      SubjectName,
      _id: {
        $ne: SubjectID
      }
    })
    if (!!checkExistName)
      return response({}, true, `Môn học ${SubjectName} đã tồn tại`, 200)
    const updatedSubject = await Subject.findByIdAndUpdate(
      SubjectID,
      { ...req.body },
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
    if (!mongoose.Types.ObjectId.isValid(`${SubjectID}`)) {
      return response({}, true, "ID môn học không tồn tại", 200)
    }
    const subject = await getOneDocument(Subject, "_id", SubjectID)
    if (!subject) return response({}, true, "Môn học không tồn tại", 200)
    return response(subject, false, "tìm kiếm môn học thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTopSubject = async () => {
  try {
    const subjects = await Confirm.aggregate([
      {
        $group: {
          _id: "$Subject",
          Total: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "Subject",
          pipeline: [
            {
              $project: {
                _id: 1,
                SubjectName: 1
              }
            }
          ]
        }
      },
      { $unwind: "$Subject" },
      {
        $sort:
          { Total: -1 }
      },
      { $limit: 8 },
      {
        $project: {
          SubjectName: "$Subject.SubjectName",
          Total: 1
        }
      }
    ])
    return response(subjects, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const SubjectService = {
  fncCreateSubject,
  fncGetListSubject,
  fncUpdateSubject,
  fncDeleteSubject,
  fncGetDetailSubject,
  fncGetListTopSubject
}

export default SubjectService
