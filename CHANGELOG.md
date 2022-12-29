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