import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(inputs: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('should return same error from validator', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const error = sut.validate({ any: 'field' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('another_field'))
    const error = sut.validate({ any: 'field' })
    expect(error).toEqual(new Error())
  })
})
