import response from "../utils/response"
import { Request } from "express"
import Confirm from "../models/confirm"
import { CommonDTO, PaginationDTO } from "../dtos/common.dto"
import { ChangeConfirmStatusDTO, CreateUpdateConfirmDTO } from "../dtos/confirm.dto"

const fncCreateConfirm = async (req: Request) => {
  try {
    const newConfirm = await Confirm.create(req.body as CreateUpdateConfirmDTO)
    return response(newConfirm, false, "Yêu cầu booking của bạn đã được gửi. Hãy chờ giáo viên xác nhận.", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateConfirm = async (req: Request) => {
  try {
    const { ConfirmID } = req.body as CreateUpdateConfirmDTO
    const updateConfirm = await Confirm.findOneAndUpdate(
      {
        _id: ConfirmID
      },
      { ...req.body },
      { new: true }
    )
    if (!updateConfirm) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updateConfirm, false, "Chỉnh sửa thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeConfirmStatus = async (req: Request) => {
  try {
    const { ConfirmID, ConfirmStatus } = req.body as ChangeConfirmStatusDTO
    const updateConfirm = await Confirm.findOneAndUpdate(
      {
        _id: ConfirmID
      },
      { ConfirmStatus: ConfirmStatus },
      { new: true }
    )
    if (!updateConfirm) return response({}, true, "Có lỗi xảy ra", 200)
    return response(
      updateConfirm,
      false,
      ConfirmStatus === 2
        ? "Xác nhận thành công"
        : "Hủy thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListConfirm = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { PageSize, CurrentPage, TextSearch } = req.body as CommonDTO
    const data = await Confirm
      .find({
        $or: [
          { Sender: UserID },
          { Receiver: UserID }
        ]
      })
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    return response(data, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const ConfirmService = {
  fncCreateConfirm,
  fncUpdateConfirm,
  fncChangeConfirmStatus,
  fncGetListConfirm
}

export default ConfirmService