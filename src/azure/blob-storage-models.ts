import { PageSettings } from '@azure/core-paging';
import {
  Metadata,
  ListBlobsHierarchySegmentResponse
} from '@azure/storage-blob';

export {
  Metadata,
  ListBlobsHierarchySegmentResponse
} from '@azure/storage-blob';
export { PageSettings };

export type StorageResponse = {
  succeeded?: boolean;
  error: string | number | undefined;
  metadata?: Metadata | undefined;
};

export type BlobResponse = {
  json?: Record<string, unknown> | undefined;
  text?: string | undefined;
  blobUrl: string;
  buffer?: Buffer;
} & StorageResponse;

export type BlobPageResponse = {
  page: ListBlobsHierarchySegmentResponse;
} & StorageResponse;

export type HierarchicalListingResponse = {
  serviceEndpoint: string | undefined;
  container: string;
  prefix: string;
  delimiter: string;
  pageSettings: PageSettings;
  subDirectoryNames: string[] | undefined;
  blobNames: string[] | undefined;
  error: string | number | undefined | Error;
};

export type ContainerResponse = {
  json?: Record<string, unknown> | undefined;
  text?: string | undefined;
  containerName: string;
} & StorageResponse;
