export { MongoCredentials } from 'mongodb';

export { BlobStorage } from './azure/blob-storage';
export { MongoDb } from './mongodb/mongodb';
export { KeyVaultSecret } from './azure/key-vault-secret';
export { AiTranslator } from './azure/translator';
export { CosmosDBNoSql } from './azure/cosmos-db-nosql';

// Backwards compatibility
/**
 * @deprecated Don't reference Blob models directly. Use the BlobStorageModels object.
 */
export * from './azure/blob-storage-models';

// Models only
export * as BlobStorageModels from './azure/blob-storage-models';
