import { LogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository'
import { MongoHelper } from '../helper/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({ stack, date: new Date() })
  }
}
