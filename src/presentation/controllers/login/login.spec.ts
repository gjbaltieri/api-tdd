import { MissingParamError } from '../../errors'
import { badRequest } from '../../helper/http-helper'
import { LoginController } from './login'

const makeSut = (): LoginController => {
  return new LoginController()
}

describe('Login Controller', () => {
  test('should return 400 if email is not provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: { password: 'any_password' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if password is not provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: { email: 'any_mail@mail.com' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})