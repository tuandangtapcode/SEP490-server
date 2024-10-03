import { Request } from "express"
import SubjectSetting from "../models/SubjectSetting"
import response from "../utils/response"
import Subject from "../models/subject"

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
  fncGetListSubjectSettingByTeacher
}

export default SubjectSettingService
