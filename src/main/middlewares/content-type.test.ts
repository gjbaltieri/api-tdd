import request from 'supertest'
import app from '../config/app'

describe('Content-type middleware', () => {
  test('should return default content as json', async () => {
    app.get('/test_content_type', (req, res) => { res.send() })
    await request(app).get('/test_content_type').send()
      .expect('content-type', /json/)
  })
  test('should return content as xml if pre defined', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app).get('/test_content_type_xml').send()
      .expect('content-type', /xml/)
  })
})
