import { ContentModeratorClient } from '@azure/cognitiveservices-contentmoderator';

import {
  ContentModeratorModels,
  CognitiveServicesCredentials
} from './content-moderation-models';

export class AiContentModeration {
  contentModeratorClient: ContentModeratorClient;

  constructor(contentModeratorKey: string, contentModeratorEndPoint: string) {
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      contentModeratorKey
    );
    this.contentModeratorClient = new ContentModeratorClient(
      cognitiveServiceCredentials,
      contentModeratorEndPoint
    );
  }
  async textModeration(
    contentType: ContentModeratorModels.TextContentType,
    text: string
  ): Promise<ContentModeratorModels.TextModerationScreenTextResponse> {
    const result: ContentModeratorModels.TextModerationScreenTextResponse =
      await this.contentModeratorClient.textModeration.screenText(
        contentType,
        text
      );
    return result;
  }
}
