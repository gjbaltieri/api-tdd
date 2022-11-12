import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const mongoId = (await accountCollection.insertOne(account)).insertedId.toString()
    return MongoHelper.map(mongoId, account)
  }
}
