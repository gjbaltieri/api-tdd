import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri)
  },

  async disconnect() {
    await this.client.close()
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await MongoHelper.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map(id: string, collection: any): any {
    const { _id, ...collectionWithouId } = collection
    return Object.assign({}, collectionWithouId, { id })
  }
}
