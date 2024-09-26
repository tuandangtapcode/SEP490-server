import { decodeData } from '../utils/commonFunction'
import { NextFunction, Request, Response } from 'express'
import response from '../utils/response'

const authMiddleware = (Roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) {
      return res.status(401).json(
        response({}, true, 'Không có token', 401)
      )
    }
    const token = req.cookies.token
    const data = decodeData(token)
    if (!data) {
      return res.status(401).json(
        response({}, true, "Token không có dữ liệu", 401)
      )
    }
    if (Roles.includes(data.RoleID)) {
      req.user = data
      next()
    } else {
      return res.status(403).json(
        response({}, true, 'Bạn không có quyền', 403)
      )
    }
  }
}

export default authMiddleware
