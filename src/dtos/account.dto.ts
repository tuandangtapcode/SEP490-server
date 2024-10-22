import { ObjectId } from "mongoose"

export interface RegisterDTO {
  Email: string,
  RoleID: number,
  FullName: string,
  Phone: string,
  DateOfBirth: Date,
  Subjects?: ObjectId[]
  IsByGoogle?: Boolean,
  Subject?: ObjectId,
  Gender: number
}

export interface Login {
  Password: string,
  Email: string
}

export interface ChangePasswordDTO {
  OldPassword: string,
  NewPassword: string
}
