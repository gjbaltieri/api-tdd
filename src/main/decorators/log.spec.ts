import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { ok, serverError } from '../../presentation/helper/http/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'

const makeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())))
    }
  }
  const controllerStub = new ControllerStub()
  return controllerStub
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve(null))
    }
  }
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  return logErrorRepositoryStub
}

interface IMakeSut {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): IMakeSut => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Decorator', () => {
  test('should call controller handler', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeHttpRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeHttpRequest())
  })

  test('should LogControllerDecorator return correct controller value', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('should LogErrorRepository called with correct param', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = makeServerError()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(error)))
    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    await sut.handle(makeHttpRequest())
    expect(logErrorSpy).toHaveBeenCalledWith('any_stack')
  })
})
