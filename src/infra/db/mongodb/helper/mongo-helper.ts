import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (id: string, collection: any): any {
    const { name, email, password } = collection
    const collectionWithId = {
      id, name, email, password
    }
    return collectionWithId
  }
}
