import { MongoHelper as sut } from './mongo-helper'

describe.only('Mongo Helper Connect', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('should reconnect if mongodb is down', async () => {
    await sut.disconnect()
    const getCollection = sut.getCollection('jest-test')
    expect(getCollection).toBeTruthy()
  })
})
