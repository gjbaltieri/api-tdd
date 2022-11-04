import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash_password'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const sut = makeSut()
    await sut.encrypt('any_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash if sucess', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash_password')
  })
})
