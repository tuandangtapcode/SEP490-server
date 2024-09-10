export interface RegisterDTO {
  Email: string,
  RoleID: number,
  FullName: string
}

export interface RegisterByGoogleDTO {
  email: string,
  given_name: string,
  picture: string,
  RoleID: number
}

export interface Login {
  Password: string,
  Email: string
}

export interface ChangePasswordDTO {
  OldPassword: string,
  NewPassword: string
}
