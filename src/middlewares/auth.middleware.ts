import { response } from '../utils/lib.js'
import { decodeData } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'

const authMiddleware = (Roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) {
      return res.status(401).json(
        response({}, true, 'Không có token')
      )
    }
    const token = req.cookies.token
    const data = decodeData(token)
    if (!data) {
      return res.status(401).json(
        response({}, true, "Token không có dữ liệu")
      )
    }
    if (Roles.includes(data.RoleID)) {
      req.user = data
      next()
    } else {
      return res.status(403).json(
        response({}, true, 'Bạn không có quyền')
      )
    }
  }
}

export default authMiddleware
