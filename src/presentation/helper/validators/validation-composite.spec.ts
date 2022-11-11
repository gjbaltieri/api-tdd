import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  test('should return same error from validator', () => {
    class ValidationStub implements Validation {
      validate(inputs: any): Error {
        return new MissingParamError('field')
      }
    }
    const makeValidationStub = (): Validation => {
      return new ValidationStub()
    }
    const sut = new ValidationComposite([makeValidationStub()])
    const error = sut.validate({ any: 'field' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
