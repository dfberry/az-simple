import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';
import {
  TranslatorTextClient,
  TranslatorTextModels
} from '@azure/cognitiveservices-translatortext';

export class AiTranslator {
  client: TranslatorTextClient;

  /***
   * Constructor
   *
   * @param key - TranslatorText key in Global region
   * @param endpoint - Url found in Azure portal
   */
  constructor(key: string, endpoint: string) {
    const creds = new CognitiveServicesCredentials(key);
    this.client = new TranslatorTextClient(creds, endpoint, {
      withCredentials: true
    });
  }

  convertTranslationToStringArray(
    translationResults: TranslatorTextModels.TranslatorTranslateResponse,
    pickStart = 0
  ): string[] {
    // return original if wasn't translated
    if (!translationResults || translationResults.length === 0) return [];

    // Get translated values out of returned object
    const translatedList: string[] =
      translationResults.slice(pickStart).map((item) => {
        if (
          item?.translations &&
          item?.translations.length > 0 &&
          item?.translations[0] &&
          item?.translations[0]?.text
        ) {
          return item?.translations?.[0].text as string;
        } else {
          return '';
        }
      }) || [];

    return translatedList;
  }

  /***
   * Translate an array of strings from one language to another
   *
   * @param toLanguage - "en", "es", "fr", etc
   * @param fromLanguage - same format as toLanguage
   * @returns Promise<TranslatorTextModels.TranslatorTranslateResponse>
   */
  async getTranslation(
    toLanguage: string,
    fromLanguage: string,
    stringList: string[]
  ): Promise<unknown> {
    if (!this.client) throw new Error('Client not constructed correctly');

    const formattedItems = stringList.map((textItem): { text: string } => ({
      text: textItem
    }));

    const rawList = await this.client.translator.translate(
      [toLanguage],
      formattedItems,
      { from: fromLanguage }
    );
    if (!rawList) return [];

    const simpleList = this.convertTranslationToStringArray(rawList);
    return simpleList;
  }
}
