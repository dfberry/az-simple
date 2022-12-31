import {
  BlobDeleteOptions,
  BlobDownloadResponseParsed,
  BlobServiceClient,
  BlockBlobClient,
  BlockBlobUploadOptions,
  BlockBlobUploadResponse,
  BlockBlobUploadStreamOptions,
  ContainerCreateOptions,
  ContainerDeleteResponse,
  PublicAccessType,
  StorageSharedKeyCredential,
  Tags,
  BlobPrefix
} from '@azure/storage-blob';
import internal, { Transform } from 'stream';
import { streamToBuffer } from '../shared/streams';

import {
  Metadata,
  PageSettings,
  BlobResponse,
  HierarchicalListingResponse,
  ContainerResponse
} from './blob-storage-models';

export class BlobStorage {
  storageAccountName: string;
  storageAccountKey: string;
  credential: StorageSharedKeyCredential | undefined;

  constructor(storageName: string, storageKey: string) {
    this.storageAccountName = storageName;
    this.storageAccountKey = storageKey;

    // Create credential
    this.credential = new StorageSharedKeyCredential(
      this.storageAccountName,
      this.storageAccountKey
    );
  }

  async createContainer(
    containerName: string,
    metadata?: Metadata,
    access?: PublicAccessType
  ): Promise<ContainerResponse> {
    const baseUrl = `https://${this.storageAccountName}.blob.core.windows.net`;
    const blobServiceClient = new BlobServiceClient(
      `${baseUrl}`,
      this.credential
    );
    const containerClient = await blobServiceClient.getContainerClient(
      containerName
    );

    const options: ContainerCreateOptions = {
      metadata,
      access
    };

    const { succeeded, errorCode } = await containerClient.createIfNotExists(
      options
    );
    return { containerName, succeeded, error: errorCode, metadata };
  }
  async deleteContainer(containerName: string): Promise<ContainerResponse> {
    const baseUrl = `https://${this.storageAccountName}.blob.core.windows.net`;
    const blobServiceClient = new BlobServiceClient(
      `${baseUrl}`,
      this.credential
    );
    const containerClient = await blobServiceClient.getContainerClient(
      containerName
    );

    // Transaction lock handled with ModificationConditions: ifUnmodifiedSince?
    //const options: ContainerDeleteMethodOptions;

    // deleted during garbage collection
    const containerDeleteResponse: ContainerDeleteResponse =
      await containerClient.delete();
    return { containerName, error: containerDeleteResponse.errorCode };
  }
  /**
   * Listing results includes the required information to build a blobUrl to fetch the blob contents or further walk the dir structure.
   *
   * Assume hierarchical directories - requires Gen 2 storage (hierarchical namespaces). You must page a continuation
   * token in the pageSettings to get any page other than the first page.
   * @param containerName - Container to list
   * @param pageSettings - do not pass continuationToken if it is empty or has no value, maxPageSize defaults to 10
   * @param prefixStr - Set to empty for top level dir, set to '/' for subdir, set to 'subdir/' for specific subdir, set to char(s) to max subdir or blob
   * @param delimiter - '/'
   * @returns
   *
   * {
   *    serviceEndpoint: `https://YOUR-ACCOUNT-NAME.blob.core.windows.net/`,
   *    container: containerName,
   *    prefix: prefixStr,
   *    delimiter,
   *    pageSettings: { maxPageSize: pageSettings.maxPageSize },
   *    subDirectoryNames: string[],
   *    blobNames: string[],
   *    error: string | number | Error
   * }
   */
  async listBlobsInContainer(
    containerName: string,
    pageSettings: PageSettings = {
      maxPageSize: 10,
      continuationToken: ''
    },
    prefixStr = '',
    delimiter = '/'
  ): Promise<HierarchicalListingResponse> {
    try {
      const baseUrl = `https://${this.storageAccountName}.blob.core.windows.net`;

      const blobServiceClient = new BlobServiceClient(
        `${baseUrl}`,
        this.credential
      );
      const containerClient = await blobServiceClient.getContainerClient(
        containerName
      );

      // verify that container exists
      // note: another client could remove or replace container wihtout warning
      const exists = await containerClient.exists();

      if (!exists) {
        return {
          serviceEndpoint: '',
          container: containerName,
          prefix: prefixStr,
          delimiter,
          pageSettings: { maxPageSize: pageSettings.maxPageSize },
          subDirectoryNames: [],
          blobNames: [],
          error: "Container doesn't exist"
        };
      }

      // some options for filtering list
      const listOptions = {
        includeCopy: true,
        includeDeleted: true,
        includeMetadata: true,
        includeUncommitedBlobs: true,
        prefix: prefixStr
      };

      // fix page size
      if (
        pageSettings.maxPageSize === undefined ||
        pageSettings.maxPageSize === 0 ||
        pageSettings.maxPageSize > 100
      ) {
        pageSettings.maxPageSize = 10;
      }

      // Don't pass empty continuation token,
      // it will return no results
      if (
        pageSettings.continuationToken === '' ||
        pageSettings.continuationToken === undefined ||
        pageSettings.continuationToken === null
      ) {
        delete pageSettings.continuationToken;
      }

      if (delimiter === '') {
        return {
          serviceEndpoint: '',
          container: containerName,
          prefix: prefixStr,
          delimiter,
          pageSettings: { maxPageSize: pageSettings.maxPageSize },
          subDirectoryNames: [],
          blobNames: [],
          error: 'Delimiter should contain 1 or more characters'
        };
      }

      const iterator = await containerClient
        .listBlobsByHierarchy(delimiter, listOptions)
        .byPage(pageSettings)
        .next();

      const listBlobsByHierarchyResponse = iterator.value;

      if (iterator.value) {
        const subdirNames: string[] =
          listBlobsByHierarchyResponse?.segment?.blobPrefixes.map(
            (blobPrefix: BlobPrefix) => blobPrefix.name
          );
        const blobNames: string[] =
          listBlobsByHierarchyResponse?.segment?.blobItems.map(
            (blobItem: { name: string }) => blobItem?.name as string
          );
        return {
          serviceEndpoint: listBlobsByHierarchyResponse.serviceEndpoint,
          container: listBlobsByHierarchyResponse.containerName,
          prefix: prefixStr,
          delimiter: listBlobsByHierarchyResponse.delimiter,
          pageSettings: {
            maxPageSize: listBlobsByHierarchyResponse.maxPageSize,
            continuationToken: listBlobsByHierarchyResponse.continuationToken
          },
          subDirectoryNames: subdirNames,
          blobNames,
          error: ''
        };
      } else {
        return {
          serviceEndpoint: '',
          container: containerName,
          prefix: prefixStr,
          delimiter,
          pageSettings: { maxPageSize: pageSettings.maxPageSize },
          subDirectoryNames: [],
          blobNames: [],
          error: JSON.stringify(iterator)
        };
      }
    } catch (err) {
      return {
        serviceEndpoint: '',
        container: containerName,
        prefix: prefixStr,
        delimiter,
        pageSettings: { maxPageSize: pageSettings.maxPageSize },
        subDirectoryNames: [],
        blobNames: [],
        error: err as Error
      };
    }
  }

  /**
   * Returns Json from blob. If the stream is empty, return {}
   * @param blobUrl
   * @returns Promise<unknown>
   */
  async getJsonDataFromBlob(blobUrl: string): Promise<BlobResponse> {
    const blockblobClient = new BlockBlobClient(blobUrl, this.credential);

    const downloadResponse: BlobDownloadResponseParsed =
      await blockblobClient.download();

    if (downloadResponse.readableStreamBody) {
      const downloaded = await streamToBuffer(
        downloadResponse.readableStreamBody
      );
      const jsonAsString = downloaded.toString();
      const json = JSON.parse(jsonAsString);

      // TBD: type guard json before returning

      return { blobUrl, json, error: undefined };
    } else {
      return { blobUrl, json: undefined, error: 'no readable stream returned' };
    }
  }

  /**
   * Assumes file contents is utf-8
   * @param containerName
   * @param blobName
   * @param fileContents
   */
  async createBlobFromLocalPath(
    containerName: string,
    blobName: string,
    fileContents: string,
    metadata?: Metadata,
    tags?: Tags
  ): Promise<BlobResponse> {
    const blobUrl = `https://${this.storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`;

    const blockblobClient = new BlockBlobClient(blobUrl, this.credential);

    const uploadOptions: BlockBlobUploadOptions = {
      metadata,
      tags
    };

    // upload file to blob storage
    const uploadResponse: BlockBlobUploadResponse =
      await blockblobClient.upload(
        fileContents,
        fileContents.length,
        uploadOptions
      );

    if (!uploadResponse.errorCode) {
      return {
        blobUrl,
        error: undefined
      };
    } else {
      return {
        blobUrl,
        error: uploadResponse.errorCode
      };
    }
  }

  async createBlobFromReadStream(
    containerName: string,
    blobName: string,
    readableStream: internal.Readable,
    metadata?: Metadata,
    tags?: Tags
  ): Promise<BlobResponse> {
    // Transform stream
    // Reasons to transform:
    // 1. Sanitize the data - remove PII
    // 2. Compress or uncompress
    const myTransform = new Transform({
      transform(chunk, encoding, callback) {
        // see what is in the artificially
        // small chunk
        // eslint-disable-next-line no-console
        console.log(chunk);
        callback(null, chunk);
      },
      decodeStrings: false
    });

    // Size of every buffer allocated, also
    // the block size in the uploaded block blob.
    // Default value is 8MB
    const bufferSize = 4 * 1024 * 1024;

    // Max concurrency indicates the max number of
    // buffers that can be allocated, positive correlation
    // with max uploading concurrency. Default value is 5
    const maxConcurrency = 20;

    // use transform per chunk - only to see chunck
    const transformedReadableStream = readableStream.pipe(myTransform);

    const blobUrl = `https://${this.storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`;

    const blockBlobClient = new BlockBlobClient(blobUrl, this.credential);

    const uploadOptions: BlockBlobUploadStreamOptions = {
      metadata,
      tags
    };

    // Upload stream
    const uploadStreamResponse = await blockBlobClient.uploadStream(
      transformedReadableStream,
      bufferSize,
      maxConcurrency,
      uploadOptions // metadata goes here
    );

    if (uploadStreamResponse.errorCode) {
      return { blobUrl, error: uploadStreamResponse.errorCode };
    } else {
      return { blobUrl, error: undefined };
    }
  }

  /**
   * Assume `utf-8`
   * @param blobUrl
   * @returns
   */
  async getTextFromBlob(blobUrl: string): Promise<BlobResponse> {
    const blockBlobClient = new BlockBlobClient(blobUrl, this.credential);
    const downloadResponse = await blockBlobClient.download();

    if (
      downloadResponse !== undefined &&
      !downloadResponse.errorCode &&
      downloadResponse.readableStreamBody !== undefined
    ) {
      const downloaded: Buffer = await streamToBuffer(
        downloadResponse.readableStreamBody
      );
      return {
        blobUrl,
        error: undefined,
        text: downloaded.toString(),
        metadata: downloadResponse.metadata
      };
    } else {
      return {
        blobUrl,
        error: downloadResponse.errorCode,
        text: undefined,
        metadata: downloadResponse.metadata
      };
    }
  }
  /**
   * Return Buffer of file
   * @param blobUrl
   * @returns
   */
  async getBufferFromBlob(blobUrl: string): Promise<BlobResponse> {
    const blockBlobClient = new BlockBlobClient(blobUrl, this.credential);

    const options = undefined;
    const start = 0;
    const count = undefined; //all

    const downloadResponse = await blockBlobClient.download(
      start,
      count,
      options
    );

    if (
      downloadResponse !== undefined &&
      !downloadResponse.errorCode &&
      downloadResponse.readableStreamBody !== undefined
    ) {
      const downloaded: Buffer = await streamToBuffer(
        downloadResponse.readableStreamBody
      );
      return {
        blobUrl,
        error: undefined,
        buffer: downloaded,
        metadata: downloadResponse.metadata
      };
    } else {
      return {
        blobUrl,
        error: downloadResponse.errorCode,
        buffer: undefined,
        metadata: downloadResponse.metadata
      };
    }
  }
  async deleteBlob(blobUrl: string): Promise<BlobResponse> {
    const blockBlobClient = new BlockBlobClient(blobUrl, this.credential);

    // include: Delete the base blob and all of its snapshots.
    // only: Delete only the blob's snapshots and not the blob itself.
    const options: BlobDeleteOptions = {
      deleteSnapshots: 'include' // or 'only'
    };

    // deleted later during garbage collection
    const deleteBlobResponse = await blockBlobClient.delete(options);

    if (!deleteBlobResponse.errorCode) {
      return { blobUrl, succeeded: true, error: undefined };
    } else {
      return { blobUrl, succeeded: false, error: deleteBlobResponse.errorCode };
    }
  }
}
