import { CompareFieldsValidator } from '../../../presentation/helper/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helper/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/requiered-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUp } from './signup'

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
