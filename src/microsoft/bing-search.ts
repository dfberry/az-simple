import fetch from 'node-fetch';
import querystring from 'querystring';

export class BingSearchV7 {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  /**
   * If no `q` (query) is found in queryParams, q defaults to `Microsoft`.
   *
   * @param endpoint, example: `https://api.bing.microsoft.com/v7.0/news/search`
   * @param queryParameters - https://learn.microsoft.com/bing/search-apis/bing-news-search/reference/query-parameters
   * @param queryParameters.count = # of results
   * @param queryParamsObj.q = query
   */
  async searchNews(
    endpoint: string,
    queryParamsObj: Record<string, number | string | undefined>
  ) {
    if (!endpoint) {
      throw new Error('no endpoint found');
    }

    const httpOptions = {
      method: 'GET',
      headers: { 'Ocp-Apim-Subscription-Key': this.key }
    };

    const response = await fetch(
      `${endpoint}?${querystring.stringify(queryParamsObj)}`,
      httpOptions
    );

    const data = await response.json();

    return data;
  }
}
