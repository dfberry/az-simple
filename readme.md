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

* Get JSON from blob

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