import { Validation } from '../../protocols/validation'

export class ValidationComposite implements Validation {
  private readonly validatiors: Validation[]
  constructor(validatiors: Validation[]) {
    this.validatiors = validatiors
  }

  validate(inputs: any): Error {
    for (const validation of this.validatiors) {
      const error = validation.validate(inputs)
      if (error) {
        return error
      }
    }
  }
}
