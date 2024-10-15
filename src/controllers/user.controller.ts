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

const confirmSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncConfirmSubjectSetting(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListTopTeacherBySubject = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListTopTeacherBySubject(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListSubjectOfTeacher = async (req: Request, res: Response) => {
  try {
    const response = await UserSerivce.fncGetListSubjectOfTeacher(req)
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
  confirmSubjectSetting,
  getListTopTeacherBySubject,
  getListSubjectOfTeacher
}

export default UserController
