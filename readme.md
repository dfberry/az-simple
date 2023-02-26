# Azure-sample

Simple classes to access Azure services. 

Use these services from a server only. These services use secrets that should be protected and not passed or exposed on a client. 

## Services

### Bing Search

Bing Search Services

* [Documentation](https://learn.microsoft.com/en-us/bing/search-apis/)
* Create [**Bing Search v7**](https://portal.azure.com/#create/Microsoft.BingSearch) key in Azure portal
#### Prerequisites

* Key
* Endpoint

#### Abilities

* Search - search is based on the endpoint and query parameters

```javascript
const { BingSearchV7 } = require('@azberry/az-simple');
require('dotenv').config();

const key = process.env.MICROSOFT_BING_SEARCH_V7_KEY;
const endpoint = 'https://api.bing.microsoft.com/v7.0/news/search';

async function mytest() {
  const searchService = new BingSearchV7(key);

  const results = await searchService.searchNews(endpoint, {
    q: `Microsoft Space SDK`,
    count: 5,
    sortBy: `Relevance`,    // or `Date`,
    safeSearch: `Strict`,   // or `Moderate` or `Off`
    mkt: 'en-US',
    freshness: `Month`,     // or `Day` or `Week`
    textFormat: `Raw`       // or `HTML`
  });

  console.log(results);
}

mytest().catch((err) => console.log(err));
```

Example response:

```json
[
   {
      "name":"Best match",
      "id":"relevance",
      "isSelected":true,
      "url":"https://api.bing.microsoft.com/api/v7/news/search?q=Microsoft+Space+SDK"
   },
   {
      "name":"Most recent",
      "id":"date",
      "isSelected":false,
      "url":"https://api.bing.microsoft.com/api/v7/news/search?q=Microsoft+Space+SDK&sortby=date"
   }
],
"value":[
   {
      "name":"Google Chrome and Android drop TrustCor support following privacy scare",
      "url":"https://www.msn.com/en-us/news/technology/google-chrome-and-android-drop-trustcor-support-following-privacy-scare/ar-AA15xzTx",
      "image":[
         "Object"
      ],
      "description":"Google has announced that it is set to drop TrustCor Systems as a root certificate authority (CA) for its web browser. The tech giant cited a “loss of confidence in its ability to uphold these fundamental principles and to protect and safeguard Chrome's users” in a group discussion.",
      "about":[
         "Array"
      ],
      "mentions":[
         "Array"
      ],
      "provider":[
         "Array"
      ],
      "datePublished":"2022-12-21T21:15:48.0000000Z",
      "category":"ScienceAndTechnology"
   },
   {
      "name":"Yves Pitsch’s Post",
      "url":"https://www.linkedin.com/feed/update/urn:li:share:6999009834809384960/",
      "description":"Today, Microsoft is excited to announce a crucial step towards democratizing access to space development, with the private preview release of the Azure Orbital Space SDK (Software Development Kit).",
      "provider":[
         "Array"
      ],
      "datePublished":"2022-12-21T02:11:00.0000000Z"
   },
   {
      "name":"Kevin Mack’s Post",
      "url":"https://www.linkedin.com/feed/update/urn:li:activity:6999042796934332416/",
      "description":"Today, Microsoft is excited to announce a crucial step towards democratizing access to space development, with the private preview release of the Azure Orbital Space SDK (Software Development Kit).",
      "provider":[
         "Array"
      ],
      "datePublished":"2022-12-17T22:22:00.0000000Z"
   },
   {
      "name":"What will 2023 hold for the telecoms industry?",
      "url":"https://telecoms.com/519116/what-will-2023-hold-for-the-telecoms-industry/",
      "image":[
         "Object"
      ],
      "description":"It’s that time of year again when we ask some leading lights from the industry to gaze into their crystal balls and take a punt on what we’ll be talking about next year in the world of telecoms.",
      "provider":[
         "Array"
      ],
      "datePublished":"2022-12-23T11:59:00.0000000Z",
      "category":"ScienceAndTechnology"
   }
]
```

### Blob Storage

Azure Blob Storage service - without heirarchical namespaces enabled (so no Data Lake)

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
    * Get blob properties
        * system
        * metadata
        * tags

        ```
        const client = new BlobStorage(AZURE_STORAGE_NAME, AZURE_STORAGE_KEY);

        return await client.getBlobProperties(blobUrl, {
            system: true,
            metadata: true,
            tags: true
        });
        ```

        Example response: 

        ```json
        {
            "system": {
                "lastModified": "2023-01-07T18:16:17.000Z",
                "createdOn": "2023-01-07T18:16:17.000Z",
                "objectReplicationRules": {},
                "blobType": "BlockBlob",
                "leaseState": "available",
                "leaseStatus": "unlocked",
                "contentLength": 202300,
                "contentType": "image/jpeg",
                "etag": "\"0x8DAF0DB4542A49F\"",
                "clientRequestId": "eee498d8-0f25-4307-ac0c-65c0b3869f95",
                "requestId": "8d4c466a-401e-000d-3cce-2264e9000000",
                "version": "2021-10-04",
                "date": "2023-01-07T19:28:47.000Z",
                "acceptRanges": "bytes",
                "isServerEncrypted": true,
                "accessTier": "Hot",
                "accessTierInferred": true,
                "body": true,
                "objectReplicationSourceProperties": []
            },
            "metadata": {},
            "tags": {}
        }
        ```


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

### Event Hubs

#### Prerequisites

To send:

* Event hub namespace name
* Event hub connection string

To receive:

* Event hub namespace name
* Event hub connection string
* Storage connection string
* Storage container name

#### Abilities

* Send bulk messages
* Receive bulk messages

To send or receive individual messages, use an array of 1 item.


##### Send

```javascript
require('dotenv').config();
const { EventHubs } = require('@azberry/az-simple');

async function main() {
    
    const connectionString = process.env.AZURE_EVENT_HUBS_NAMESPACE_CONNECTION_STRING;
    const eventHubName = process.env.AZURE_EVENT_HUB_NAME;
    
    console.log(connectionString);
    console.log(eventHubName);

  const eventHubs = new EventHubs(eventHubName);

  const eventsToSend = [
    { body: 'First event' },
    { body: 'Second event' },
    { body: 'Third event' }
  ];

  await eventHubs.sendBatch(connectionString, eventsToSend);
}

main().catch((err) => console.log(err));
```

A successful call returns no result.

##### Receive

```javascript
require('dotenv').config();
const { EventHubs } = require('@azberry/az-simple');

async function main() {
  const eventHubConnectionString =
    process.env.AZURE_EVENT_HUBS_NAMESPACE_CONNECTION_STRING;
  const eventHubName = process.env.AZURE_EVENT_HUB_NAME;

  const consumerGroup = '$Default';

  const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const storageContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  const endProcessingInMilliseconds = 20000;

  const eventHubs = new EventHubs(eventHubName);

  const eventsReturned = await eventHubs.receiveBatch(
    eventHubConnectionString,
    storageConnectionString,
    storageContainerName,
    consumerGroup,
    endProcessingInMilliseconds
  );

  console.log(JSON.stringify(eventsReturned));
}

main().catch((err) => console.log(err));
```

Example output

```json
[
  {
    "body": "First event",
    "offset": "0",
    "sequenceNumber": 0,
    "enqueuedTimeUtc": "2023-01-05T16:55:17.677Z",
    "systemProperties": {}
  },
  {
    "body": "Second event",
    "offset": "80",
    "sequenceNumber": 1,
    "enqueuedTimeUtc": "2023-01-05T16:55:17.677Z",
    "systemProperties": {}
  },
  {
    "body": "Third event",
    "offset": "160",
    "sequenceNumber": 2,
    "enqueuedTimeUtc": "2023-01-05T16:55:17.677Z",
    "systemProperties": {}
  }
]
```

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

### Azure Cache for Redis

Use this to access [Azure Cache for Redis](https://learn.microsoft.com/en-us/azure/azure-cache-for-redis).

#### Prerequisites

* Host name: `YOUR-AZURE-CACHE-FOR-REDIS-ACCOUNT-NAME.redis.cache.windows.net`
* Password: primary access key
* Port: (default) 6380
* Database: optional, 0-15 (16 possible databases)

#### Abilities

* Connect
* Get current client
* Get status
* Get key
* Get client type
* Get key type
* Set key
* Delete key
* Ping
* Send command
  
```javascript
const { RedisCache } = require('@azberry/az-simple');
const params = {
  host: process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME,
  password: process.env.AZURE_CACHE_FOR_REDIS_ACCESS_KEY,
  port: process.env.AZURE_CACHE_FOR_REDIS_PORT,
  database: 12
};

async function main() {
    const redisCache = new RedisCache(params);
    await redisCache.connect();

    const name1 = 'Dog:001:a';
    const name2 = 'Dog:002:a';
    const name3 = 'Dog:003:a';
    const value = 'Here we go again';

    // PING
    console.log(await redisCache.ping());

    // STATUS: isReady, isOpen, serverTime
    console.log(`status = ${JSON.stringify(await redisCache.status())}`);

    // Set key
    const set1 = await redisCache.set(name1, value);
    console.log(set1);

    // Set Key 
    const set2 = await redisCache.set(name2, value);
    console.log(set2);

    // Get key type: `string`
    const type2 = await redisCache.type(name2);
    console.log(`type: ${type2}`);

    // Set key with short cache time
    const set3 = await redisCache.set(name3, value, 50);
    console.log(set3);

    // DBSize - item count == 3
    const dbSize = await redisCache.sendCommand(['DBSIZE']);
    console.log(`size ${JSON.stringify(dbSize)}`);

    // Delete second item
    const deleteName2 = await redisCache.delete(name2);
    console.log(`delete ${JSON.stringify(deleteName2)}`);

    // DBSize - item count == 2
    const dbSize1 = await redisCache.sendCommand(['DBSIZE']);
    console.log(`size ${JSON.stringify(dbSize1)}`);

    // Get first item: "Here we go again"
    const get1 = await redisCache.get(name1);
    console.log(JSON.stringify(get1));

    // Does first item exist: returns 1
    const doesExist = await redisCache.sendCommand(['EXISTS', name1]);
    console.log(`key 1 exists ${JSON.stringify(doesExist)}`);

    // DBSize - item count - 2
    const dbSize2 = await redisCache.sendCommand(['DBSIZE']);
    console.log(`size ${JSON.stringify(dbSize2)}`);

    // List all keys: ["Dog:001:a","Dog:003:a"]
    const keys = await redisCache.sendCommand(['KEYS', '*']);
    console.log(`list ${JSON.stringify(keys)}`);

    // DBSize - item count - 2 (third item hasn't timed out yet)
    const dbSize3 = await redisCache.sendCommand(['DBSIZE']);
    console.log(`size ${JSON.stringify(dbSize3)}`);

    // Remove keys
    // const flushall = await redisCache.sendCommand(['FLUSHALL']);
    //console.log(`flushall ${JSON.stringify(flushall)}`);

    // Want to do your own thing with redis? 
    const client = redisCache.getCurrentClient();

    // Disconnect with wait
    await redisCache.DisconnectWhenFinished();

    // Disconnect
    await redisCache.disconnectNow();
}
```


### Translator

Azure Cognitive Service Translator Text

* [Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/text-translation-overview)

#### Prerequisites

Create the key in the `Global` region.

* Key
* Endpoint

#### Abilities

* Get translation - translate array of strings from one language to another