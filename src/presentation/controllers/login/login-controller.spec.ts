import { badRequest, ok, serverError, unauthorized } from '../../helper/http/http-helper'
import { LoginController } from './login-controller'
import { Controller, HttpRequest, AuthenticationModel, Authentication, Validation } from './login-controller-protocols'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(inputs: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_mail@mail.com',
    password: 'any_password'
  }
})
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

interface IMakeSut {
  sut: Controller
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): IMakeSut => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return { sut, authenticationStub, validationStub }
}

describe('Login Controller', () => {
  test('should LoginController calls authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_mail@mail.com', password: 'any_password' })
  })

  test('should LoginController return 401 if authentication fails', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should LoginController return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error('any_stack')
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(error)))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(error))
  })

  test('should return 200 if valid params is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok('any_token'))
  })

  test('should LoginController calls Validation with correct params', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should LoginController return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeHttpRequest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(badRequest(new Error()))
  })
})
