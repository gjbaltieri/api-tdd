import {
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAcessTokenRepository
} from '../authentication/db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAcessToken: UpdateAcessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare({
        value: authentication.password,
        hashedValue: account.password
      })
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAcessToken.updateAcessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
