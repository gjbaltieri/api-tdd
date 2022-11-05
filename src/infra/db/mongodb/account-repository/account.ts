import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const mongoId = (await accountCollection.insertOne(account)).insertedId.toString()
    const { name, email, password } = account
    const accountWithId = {
      id: mongoId, name, email, password
    }
    return accountWithId
  }
}
