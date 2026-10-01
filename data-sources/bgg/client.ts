import { X2jOptions, XMLParser } from 'fast-xml-parser';
import { URLSearchParams } from 'url';
import _chunk from 'lodash/chunk';

import { Play } from './entities/Play';
import { PlaysResponse } from './responses/plays';
import { Game } from './entities/Game';
import { GamesResponse } from './responses/games';

export const BASE_URL = 'https://boardgamegeek.com';
export const MAX_RETRY_LIMIT = 6;

export class BGGClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async games(params: { gameIds: number[] }) {
    const { gameIds } = params;

    const games: Game[] = [];
    const chunks = _chunk(gameIds, 20);

    for (let chunk of chunks) {
      const searchParams = {
        id: chunk.join(','),
        thing: 'boardgame',
      };

      const response = await this.makeXmlV2Request<GamesResponse>(
        'thing',
        searchParams,
        {
          isArray: (tagName) => ['item', 'name'].includes(tagName),
        },
      );

      if (!response) {
        throw new Error('No data returned from BGG');
      }

      response.items.item.forEach((game) => {
        games.push(game);
      });
    }

    return games;
  }

  public async plays(params: {
    username: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { username, startDate, endDate } = params;

    const searchParams = {
      username,
      mindate: startDate
        ? new Date(startDate).toISOString().slice(0, 10)
        : undefined,
      maxdate: endDate
        ? new Date(endDate).toISOString().slice(0, 10)
        : undefined,
    };

    const initialResult = await this.makeXmlV2Request<PlaysResponse>(
      'plays',
      searchParams,
      {
        isArray: (tagName) => tagName === 'player',
      },
    );

    const { play: plays, total } = initialResult.plays;

    const pages = Math.ceil(total / 100);
    for (let page = 2; page <= pages; page++) {
      const nextResult = await this.makeXmlV2Request<PlaysResponse>(
        'plays',
        {
          ...searchParams,
          page: page.toString(),
        },
        {
          isArray: (tagName) => tagName === 'player',
        },
      );

      nextResult.plays.play.forEach((play) => plays.push(play));
    }

    return plays;
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
