import { MongoClient } from 'mongodb';
import {
  OptionalId,
  Filter,
  Document,
  IndexSpecification
} from './mongodb-model';

export class MongoDb {
  client: MongoClient;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
  }
  close() {
    this.client.close();
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

  async findInMongoDb(
    databaseName: string,
    collectionName: string,
    query: Filter<Document>,
    options: any
  ): Promise<Array<Document>> {
    if (!databaseName) throw new Error('databaseName is missing');
    if (!collectionName) throw new Error('collectionName is missing');
    if (!query) throw new Error('query is missing');

    // Use connect method to connect to the server
    await this.client.connect();

    const findResult = await this.client
      .db(databaseName)
      .collection(collectionName)
      .find(query, options)
      .toArray();

    return findResult;
  }
  async getIndexes(
    databaseName: string,
    collectionName: string
  ): Promise<Document[]> {
    await this.client.connect();

    const indexList = await this.client
      .db(databaseName)
      .collection(collectionName)
      .indexes();

    return indexList;
  }
  async createIndex(
    databaseName: string,
    collectionName: string,
    indexDefination: IndexSpecification
  ): Promise<string> {
    await this.client.connect();

    const indexResult = await this.client
      .db(databaseName)
      .collection(collectionName)
      .createIndex(indexDefination);

    return indexResult;
  }
  async deleteIndex(
    databaseName: string,
    collectionName: string,
    indexName: string
  ): Promise<Document> {
    await this.client.connect();

    const indexResult = await this.client
      .db(databaseName)
      .collection(collectionName)
      .dropIndex(indexName);

    return indexResult;
  }
}
