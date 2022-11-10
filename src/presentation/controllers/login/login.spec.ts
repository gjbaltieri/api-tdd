import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helper/http-helper'
import { Controller, HttpRequest } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'
import { LoginController } from './login'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_mail@mail.com',
    password: 'any_password'
  }
})

class EmailvalidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

class AuthenticationStub implements Authentication {
  async auth(params: AuthenticationModel): Promise<string> {
    return new Promise((resolve) => resolve('any_token'))
  }
}

interface IMakeSut {
  sut: Controller
  emailValidatorStub: EmailvalidatorStub
  authenticationStub: Authentication
}

const makeSut = (): IMakeSut => {
  const emailValidatorStub = new EmailvalidatorStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return { sut, emailValidatorStub, authenticationStub }
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
    await sut.handle(makeHttpRequest())
    expect(emailValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  test('should EmailValidator return 400 if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should LoginController return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should LoginController calls authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_mail@mail.com', password: 'any_password' })
  })
})
