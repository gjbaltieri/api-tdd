export class MissingParamError extends Error{
  constructor (missingParam: string) {
    super(`Missin param: ${missingParam}`)
    this.name = 'MissingParamError'
  }
}
