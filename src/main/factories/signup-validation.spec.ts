import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helper/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helper/validators/requiered-field-validation'
import { Validation } from '../../presentation/helper/validators/validation'
import { CompareFieldsValidator } from '../../presentation/helper/validators/compare-fields-validation'

jest.mock('../../presentation/helper/validators/validation-composite')

describe('SignUp Validation', () => {
  test('Should SignUpValidation called with correct params', () => {
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
