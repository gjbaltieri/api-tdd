import request from 'supertest'
import app from '../config/app'

describe('SignUp route', () => {
  test('should return an account on sucess', async () => {
    await request(app).post('/api/signup').send()
      .expect(200)
  })
})
