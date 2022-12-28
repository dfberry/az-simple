* 0.2.0 - storage 
    * upload, download, delete
    * Breaking changes:
        * Blob read as json 
            * Previous version returns JSON
            * Current version return BlobResponse type
            * BlobResponse includes json as property