import { CosmosClient, Container } from '@azure/cosmos';

export class CosmosDBNoSql {
  client: CosmosClient;

  /***
   * Constructor
   *
   * @param key
   * @param endpoint - Url found in Azure portal
   */
  constructor(key: string, endpoint: string) {
    this.client = new CosmosClient({
      endpoint,
      key
    });
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
    containerName: string
  ): Promise<Container> {
    // Create database
    const { database } = await this.client.databases.createIfNotExists({
      id: databaseName
    });

    // Create container
    const { container } = await database.containers.createIfNotExists({
      id: containerName
    });

    return container;
  }
  /**
   * Return database container from this Cosmos DB resource.
   * @param databaseName
   * @param containerName
   * @returns Container
   */
  async getExistingContainer(
    databaseName: string,
    containerName: string
  ): Promise<Container> {
    const container = await this.client
      .database(databaseName)
      .container(containerName);
    return container;
  }
}
