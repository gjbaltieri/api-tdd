import { Collection } from 'mongodb'
import { MongoHelper } from '../helper/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let collection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('errors')
    await collection.deleteMany({})
  })
  test('Should vefiry an create log error sucess', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})
