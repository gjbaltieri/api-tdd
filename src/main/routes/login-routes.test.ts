import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import app from '../config/app'
import bcrypt from 'bcrypt'

let collection: Collection

describe('Login routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    return await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('jest-test')
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
  describe('GET /login', () => {
    test('should return 200 on sucess', async () => {
      const hashedPassword = await bcrypt.hash('validPassword', 12)
      await collection.insertOne({
        name: 'teste',
        email: 'email@mail.com',
        password: hashedPassword,
        passwordConfirmation: hashedPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'email@mail.com',
          password: 'validPassword'
        })
        .expect(200)
    })
    test('should return 401 if invalid params provided', async () => {
      const hashedPassword = await bcrypt.hash('validPassword', 12)
      await collection.insertOne({
        name: 'teste',
        email: 'email@mail.com',
        password: hashedPassword,
        passwordConfirmation: hashedPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'email@mail.com',
          password: 'incorrect_password'
        })
        .expect(401)
    })
  })
})
