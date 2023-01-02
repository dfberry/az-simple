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

        * Delimiter
            * [Explanation](https://learn.microsoft.com/en-us/rest/api/storageservices/enumerating-blob-resources#DelimitedBlobList)
        * Prefix
            * to search subdirs and files: use string like 's' to search for any that begin with 's'
            * to search subdirs only: use string like 'subdirName/' or 'subdirName/s' 
        * Page settings
            * limit results to small number such as 10
            * add continuationToken value to next query if it is returned from current query 
                * `{ maxPageSize: 10, continuationToken: 'abc' }`

        ```javascript
        import { BlobStorage } from '@azberry/az-simple';
        
        const name = process.env.AZURE_BLOB_STORAGE_ACCOUNT_NAME;
        const key = process.env.AZURE_BLOB_STORAGE_ACCOUNT_KEY;

        const containerName = 'test';               // exact container name
        const prefixStr = 's';                      // subdirs and files that start with 's'
        const delimiter = '/';                      //
        const pageSettings = { maxPageSize: 10 };   // don't pass empty `continuationToken`

        try {
            const client = new BlobStorage(name, key);

            const results = await client.listBlobsInContainer(
            containerName,
            pageSettings,
            prefixStr,
            delimiter
            );

            // shape of results as type HierarchicalListingResponse
            // {
            //   serviceEndpoint: string | undefined;
            //   container: string;
            //   prefix: string;
            //   delimiter: string;
            //   pageSettings: PageSettings;
            //   subDirectoryNames: string[] | undefined;
            //   blobNames: string[] | undefined;
            //   error: string | number | undefined | Error;
            // };

            return results;
        } catch (err) {
            console.log(JSON.stringify(err));
        }
        ```

### Computer Vision as AiVision

Azure Cognitive Services Computer Vision

* [Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/computer-vision)

#### Prerequisites

* Key
* Endpoint

#### Abilities

* Analyze image
            
    ```javascript
    const { AiVision } = require('@azberry/az-simple');
    require('dotenv').config();

    const key = process.env.AZURE_COMPUTER_VISION_KEY;
    const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT;

    async function mytest() {
        const aiVision = new AiVision(key, endpoint);

        const options = {
            visualFeatures: [
            'Categories',
            'Brands',
            'Adult',
            'Color',
            'Description',
            'Faces',
            'Objects',
            'Tags'
            ],
            language: 'en'
        };

        const results = await aiVision.readImage(
            'https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png',
            options
        );

        console.log(results);
    }

    mytest().catch((err) => console.log(err));
    ```

    Example response

    ```json
    {
    "categories":[
        {
            "name":"animal_dog",
            "score":0.99609375
        }
    ],
    "adult":{
        "isAdultContent":false,
        "isRacyContent":false,
        "isGoryContent":false,
        "adultScore":0.0006656277109868824,
        "racyScore":0.001631653867661953,
        "goreScore":0.0007828648085705936
    },
    "color":{
        "dominantColorForeground":"White",
        "dominantColorBackground":"Grey",
        "dominantColors":[
            "Grey",
            "Green"
        ],
        "accentColor":"A36D28",
        "isBWImg":false,
        "isBwImg":false
    },
    "tags":[
        {
            "name":"grass",
            "confidence":0.9957543611526489
        },
        {
            "name":"dog",
            "confidence":0.9939157962799072
        },
        {
            "name":"mammal",
            "confidence":0.9928356409072876
        },
        {
            "name":"animal",
            "confidence":0.9918001890182495
        },
        {
            "name":"dog breed",
            "confidence":0.9890419244766235
        },
        {
            "name":"pet",
            "confidence":0.974603533744812
        },
        {
            "name":"outdoor",
            "confidence":0.969241738319397
        },
        {
            "name":"companion dog",
            "confidence":0.906731367111206
        },
        {
            "name":"small greek domestic dog",
            "confidence":0.8965123891830444
        },
        {
            "name":"golden retriever",
            "confidence":0.8877675533294678
        },
        {
            "name":"labrador retriever",
            "confidence":0.8746421337127686
        },
        {
            "name":"puppy",
            "confidence":0.872604250907898
        },
        {
            "name":"ancient dog breeds",
            "confidence":0.8508287668228149
        },
        {
            "name":"field",
            "confidence":0.8017748594284058
        },
        {
            "name":"retriever",
            "confidence":0.6837497353553772
        },
        {
            "name":"brown",
            "confidence":0.6581960916519165
        }
    ],
    "description":{
        "tags":[
            "grass",
            "dog",
            "outdoor",
            "animal",
            "mammal",
            "laying",
            "tan"
        ],
        "captions":[
            [
                "Object"
            ]
        ]
    },
    "faces":[
        
    ],
    "objects":[
        {
            "rectangle":[
                "Object"
            ],
            "object":"dog",
            "confidence":0.903,
            "parent":[
                "Object"
            ]
        }
    ],
    "brands":[
        
    ],
    "requestId":"97f1e8cc-f07d-4e5b-b11c-13a7d6ddf607",
    "metadata":{
        "width":1295,
        "height":1155,
        "format":"Png"
    },
    "modelVersion":"2021-05-01"
    }   
    ```

### Content moderation as AiContentModeration

Azure Cognitive Services Content Moderation

* [Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/content-moderator/)

#### Prerequisites

* Key
* Endpoint

#### Abilities

* Content moderation for images

    ```javascript
    const { AiContentModeration } = require('@azberry/az-simple');

    async function main() {

        const contentModeratorKey = process.env.AZURE_CONTENT_MODERATION_KEY;
        const contentModeratorEndPoint = process.env.AZURE_CONTENT_MODERATION_ENDPOINT;

        const aiContentModeration = new AiContentModeration(
            contentModeratorKey,
            contentModeratorEndPoint
        );

        const result = await aiContentModeration.imageModeration(
            "https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png"
        );
        console.log(result);
    }

    main();
    ```

Example response

    ```json
    {
        "result":false,
        "trackingId":"0ddfff0e-1b4b-4cd7-a0b4-6e44523b41bd",
        "adultClassificationScore":0.001438833656720817,
        "isImageAdultClassified":false,
        "racyClassificationScore":0.004629917559213936,
        "isImageRacyClassified":false,
        "advancedInfo":[
        {
            "key":"ImageDownloadTimeInMs",
            "value":"1099"
        },
        {
            "key":"ImageSizeInBytes",
            "value":"2278902"
        }
        ],
        "status":{
        "code":3000,
        "description":"OK",
        "exception":null
        }
    }
    ```

* Content moderation for text
            
    ```javascript
    require('dotenv').config();

    const { AiContentModeration } = require('@azberry/az-simple');

    async function main() {
        const contentModeratorKey = process.env.AZURE_CONTENT_MODERATION_KEY;
        const contentModeratorEndPoint = process.env.AZURE_CONTENT_MODERATION_ENDPOINT;

        const aiContentModeration = new AiContentModeration(
            contentModeratorKey,
            contentModeratorEndPoint
        );

        const result = await aiContentModeration.textModeration(
            'text/plain',
            'This is a fuck you to the world'
        );
        console.log(result);
    }

    main();
    ```

    Example response

    ```json
   {
        "originalText":"This is a fuck you to the world",
        "normalizedText":"   fuck you   world",
        "misrepresentation":null,
        "status":{
        "code":3000,
        "description":"OK",
        "exception":null
        },
        "language":"eng",
        "terms":[
        {
            "index":3,
            "originalIndex":10,
            "listId":0,
            "term":"fuck"
        },
        {
            "index":3,
            "originalIndex":10,
            "listId":0,
            "term":"fuck you"
        }
        ],
        "trackingId":"e60eb47f-262d-496c-90bb-8731fddc9a5b"
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