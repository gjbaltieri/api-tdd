import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUp } from './signup'
import {
  CompareFieldsValidator,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helper/validators'

jest.mock('../../../presentation/helper/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUp Validation', () => {
  test('Should SignUpValidation called with correct params', () => {
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    makeSignUp()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
