import { MongoClient, OptionalId } from 'mongodb';

export class MongoDb {
  connectionString: string;
  databaseName: string;
  collectionName: string;

  constructor(
    connectionString: string,
    databaseName: string,
    collectionName: string
  ) {
    this.connectionString = connectionString;
    this.databaseName = databaseName;
    this.collectionName = collectionName;
  }

  async uploadArrToMongoDb(arrData: OptionalId<Document>[]): Promise<unknown> {
    // Data exists and looks like its in the correct shape

    if (!this.connectionString) throw new Error('connection string if missing');
    if (!this.databaseName) throw new Error('databaseName is missing');
    if (!this.collectionName) throw new Error('collectionName is missing');

    if (!arrData) throw new Error('data is missing');
    if (!arrData?.length || arrData.length === 0)
      throw new Error('data found to be empty');

    const client = new MongoClient(this.connectionString);

    // Use connect method to connect to the server
    await client.connect();

    const insertResult = await client
      .db(this.databaseName)
      .collection(this.collectionName)
      .insertMany(arrData);

    return insertResult;
  }
}
