import { InvalidParamError } from '../../errors'
import { CompareFieldsValidator } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidator => {
  return new CompareFieldsValidator('field', 'another_field')
}

describe('CompareFields Validation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const fieldValidation = makeSut()
    const error = fieldValidation.validate({ field: 'any_value', another_field: 'another_value' })
    expect(error).toEqual(new InvalidParamError('another_field'))
  })

  test('should not return if validation sucess', () => {
    const fieldValidation = makeSut()
    const error = fieldValidation.validate({ field: 'any_value', another_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
