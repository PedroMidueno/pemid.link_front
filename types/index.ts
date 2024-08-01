export interface LoginParams {
  email: string
  password: string
}

export interface SignUpParams extends LoginParams {
  firstame: string
  lastName: string
  confirmPassword?: string
}

export interface LoginFormState {
  name?: string
  lastName?: string
  email: string
  password: string
  confirmPassword?: string
}
