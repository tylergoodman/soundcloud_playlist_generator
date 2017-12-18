import * as qs from 'querystring';
import fetch from 'node-fetch';


const BASE_URL = 'https://api-v2.soundcloud.com';
const CLIENT_ID = 'udhBknYk0jKsVWN82GrnoxlUvCRxZUbH';
let TOKEN: string = null;

export const config = (config: { TOKEN?: string }): void => {
  ({
    TOKEN = TOKEN,
  } = config);
};

export const search = async (term: string): Promise<SoundCloud.SearchResult> => {
  const res = await fetch(`${BASE_URL}/search?${qs.stringify({
    q: term,
    client_id: CLIENT_ID,
  })}`);

  const results = await res.json<SoundCloud.SearchResult>();

  return results;
};

export const playlist_get = async (name: string): Promise<SoundCloud.PlaylistGet> => {
  let playlist: SoundCloud.PlaylistGetList.Playlist = null;
  let url = `${BASE_URL}/users/233852202/playlists_without_albums`;
  while (!playlist) {
    const res = await fetch(url, {
      headers: {
        Authorization: `OAuth ${TOKEN}`,
      },
    });
    const json = await res.json<SoundCloud.PlaylistGetList>();
    playlist = json.collection.find(playlist => playlist.title === name);
    url = json.next_href;
    if (!playlist && !url) {
      throw new Error(`Couldn't find playlist "${name}"`);
    }
  }
  const res = await fetch(`${BASE_URL}/playlists/${playlist.id}`, {
    headers: {
      Authorization: `OAuth ${TOKEN}`,
    },
  });
  const json = await res.json<SoundCloud.PlaylistGet>();
  return json;
};

export const playlist_create = async (name: string): Promise<SoundCloud.PlaylistCreate> => {
  const res = await fetch(`${BASE_URL}/playlists?${qs.stringify({
    client_id: CLIENT_ID,
  })}`, {
    method: 'POST',
    headers: {
      Authorization: `OAuth ${TOKEN}`,
    },
    body: JSON.stringify({
      sharing: 'private',
      title: name,
    }),
  });
  const json = await res.json<SoundCloud.PlaylistCreate>();
  return json;
};

export const playlist_add = async (playlist: SoundCloud.PlaylistGet | SoundCloud.PlaylistCreate, track_id: number) => {
  playlist.tracks.push({ id: track_id });
  await fetch(`${BASE_URL}/playlists/${playlist.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `OAuth ${TOKEN}`,
    },
    body: JSON.stringify({
      tracks: playlist.tracks.map(track => track.id),
    }),
  });
  return playlist;
};
