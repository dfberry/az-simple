import {
  StorageSharedKeyCredential,
  BlockBlobClient,
  BlobDownloadResponseParsed
} from '@azure/storage-blob';
import { streamToBuffer } from '../shared/streams';

/**
 * Works with BlockBlobs.
 */
export class BlobStorage {
  storageAccountName: string;
  storageAccountKey: string;
  credential: StorageSharedKeyCredential | undefined;
  client: BlockBlobClient | undefined;

  constructor(storageName: string, storageKey: string) {
    this.storageAccountName = storageName;
    this.storageAccountKey = storageKey;

    // Create credential
    this.credential = new StorageSharedKeyCredential(
      this.storageAccountName,
      this.storageAccountKey
    );
  }
  /**
   * Returns Json from blob. If the stream is empty, return {}
   * @param blobUrl
   * @returns Promise<unknown>
   */
  async getJsonDataFromBlob(blobUrl: string): Promise<unknown> {
    const client = new BlockBlobClient(blobUrl, this.credential);

    const downloadResponse: BlobDownloadResponseParsed =
      await client.download();

    if (downloadResponse.readableStreamBody) {
      const downloaded = await streamToBuffer(
        downloadResponse.readableStreamBody
      );
      const jsonAsString = downloaded.toString();
      const json = JSON.parse(jsonAsString);

      // TBD: type guard json before returning

      return json;
    }

    return {};
  }
}
