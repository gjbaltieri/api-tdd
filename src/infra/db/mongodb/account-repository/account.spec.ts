import { Collection } from 'mongodb'
import { MongoHelper } from '../helper/mongo-helper'
import { AccountMongoRepository } from './account'

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
      name: 'mock_name',
      email: 'mock_email@mail.com',
      password: 'mock_password'
    })
    const account = await sut.loadByEmail('mock_email@mail.com')
    expect(account).toBeTruthy()
    expect(account).toHaveProperty('id')
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('mock_name')
    expect(account.email).toBe('mock_email@mail.com')
    expect(account.password).toBe('mock_password')
  })

  test('should return null if loadAccountByEmail return null', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBe(null)
  })
})
