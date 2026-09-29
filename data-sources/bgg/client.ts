import { X2jOptions, XMLParser } from 'fast-xml-parser';
import { URLSearchParams } from 'url';
import _chunk from 'lodash/chunk';

import { Play } from './entities/Play';

export const BASE_URL = 'https://boardgamegeek.com';
export const MAX_RETRY_LIMIT = 6;

export class BGGClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async plays(params: {
    username: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { username, startDate, endDate } = params;

    return this.makeXmlV2Request<{ plays: Play[] }>(
      'plays',
      {
        username,
        mindate: startDate
          ? new Date(startDate).toISOString().slice(0, 10)
          : undefined,
        maxdate: endDate
          ? new Date(endDate).toISOString().slice(0, 10)
          : undefined,
      },
      {
        isArray: (tagName) => tagName === 'player',
      },
    );
  }

  private async makeRequest<TResponse>(path: string): Promise<string> {
    const url = buildUrl(BASE_URL, path);

    let retries = 0;
    while (retries <= MAX_RETRY_LIMIT) {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (response.status === 200) {
        return await response.text();
      }

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      retries += 1;

      const delay = Math.pow(2, retries);
      console.log(
        `Received error code ${response.status}, trying again in ${delay} seconds`,
      );

      await new Promise((resolve) => {
        setTimeout(resolve, 1000 * delay);
      });

      if (retries > MAX_RETRY_LIMIT) {
        throw new Error('Max retry limit reached');
      }
    }

    return '';
  }

  private async makeXmlV1Request<TResponse>(
    path: string,
    params: Record<string, string | undefined> = {},
    parserOptions?: X2jOptions | undefined,
  ): Promise<TResponse> {
    const searchParams = buildSearchParams(params);

    const fullPath = buildUrl('xmlapi', `${path}?${searchParams.toString()}`);
    const response = await this.makeRequest(fullPath);

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      attributeNamePrefix: '',
      ...parserOptions,
    });
    const parsedData = parser.parse(response);

    return parsedData;
  }

  private async makeXmlV2Request<TResponse>(
    path: string,
    params: Record<string, string | undefined> = {},
    parserOptions?: X2jOptions | undefined,
  ): Promise<TResponse> {
    const searchParams = buildSearchParams(params);

    const fullPath = buildUrl('xmlapi2', `${path}?${searchParams.toString()}`);
    const response = await this.makeRequest(fullPath);

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      attributeNamePrefix: '',
      ...parserOptions,
    });
    const parsedData = parser.parse(response);

    return parsedData;
  }
}

const buildUrl = (start: string, end: string) => {
  const normalisedEnd = end.startsWith('/') ? end : `/${end}`;
  return `${start}${normalisedEnd}`;
};

const buildSearchParams = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value);
    }
  });
  return searchParams;
};
