import {
  QueueClient,
  QueueReceiveMessageResponse,
  StorageSharedKeyCredential
} from '@azure/storage-queue';

import {
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
  ReceivedMessageItem,
  QueueStorageCreateOptions
} from './queue-storage-models';

export class QueueStorage {
  storageAccountName: string;
  storageAccountConnectionStringKey: string;
  queueName: string;
  credential: StorageSharedKeyCredential | undefined;
  queueClient: QueueClient;

  constructor({
    storageAccountName,
    storageAccountConnectionString,
    queueName
  }: QueueStorageCreateOptions) {
    this.storageAccountName = storageAccountName;
    this.storageAccountConnectionStringKey = storageAccountConnectionString;
    this.queueName = queueName;

    this.queueClient = new QueueClient(
      this.storageAccountConnectionStringKey,
      queueName
    );
  }

  // Queue
  async createQueue(): Promise<QueueCreateResponse> {
    const createQueueResponse = await this.queueClient.create();
    return createQueueResponse;
  }

  async propertiesQueue(): Promise<QueueGetPropertiesResponse> {
    const properties = await this.queueClient.getProperties();
    return properties;
  }
  async countMessagesInQueue(): Promise<number | undefined> {
    const properties = await this.queueClient.getProperties();
    return properties.approximateMessagesCount;
  }
  async deleteQueue(): Promise<QueueDeleteResponse> {
    return await this.queueClient.delete();
  }

  // Message
  async sendMessage(message: string): Promise<QueueSendMessageResponse> {
    const sendResponse = await this.queueClient.sendMessage(message);
    return sendResponse;
  }
  async peekMessage(
    options: QueuePeekMessagesOptions
  ): Promise<QueuePeekMessagesResponse> {
    const peekResponse = await this.queueClient.peekMessages(options);
    return peekResponse;
  }
  async receiveMessage(): Promise<ReceivedMessageItem | undefined> {
    const receivedMessages: QueueReceiveMessageResponse =
      await this.queueClient.receiveMessages();

    if (receivedMessages.receivedMessageItems.length == 1) {
      return receivedMessages.receivedMessageItems[0];
    }
    return undefined;
  }
  async updateMessage(
    messageId: string,
    popReceipt: string,
    message?: string | undefined,
    visibilityTimeout?: number | undefined,
    options?: QueueUpdateMessageOptions | undefined
  ): Promise<QueueUpdateMessageResponse> {
    const updateResponse = await this.queueClient.updateMessage(
      messageId,
      popReceipt,
      message as string,
      visibilityTimeout as number,
      options
    );
    return updateResponse;
  }
  async deleteMessage(
    message: ReceivedMessageItem
  ): Promise<MessageIdDeleteResponse> {
    return await this.queueClient.deleteMessage(
      message.messageId,
      message.popReceipt
    );
  }
  async dequeueMessage(): Promise<DequeuedMessageItem | null> {
    const receivedMessages = await this.queueClient.receiveMessages();
    const message = receivedMessages.receivedMessageItems[0];
    if (message && message.messageText) {
      await this.queueClient.deleteMessage(
        message.messageId,
        message.popReceipt
      );
      return message;
    }
    return null;
  }
}
