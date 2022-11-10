import { RequiredFieldValidation } from '../../presentation/helper/validators/requiered-field-validation'
import { Validation } from '../../presentation/helper/validators/validation'
import { ValidationComposite } from '../../presentation/helper/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
