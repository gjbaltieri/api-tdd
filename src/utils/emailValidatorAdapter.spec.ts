import { EmailValidatorAdapter } from './emailValidatorAdapter'

describe('Email Validator Adapter', () => {
  test('should return false if validator return false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
