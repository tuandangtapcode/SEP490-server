import { ObjectId } from "mongoose"

export interface RegisterDTO {
  Email: string,
  RoleID: number,
  FullName: string,
  IsByGoogle?: Boolean,
  AvatarPath: string
}

export interface Login {
  Password: string,
  Email: string
}

export interface ChangePasswordDTO {
  OldPassword: string,
  NewPassword: string
}
