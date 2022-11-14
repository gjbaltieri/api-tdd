import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign: () => {
    return 'any_token'
  }
}))

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const signSpy = jest.spyOn(jwt, 'sign')
    const sut = new JwtAdapter('any_secret')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret')
  })

  test('Should sign return a token if sucess', async () => {
    const sut = new JwtAdapter('any_secret')
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  test('Should JwtAdapter throw if sign throws', async () => {
    const sut = new JwtAdapter('any_secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
