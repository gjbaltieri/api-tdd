import { MissingParamError } from '../../errors'
import { badRequest } from '../../helper/http-helper'
import { Controller } from '../../protocols'
import { LoginController } from './login'

interface IMakeSut {
  sut: Controller
  emailValidatorStub: EmailvalidatorStub
}

class EmailvalidatorStub {
  isValid(): boolean {
    return true
  }
}
const makeSut = (): IMakeSut => {
  const emailValidatorStub = new EmailvalidatorStub()
  const sut = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Login Controller', () => {
  test('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { password: 'any_password' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'any_mail@mail.com' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(emailValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
})
