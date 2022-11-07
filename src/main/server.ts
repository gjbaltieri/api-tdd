import { MongoHelper } from '../infra/db/mongodb/helper/mongo-helper'
import env from './config/env'
import app from './config/app'
MongoHelper.connect(env.mongoUrl).then(async () => {
  app.listen(env.port, () => console.log(`Server running in localhost:${env.port}`))
}).catch(console.error)
