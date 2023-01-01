import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import {
  ComputerVisionModels,
  ApiKeyCredentials
} from './computer-vision-models';

export class AiVision {
  imageClient: ComputerVisionClient;

  /***
   * Constructor
   *
   * @param key - TranslatorText key in Global region
   * @param endpoint - Url found in Azure portal
   */
  constructor(key: string, endpoint: string) {
    this.imageClient = new ComputerVisionClient(
      new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
      endpoint
    );
  }
  async readImage(
    url: string,
    options: ComputerVisionModels.ComputerVisionClientAnalyzeImageOptionalParams
  ): Promise<ComputerVisionModels.AnalyzeImageResponse> {
    const analyzeImageResponse = await this.imageClient.analyzeImage(
      url,
      options
    );
    return analyzeImageResponse;
  }
}
