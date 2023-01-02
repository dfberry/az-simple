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
  async imageModeration(
    imageUrl: string
  ): Promise<ContentModeratorModels.ImageModerationEvaluateUrlInputResponse> {
    // Return type? ref docs aren't clear
    const contentType = 'application/json';

    // Default for dataRepresentation is `URL` - what are other choices?
    const imageUrlObject = { value: imageUrl, dataRepresentation: 'URL' };

    const result =
      await this.contentModeratorClient.imageModeration.evaluateUrlInput(
        contentType,
        imageUrlObject
      );
    return result;
  }
}
