import { AddAccount, Controller, HttpRequest, HttpResponse } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helper/http-helper'
import { Validation } from '../../helper/validators/validation'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const paramValidatorError = this.validation.validate(httpRequest.body)
      if (paramValidatorError) {
        return badRequest(paramValidatorError)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
