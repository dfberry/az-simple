* 0.2.15
    * tsconfig additions which required fixes for Event Grid and Translator
        ```
        "useUnknownInCatchVariables": true,
        "noUncheckedIndexedAccess": true
        ```  
    * Storage Queues
    * Docs -> [TypeScript design decisions](./docs/design-typescript.md)
* 0.2.14
    * storage - blob properties
* 0.2.13
    * Event hubs - messaging
* 0.2.12
    * Bing search - service in Marketplace is `Bing Search v7`
* 0.2.11
    * Content moderation for image
* 0.2.10
    * Content moderation for text
* 0.2.9 
    * Added Computer Vision analyze image
* 0.2.8
    * organize types into Models
    * Deprecate direct reference to blob storage models
* 0.2.7
    * storage - readme example of prefix value, PageSettings type
* 0.2.6 - storage - correct return for listing - including prefix and error
* 0.2.5 - storage - fix return 
* 0.2.4 - storage - export types
* 0.2.3 - readme.md
    * fix sample code for list hierarchical blobs in container by page
* 0.2.2 - readme.md
    * fix sample code for list hierarchical blobs in container by page
* 0.2.1 - storage
    * list hierarchical blobs in container by page
* 0.2.0 - storage 
    * upload, download, delete
    * Breaking changes:
        * Blob read as json 
            * Previous version returns JSON
            * Current version return BlobResponse type
            * BlobResponse includes json as property