export interface AuthenticationModel {
  email: string
  password: string
}
export interface Authentication {
  auth(params: AuthenticationModel): Promise<string>
}
