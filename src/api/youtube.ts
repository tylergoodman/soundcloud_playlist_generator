import * as qs from 'querystring';
import fetch from 'node-fetch';

import PaginatedFetchStream from '../helpers/PaginatedFetchStream';


let API_KEY: string = null;

export const config = (config: { API_KEY?: string }): void => {
  ({
    API_KEY = API_KEY,
  } = config);
};

export class YouTubeVideoStream extends PaginatedFetchStream<string> {
  private _id: string;

  constructor(id: string) {
    super();
    this._id = id;
  }

  async fetch() {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${qs.stringify({
      playlistId: this._id,
      part: 'snippet',
      key: API_KEY,
      pageToken: this._next_page,
    })}`);
    const json = await res.json<YouTube.PlaylistGet>();
    this._buffer.push(...json.items.map(item => item.snippet.title));
    this._next_page = json.nextPageToken;
  }
}
