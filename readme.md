# Azure-sample

Simple classes to access Azure services. 

Use these services from a server only. These services use secrets that should be protected and not passed or exposed on a client. 

## Services

### Blob Storage

Azure Blob Storage service

* [Documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/)

#### Prerequisites

* Key
* Endpoint

#### Abilities

* Containers: 
    * Create if not exists
    * Delete (includes all snapshots)
* Blobs: 
    * Get blob
        * As Json
        * As text
        * As Buffer
    * Upload blob
        * From local file
        * From readable stream
    * Delete blob
    * List blobs in container by page

        ```javascript
        import {
        BlobServiceClient,
        StorageSharedKeyCredential,
        } from "@azure/storage-blob";
        import * as dotenv from "dotenv";
        dotenv.config();

        export async function listBlobs(
        containerName: string,
        prefixToFilterWith: string = ""
        ) {
            const storAccountName = process.env.AZURE_BLOB_STORAGE_ACCOUNT_NAME;
            const storAccountKey = process.env.AZURE_BLOB_STORAGE_ACCOUNT_KEY;

            const baseUrl = `https://${storAccountName}.blob.core.windows.net`;

            // Create credential
            const credential = new StorageSharedKeyCredential(
                storAccountName as string,
                storAccountKey as string
            );

            // Create Azure serivce client
            const blobServiceClient = new BlobServiceClient(`${baseUrl}`, credential);

            // Create Azure container client
            const containerClient = await blobServiceClient.getContainerClient(
                containerName
            );

            const delimiter = "/";
            const listOptions = {
                includeCopy: true,
                includeDeleted: true,
                includeMetadata: true,
                includeUncommitedBlobs: true,
                prefix: prefixToFilterWith,
            };

            // Only pass `continuationToken` if it has a value (no empty strings)
            // Ex: const pageSettings = { maxPageSize: 10, continuationToken: `STRING-RETURNED-FROM-PREVIOUS-PAGE` };
            const pageSettings = { maxPageSize: 10 };

            // Get Async Iterator
            const iteration = await containerClient
                .listBlobsByHierarchy(delimiter, listOptions)
                .byPage(pageSettings)
                .next();

            // Get value (results) of iterator
            const result = iteration.value;

            // shape of result
            // export type HierarchicalListingResponse = {
            //   serviceEndpoint: string | undefined;
            //   container: string;
            //   prefix: string;
            //   delimiter: string;
            //   pageSettings: PageSettings;
            //   subDirectoryNames: string[] | undefined;
            //   blobNames: string[] | undefined;
            //   error: string | number | undefined | Error;
            // };
            if (result) {
                console.log(`${JSON.stringify(result)}`);
            } else {
                console.log(`no result returned`);
            }
        }
        ```

### Cosmos DB (NoSql)

Azure Cosmos DB NoSql

* [Documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/)

#### Prerequisites

* Key
* Endpoint

#### Abilities

* Create new database & container
* Get existing container

### Key Vault

Azure Key Vault

* [Documentation for Secrets](https://learn.microsoft.com/en-us/azure/key-vault/secrets/)

#### Prerequisites

1. Create an access policy for your key vault that grants secret permissions to your user account with the az keyvault set-policy command.

    ```
    az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --secret-permissions delete get list set purge
    ```
1. Configure @azure/identity credential setup.

#### Authentication

* DefaultAzureCredential - you must provide environment mechanism to authenticate such as environment variables

#### Abilities

* Secrets: Get, set, delete 

### MongoDb

Use this to access [Cosmos DB for Mongo API](https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/)

#### Prerequisites

* Account name
* Account key

#### Abilities

* Get blob as JSON

### Translator

Azure Cognitive Service Translator Text

* [Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/text-translation-overview)

#### Prerequisites

Create the key in the `Global` region.

* Key
* Endpoint

#### Abilities

* Get translation - translate array of strings from one language to another