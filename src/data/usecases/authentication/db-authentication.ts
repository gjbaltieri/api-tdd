import {
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  UpdateAcessTokenRepository
} from '../authentication/db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAcessToken: UpdateAcessTokenRepository
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAcessToken: UpdateAcessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAcessToken = updateAcessToken
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare({
        password: authentication.password,
        hash: account.password
      })
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAcessToken.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
