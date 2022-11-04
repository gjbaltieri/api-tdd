import { Encrypter } from '../protocols/Encrypt'
import { DbAddAccount } from './dbAddAccount'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}
const makeSut = (): SutTypes => {
  class EncryptStub {
    async encrypt (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashad_password'))
    }
  }
  const encrypterStub = new EncryptStub()
  const sut = new DbAddAccount(encrypterStub)

  return { sut, encrypterStub }
}

describe('DbAddAccount usecase', () => {
  test('Should call Encrypt with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
