export {
  DequeuedMessageItem,
  MessageIdDeleteResponse,
  QueueCreateResponse,
  QueueDeleteResponse,
  QueueGetPropertiesResponse,
  QueuePeekMessagesOptions,
  QueuePeekMessagesResponse,
  QueueSendMessageResponse,
  QueueUpdateMessageOptions,
  QueueUpdateMessageResponse,
  ReceivedMessageItem
} from '@azure/storage-queue';

export type QueueStorageCreateOptions = {
  storageAccountName: string;
  storageAccountConnectionString: string;
  queueName: string;
};
