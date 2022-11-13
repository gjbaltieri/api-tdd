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
    jest.spyOn(bcrypt, 'hash').mockImplementation((value) => {
      throw new Error()
    })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('should call compare with correct values', async () => {
    const encryptSpy = jest.spyOn(bcrypt, 'compare')
    const sut = makeSut()
    await sut.compare({ value: 'any_value', hashedValue: 'any_hashed_value' })
    expect(encryptSpy).toHaveBeenCalledWith('any_value', 'any_hashed_value')
  })

  test('should return true when compare sucess', async () => {
    const sut = makeSut()
    const isValid = await sut.compare({ value: 'any_value', hashedValue: 'any_hashed_value' })
    expect(isValid).toBe(true)
  })

  test('should return false when compare fails', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation((value, hashedValue) => {
      return false
    })
    const sut = makeSut()
    const isValid = await sut.compare({ value: 'any_value', hashedValue: 'any_hashed_value' })
    expect(isValid).toBe(false)
  })
})
