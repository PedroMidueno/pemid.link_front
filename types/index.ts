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

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface UserWithToken {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  authToken: string
  isAuthenticated: boolean
}
