import {
  EventHubProducerClient,
  EventDataBatch,
  EventHubConsumerClient,
  earliestEventPosition
} from '@azure/event-hubs';
import { ContainerClient } from '@azure/storage-blob';
import { BlobCheckpointStore } from '@azure/eventhubs-checkpointstore-blob';

import {
  EventData,
  ReceivedEventData,
  MessagingError
} from './event-hubs-models';

export class EventHubs {
  eventHubName: string;

  /***
   * Constructor
   *
   * @param key - TranslatorText key in Global region
   * @param endpoint - Url found in Azure portal
   */
  constructor(eventHubName: string) {
    this.eventHubName = eventHubName;
  }
  /**
   * Connection is opened, events are sent then the connection is closed.
   * @param eventHubConnectionString
   * @param data [{ body: 'First event'},{body: 'Second event'},{body: 'Third event'}]
   * @returns void
   */
  async sendBatch(
    eventHubConnectionString: string,
    data: EventData[]
  ): Promise<void | Error | MessagingError> {
    const producer = new EventHubProducerClient(
      eventHubConnectionString,
      this.eventHubName
    );
    const batch: EventDataBatch = await producer.createBatch();
    data.map((eventData: EventData) => batch.tryAdd(eventData));
    await producer.sendBatch(batch);
    await producer.close();
  }
  /**
   * Connection is opened, events are received, then connection is closed.
   * @param eventHubConnectionString
   * @param storageConnectionString
   * @param storageContainerName
   * @param consumerGroup '$default'
   * @param endProcessingInMilliseconds 30000
   * @returns
   */
  async receiveBatch(
    eventHubConnectionString: string,
    storageConnectionString: string,
    storageContainerName: string,
    consumerGroup = '$default',
    endProcessingInMilliseconds = 30000
  ): Promise<ReceivedEventData[] | Error | MessagingError> {
    // Create a blob container client and a blob checkpoint store using the client.
    const containerClient = new ContainerClient(
      storageConnectionString,
      storageContainerName
    );
    const checkpointStore = new BlobCheckpointStore(containerClient);

    // Create a consumer client for the event hub by specifying the checkpoint store.
    const consumerClient = new EventHubConsumerClient(
      consumerGroup,
      eventHubConnectionString,
      this.eventHubName,
      checkpointStore
    );

    const eventData: ReceivedEventData[] = [];

    // Subscribe to the events, and specify handlers for processing the events and errors.
    const subscription = consumerClient.subscribe(
      {
        processEvents: async (events, context) => {
          eventData.push(...events);

          // Update the checkpoint.
          await context.updateCheckpoint(events[events.length - 1]);
        },

        processError: async (err) => {
          throw err;
        }
      },
      { startPosition: earliestEventPosition }
    );

    // After 30 seconds, stop processing.
    return await new Promise((resolve) => {
      setTimeout(async () => {
        await subscription.close();
        await consumerClient.close();
        resolve(eventData);
      }, endProcessingInMilliseconds);
    });
  }
}
