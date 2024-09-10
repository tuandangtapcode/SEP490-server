import { Request, Response } from "express"
import Account from "../models/account"
import User from "../models/user"
import bcrypt from "bcrypt"
import { Roles, response } from "../utils/lib"
import { encodeData, randomPassword } from "../utils/commonFunction"
import sendEmail from "../utils/send-mail"
import { getOneDocument } from "../utils/queryFunction"
import {
  ChangePasswordDTO,
  Login,
  RegisterByGoogleDTO,
  RegisterDTO
} from "../dtos/account.dto"
const saltRounds = 10

const fncRegister = async (req: Request) => {
  try {
    const { Email, RoleID, FullName } = req.body as RegisterDTO
    const password = randomPassword()
    const checkExist = await getOneDocument(Account, "Email", Email)
    if (!!checkExist) return response({}, true, "Email đã tồn tại", 200)
    const hashPassword = bcrypt.hashSync(password, saltRounds)
    const user = await User.create({
      ...req.body,
      Subjects: RoleID !== Roles.ROLE_STUDENT ? [req.body.Subject] : [],
      IsByGoogle: false,
      RegisterStatus: RoleID === Roles.ROLE_STUDENT ? 3 : 1
    })
    await Account.create({
      UserID: user._id,
      Email,
      Password: hashPassword
    })
    const subject = "THÔNG BÁO DUYỆT TÀI KHOẢN ĐĂNG KÝ"
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
                  <p style="margin-top: 30px; margin-bottom:30px; text-align:center; font-weigth: 700; font-size: 20px">THÔNG BÁO DUYỆT TÀI KHOẢN ĐĂNG KÝ</p>
                  <p style="margin-bottom:10px">Xin chào ${FullName},</p>
                  <p style="margin-bottom:10px">Tài khoản của quý khách đã được duyệt.</p>
                  <p>Thông tin tài khoản được cấp:</p>
                  <p>Email: ${Email}</p>
                  <p>Mật khẩu: ${password}</p>
                  <p>Quý khách truy cập vào trang web <a href='http://localhost:5173/dang-nhap'>tại đây</a> của Tatuboo để đăng nhập và sử dụng những dịch vụ của chúng tôi.</p>
                </body>
                </html>
                `
    await sendEmail(Email, subject, content)
    return response(
      {},
      false,
      "Tài khoản đăng ký thành công.Hãy kiểm tra email bạn dùng để đăng ký để lấy thông tin tài khoản.",
      201
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncRegisterByGoogle = async (req: Request) => {
  try {
    const { email, given_name, picture, RoleID } = req.body as RegisterByGoogleDTO
    const checkExist = await getOneDocument(Account, "Email", email)
    if (!!checkExist) return response({}, true, "Email đã tồn tại", 200)
    const user = await User.create({
      Email: email,
      FullName: given_name,
      AvatarPath: picture,
      RoleID,
      IsByGoogle: true,
      Subjects: RoleID !== Roles.ROLE_STUDENT ? [req.body.Subject] : [],
      RegisterStatus: RoleID === Roles.ROLE_STUDENT ? 3 : 1
    })
    await Account.create({
      UserID: user._id,
      Email: email,
    })
    return response(
      {},
      false,
      RoleID === Roles.ROLE_STUDENT
        ? "Đăng ký tài khoản thành công."
        : "Đăng ký tài khoản thành công. Hãy đăng nhập và chỉnh sửa profile để trở thành giáo viên chính thức.",
      201
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncLogin = async (req: Request, res: Response) => {
  try {
    const { Password, Email } = req.body as Login
    const getAccount = await getOneDocument(Account, "Email", Email)
    if (!getAccount) return response({}, true, "Email không tồn tại", 200)
    if (!getAccount.IsActive) return response({}, true, "Tài khoản đã bị khóa", 200)
    const check = bcrypt.compareSync(Password, getAccount.Password)
    if (!check) return response({}, true, "Mật khẩu không chính xác", 200)
    const user = await getOneDocument(User, "_id", getAccount.UserID)
    const token = encodeData({
      ID: user._id,
      RoleID: user.RoleID,
    })
    res.cookie("token", token, {
      httpOnly: false, // cookie chỉ được truy cập bới server
      secure: true, // cookie chỉ được sử dụng với https
      sameSite: "none",
      maxAge: 6 * 60 * 60 * 1000 // 8h
    })
    return response(token, false, "Login thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncLoginByGoogle = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const getAccount = await getOneDocument(Account, "Email", email)
    if (!getAccount) return response({}, true, "Email không tồn tại", 200)
    if (!getAccount.IsActive) return response({}, true, "Tài khoản đã bị khóa", 200)
    const user = await getOneDocument(User, "_id", getAccount.UserID)
    const token = encodeData({
      ID: user._id,
      RoleID: user.RoleID,
    })
    res.cookie("token", token, {
      httpOnly: false, // cookie chỉ được truy cập bới server
      secure: true, // cookie chỉ được sử dụng với https
      sameSite: "none",
      maxAge: 6 * 60 * 60 * 1000 // 8h
    })
    return response(token, false, "Login thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangePassword = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const { OldPassword, NewPassword } = req.body as ChangePasswordDTO
    const account = await getOneDocument(Account, "UserID", UserID)
    if (!account) return response({}, true, "Có lỗi xảy ra", 200)
    const check = bcrypt.compareSync(OldPassword, account.Password)
    if (!check) return response({}, true, "Mật khẩu không chính xác", 200)
    const hashPassword = bcrypt.hashSync(NewPassword, saltRounds)
    const updateAccount = await Account.findOneAndUpdate({ UserID: UserID }, { Password: hashPassword })
    return response(updateAccount, false, "Cập nhật mật khẩu thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const AccountService = {
  fncRegister,
  fncRegisterByGoogle,
  fncLogin,
  fncLoginByGoogle,
  fncChangePassword,
}

export default AccountService
