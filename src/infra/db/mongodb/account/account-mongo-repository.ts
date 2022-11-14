import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAcessTokenRepository } from '../../../../data/protocols/db/account/update-acess-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAcessTokenRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const mongoId = (await accountCollection.insertOne(account)).insertedId.toString()
    return MongoHelper.map(mongoId, account)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account._id.toString(), account)
  }

  async updateAcessToken(id: string, token: string): Promise<void> {
    const toObjectId = MongoHelper.idToObjectId(id)
    const accountCollection = await MongoHelper.getCollection('accounts')
    const updateAcessToken = await accountCollection.findOneAndUpdate({ _id: toObjectId }, { $set: { acessToken: token } })
    console.log('updateAcessToken', updateAcessToken)
  }
}
