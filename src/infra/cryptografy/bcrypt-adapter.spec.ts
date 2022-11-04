import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash_password'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const salt = 12
    const sut = new BcryptAdapter(salt)
    await sut.encrypt('any_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash if sucess', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash_password')
  })
})
