import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requiered-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('expect_field')
}

describe('RequiredField Validation', () => {
  test('should return a MissingParam error if validation fails', () => {
    const fieldValidation = makeSut()
    const error = fieldValidation.validate({ anotherField: 'any_value' })
    expect(error).toEqual(new MissingParamError('expect_field'))
  })

  test('should not return if validation sucess', () => {
    const fieldValidation = makeSut()
    const error = fieldValidation.validate({ expect_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
