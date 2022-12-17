import { CosmosClient, Database, Container } from '@azure/cosmos';

export class CosmosDBNoSql {
  key: string;
  endpoint: string;
  client: CosmosClient;
  database: Database;
  container: Container;

  /***
   * Constructor
   *
   * @param key
   * @param endpoint - Url found in Azure portal
   */
  constructor(key: string, endpoint: string) {
    this.key = key;
    this.endpoint = endpoint;
    this.client = new CosmosClient({
      key,
      endpoint
    });
    this.database = {} as Database;
    this.container = {} as Container;
  }
  /**
   * Create database and container if they don't exist, returns container.
   * @param databaseName
   * @param containerName
   * @param partitionKey, default = "/modelType"
   * @returns Promise<Container>
   */
  async createNewDatabaseAndContainer(
    databaseName: string,
    containerName: string,
    partitionKey: string
  ): Promise<Container> {
    // Create database
    const { database } = await this.client.databases.createIfNotExists({
      id: databaseName
    });

    // Create container
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
      partitionKey: partitionKey || '/modelType'
    });

    this.database = database;
    this.container = container;

    return container;
  }
  /**
   * Return database container from this Cosmos DB resource.
   * @param databaseName
   * @param containerName
   * @returns Container
   */
  getExistingContainer(databaseName: string, containerName: string): Container {
    return this.client.database(databaseName).container(containerName);
  }
}
