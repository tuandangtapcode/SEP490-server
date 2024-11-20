import response from "../utils/response"
import { getOneDocument } from "../utils/queryFunction"
import BankingInfor from "../models/bankinginfor"
import sendEmail from "../utils/send-mail"
import { Request } from "express"
import {
  CreateUpdateBankingInforDTO,
  GetBankingInforOfUserDTO,
} from "../dtos/bankinginfor.dto"
import { CommonDTO } from "../dtos/common.dto"

const fncCreateBankingInfor = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const newBankingInfor = await BankingInfor.create({
      ...req.body as CreateUpdateBankingInforDTO,
      User: UserID
    })
    return response(newBankingInfor, false, "Tạo thông tin banking thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetDetailBankingInfor = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const bankingInfor = await getOneDocument(BankingInfor, "User", UserID)
    if (!bankingInfor) return response({}, true, "Chưa có thông tin ngân hàng", 200)
    return response(bankingInfor, false, "lấy ra thông tin thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBankingInfor = async (req: Request) => {
  try {
    const { TextSearch, CurrentPage, PageSize } = req.body as CommonDTO
    let query = {
      UserBankName: { $regex: TextSearch, $options: "i" },
      IsDeleted: false
    }
    const bankingInfor = BankingInfor
      .find(query)
      .skip((CurrentPage - 1) * PageSize)
      .limit(PageSize)
    const total = BankingInfor.countDocuments(query)
    const result = await Promise.all([bankingInfor, total])
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

const fncUpdateBankingInfor = async (req: Request) => {
  try {
    const { BankingInforID } =
      req.body as CreateUpdateBankingInforDTO
    const updatedBankingInfor = await BankingInfor.findByIdAndUpdate(
      BankingInforID,
      { ...req.body },
      { new: true, runValidators: true }
    )
    if (!updatedBankingInfor) return response({}, true, "Có lỗi xảy ra", 200)
    return response(updatedBankingInfor, false, "Cập nhật thông tin Banking thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncDeleteBankingInfor = async (req: Request) => {
  try {
    const BankingInforID = req.params.BankingInforID
    const deleteBanking = await BankingInfor.findByIdAndDelete(BankingInforID)
    if (!deleteBanking) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Xóa thông tin banking thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetBankingInforOfUser = async (req: Request) => {
  try {
    const { UserID, FullName, Email } = req.body as GetBankingInforOfUserDTO
    const bankingInfor = await getOneDocument(BankingInfor, "User", UserID)
    if (!bankingInfor) {
      const subject = "THÔNG BÁO ĐIỀN THÔNG TIN NGÂN HÀNG"
      const content = `
                <html>
                <head>
                <style>
                    p {
                        color: #333;
                    }
                </style>
                </head>
                <body>
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO ĐIỀN THÔNG TIN NGÂN HÀNG</p>
                  <p style="margin-bottom:10px">Xin chào ${FullName},</p>
                  <p style="margin-bottom:10px">Chúng tôi nhận thấy bạn chưa điền thông tin ngân hàng của mình. Hãy điền đầy đủ thông tin ngân hàng để chúng tôi có thể thanh toán tiền cho bạn.</p>
                </body>
                </html>
                `
      const checkSendMail = await sendEmail(Email, subject, content)
      if (!checkSendMail) return response({}, true, "Có lỗi xảy ra trong quá trình gửi mail", 200)
      return response({}, true, "Người dùng chưa điền thông tin ngân hàng", 200)
    }
    return response(bankingInfor, false, "lấy ra thông tin thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const BankingInforService = {
  fncCreateBankingInfor,
  fncGetDetailBankingInfor,
  fncUpdateBankingInfor,
  fncDeleteBankingInfor,
  fncGetListBankingInfor,
  fncGetBankingInforOfUser
}

export default BankingInforService
