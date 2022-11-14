import { Collection, MongoClient, ObjectId } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri)
  },

  async disconnect() {
    await this.client.close()
    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  idToObjectId(id: string): ObjectId {
    return new ObjectId(id)
  },

  map(id: string, collection: any): any {
    const { _id, ...collectionWithouId } = collection
    return Object.assign({}, collectionWithouId, { id })
  }
}
