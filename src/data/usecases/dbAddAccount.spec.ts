import { DbAddAccount } from './dbAddAccount'

class EncryptStub {
  async encrypt (password: string): Promise<string> {
    return new Promise(resolve => resolve('hashad_password'))
  }
}

describe('DbAddAccount usecase', () => {
  test('Should call Encrypt with correct password', async () => {
    const encryptStub = new EncryptStub()
    const sut = new DbAddAccount(encryptStub)
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
