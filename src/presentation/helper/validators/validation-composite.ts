import { Validation } from '../../protocols/validation'

export class ValidationComposite implements Validation {
  constructor(private readonly validatiors: Validation[]) {}

  validate(inputs: any): Error {
    for (const validation of this.validatiors) {
      const error = validation.validate(inputs)
      if (error) {
        return error
      }
    }
  }
}
