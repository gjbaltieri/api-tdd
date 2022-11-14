import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import app from '../config/app'

describe('Login routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    return await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('jest-test')
    await collection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('should return 200 on sucess', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'teste',
          email: 'email@mail.com',
          password: 'validPassword',
          passwordConfirmation: 'validPassword'
        })
        .expect(200)
    })
  })
})
