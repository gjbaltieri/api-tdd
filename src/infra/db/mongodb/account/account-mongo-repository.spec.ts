import { Collection } from 'mongodb'
import { MongoHelper } from '../helper/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let collection: Collection
describe('Account mongodb repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('should return account on add sucess', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account).toHaveProperty('id')
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return account on loadAccountByEmail sucess', async () => {
    const sut = makeSut()
    await collection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account).toHaveProperty('id')
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return null if loadAccountByEmail return null', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBe(null)
  })

  test('should update the account acessToken if UpdateAcessTokenRepository sucess', async () => {
    const sut = makeSut()
    const accountInsertReturn = await collection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const id = accountInsertReturn.insertedId.toString()
    await sut.updateAcessToken(id, 'any_token')
    const accountUpdated = await collection.findOne({ _id: MongoHelper.idToObjectId(id) })
    expect(accountUpdated).toBeTruthy()
    expect(accountUpdated).toHaveProperty('acessToken')
    expect(accountUpdated.acessToken).toBe('any_token')
  })
})
