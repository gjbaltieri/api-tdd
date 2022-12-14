import { AddAccount, Controller, HttpRequest, HttpResponse } from './signup-controller-protocols'
import { badRequest, ok, serverError } from '../../helper/http/http-helper'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor(private readonly addAccount: AddAccount, private readonly validation: Validation) {}

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
