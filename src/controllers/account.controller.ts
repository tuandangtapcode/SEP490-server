import { Request, Response } from "express"
import AccountService from "../services/account.service"

const register = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncRegister(req, res)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const checkAuth = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncCheckAuth(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}


const login = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncLogin(req, res)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const loginByGoogle = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncLoginByGoogle(req, res)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const logout = async (req: Request, res: Response) => {
  res.clearCookie("token")
  return res.status(200).json({ data: {}, isError: false, msg: "Đăng xuất thành công" })
}

const changePassword = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncChangePassword(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncForgotPassword(req)
    return res.status(!!response ? response.statusCode : 200).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const AccountController = {
  register,
  login,
  checkAuth,
  loginByGoogle,
  logout,
  changePassword,
  forgotPassword
}

export default AccountController
