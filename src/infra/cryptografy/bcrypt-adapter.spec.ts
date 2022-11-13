/* eslint-disable @typescript-eslint/indent */
import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'
import { HashComparerModel } from '../../data/protocols/cryptografy/hash-comparer'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash_password'))
  },

  async compare(values: HashComparerModel): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('should call hash with correct values', async () => {
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const sut = makeSut()
    await sut.hash('any_value')
    expect(encryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a vakud hash if hash sucess', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash_password')
  })

  test('should throw if bcrypt throw', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
      ReturnType<(key: Error) => Promise<Error>>,
      Parameters<(key: Error) => Promise<Error>>
    >
    hashSpy.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('should call compare with correct values', async () => {
    const encryptSpy = jest.spyOn(bcrypt, 'compare')
    const sut = makeSut()
    await sut.compare({ value: 'any_value', hashedValue: 'any_hashed_value' })
    expect(encryptSpy).toHaveBeenCalledWith('any_value', 'any_hashed_value')
  })

  test('should return true if compare sucess', async () => {
    const sut = makeSut()
    const isValid = await sut.compare({ value: 'any_value', hashedValue: 'any_hashed_value' })
    expect(isValid).toBe(true)
  })
})
