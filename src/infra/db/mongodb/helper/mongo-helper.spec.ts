import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper Connect', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('should reconnect if mongodb is down ', async () => {
    const getCollection = sut.getCollection('test')
    expect(getCollection).toBeTruthy()
    await sut.disconnect()
    expect(getCollection).toBeTruthy()
  })
})
