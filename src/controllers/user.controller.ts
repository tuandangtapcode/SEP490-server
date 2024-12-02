import { Request, Response } from "express"
import UserSerivce from "../services/user.service"

const getDetailProfile = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetDetailProfile(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const changeProfile = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncChangeProfile(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const requestConfirmRegister = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncRequestConfirmRegister(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const responseConfirmRegister = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncResponseConfirmRegister(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListTeacher = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListTeacher(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListTeacherByUser = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListTeacherByUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getDetailTeacher = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetDetailTeacher(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListStudent = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListStudent(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const inactiveOrActiveAccount = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncInactiveOrActiveAccount(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListSubjectSettingByTeacher = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListSubjectSettingByTeacher(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const createSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncCreateSubjectSetting(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncUpdateSubjectSetting(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const deleteSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncDeleteSubjectSetting(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const responseConfirmSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncResponseConfirmSubjectSetting(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListTopTeacher = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListTopTeacher(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const changeCareerInformation = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncChangeCareerInformation(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const updateSchedule = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncUpdateSchedule(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListSubjectSetting(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const disabledOrEnabledSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncDisabledOrEnabledSubjectSetting(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const createAccountStaff = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncCreateAccountStaff(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListAccountStaff = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListAccountStaff(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const resetPasswordAccountStaff = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncResetPasswordAccountStaff(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const UserController = {
  getDetailProfile,
  changeProfile,
  requestConfirmRegister,
  responseConfirmRegister,
  getListTeacher,
  getListTeacherByUser,
  getDetailTeacher,
  getListStudent,
  inactiveOrActiveAccount,
  getListSubjectSettingByTeacher,
  createSubjectSetting,
  updateSubjectSetting,
  deleteSubjectSetting,
  responseConfirmSubjectSetting,
  getListTopTeacher,
  changeCareerInformation,
  updateSchedule,
  getListSubjectSetting,
  disabledOrEnabledSubjectSetting,
  createAccountStaff,
  getListAccountStaff,
  resetPasswordAccountStaff
}

export default UserController
