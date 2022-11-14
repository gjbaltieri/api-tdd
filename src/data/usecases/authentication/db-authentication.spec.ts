import { DbAuthentication } from './db-authentication'
import {
  LoadAccountByEmailRepository,
  AccountModel,
  HashComparer,
  HashComparerModel,
  Encrypter,
  UpdateAcessTokenRepository
} from '../authentication/db-authentication-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashad_password'
})
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(values: HashComparerModel): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateAcessTokenRepository = (): UpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements UpdateAcessTokenRepository {
    async updateAcessToken(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }
  return new UpdateAcessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAcessTokenRepositoryStub = makeUpdateAcessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAcessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAcessTokenRepositoryStub
  }
}
describe('Db-authentication Use case', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should DbAuthentication throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const acessToken = await sut.auth({ email: 'any_email@mail.com', password: 'hashad_password' })
    expect(acessToken).toBeNull()
  })

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const hashSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(hashSpy).toHaveBeenCalledWith({ value: 'any_password', hashedValue: 'hashad_password' })
  })

  test('should DbAuthentication throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth({ email: 'any_email@mail.com', password: 'any_passwords' })
    await expect(promise).rejects.toThrow()
  })

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const acessToken = await sut.auth({ email: 'any_email@mail.com', password: 'hashad_password' })
    expect(acessToken).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth({ email: 'any_email@mail.com', password: 'hashad_password' })
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('should DbAuthentication throw if Encrypter thorws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const acessToken = sut.auth({ email: 'any_email@mail.com', password: 'hashad_password' })
    await expect(acessToken).rejects.toThrow()
  })

  test('should return a token if Encrypter sucess', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth({ email: 'any_email@mail.com', password: 'hashad_password' })
    expect(acessToken).toEqual('any_token')
  })

  test('should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    const updateAcessTokenSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'updateAcessToken')
    await sut.auth({ email: 'any_email@mail.com', password: 'hashad_password' })
    expect(updateAcessTokenSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should DbAuthentication throw if UpdateAcessTokenRepository throws', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAcessTokenRepositoryStub, 'updateAcessToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth({ email: 'any_email@mail.com', password: 'any_passwords' })
    await expect(promise).rejects.toThrow()
  })
})
