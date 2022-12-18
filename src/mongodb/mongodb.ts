import { MongoClient, OptionalId } from 'mongodb';

export class MongoDb {
  client: MongoClient;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
  }

  async uploadDocs(
    databaseName: string,
    collectionName: string,
    arrData: unknown
  ): Promise<unknown> {
    // Use connect method to connect to the server
    await this.client.connect();
    const db = this.client.db(databaseName);
    const collection = db.collection(collectionName);

    if (!Array.isArray(arrData)) {
      arrData = [arrData];
    }

    const insertResult = await collection.insertMany(
      arrData as OptionalId<Document>[]
    );
    return insertResult;
  }
  close() {
    this.client.close();
  }
}
