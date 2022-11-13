import {
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAcessTokenRepository
} from '../authentication/db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAcessToken: UpdateAcessTokenRepository
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAcessToken: UpdateAcessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAcessToken = updateAcessToken
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare({
        value: authentication.password,
        hashedValue: account.password
      })
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAcessToken.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
