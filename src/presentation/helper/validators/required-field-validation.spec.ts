import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requiered-field-validation'

describe('RequiredField Validation', () => {
  test('should return a MissingParam error if validation fails', () => {
    const fieldValidation = new RequiredFieldValidation('expect_field')
    const error = fieldValidation.validate({ anotherField: 'another_field' })
    expect(error).toEqual(new MissingParamError('expect_field'))
  })

  test('should not return if validation sucess', () => {
    const fieldValidation = new RequiredFieldValidation('expect_field')
    const error = fieldValidation.validate({ anotherField: 'another_field' })
    expect(error).toEqual(new MissingParamError('expect_field'))
  })
})
