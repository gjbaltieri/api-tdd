import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helper/validators'

jest.mock('../../../presentation/helper/validators/validation-composite')

describe('login Validator', () => {
  test('should Validation Compisite called with correct validations', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        return true
      }
    }
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorStub()))
    makeLoginValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
