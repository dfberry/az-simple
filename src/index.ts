export { MongoCredentials } from 'mongodb';

export { BlobStorage } from './azure/blob-storage';
export { MongoDb } from './mongodb/mongodb';
export { KeyVaultSecret } from './azure/key-vault-secret';
export { AiTranslator } from './azure/translator';
export { AiVision } from './azure/computer-vision';
export { CosmosDBNoSql } from './azure/cosmos-db-nosql';
export { AiContentModeration } from './azure/content-moderation';

// Backwards compatibility
/**
 * @deprecated Don't reference Blob models directly. Use the BlobStorageModels object.
 */
export * from './azure/blob-storage-models';

// Models only
export * as BlobStorageModels from './azure/blob-storage-models';
export * as AiVisionModels from './azure/computer-vision-models';
export * as AiContentModerationModels from './azure/content-moderation';
