import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const salt = 12
    const sut = new BcryptAdapter(salt)
    await sut.encrypt('any_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
