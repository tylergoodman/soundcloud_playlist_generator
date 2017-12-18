import { createReadStream, writeFileSync as writeFile } from 'fs';
import { PassThrough } from 'stream';
import * as inquirer from 'inquirer';
import * as parseArgs from 'minimist';
import * as split from 'split2';

import * as soundcloud from './api/soundcloud';
import * as youtube_api from './api/youtube';


const {
  file,
  spotify,
  youtube,
  token,
  youtube_api_key,
  playlist_name = `spg${Date.now()}`,
  use_existing_playlist = false,
  unresolved_queries_file = 'unresolved_queries.txt',
} = parseArgs(process.argv.slice(2));

if (!file && !spotify && !youtube) {
  process.stdout.write('No input specified\n');
  process.exit(1);
}

soundcloud.config({ TOKEN: token });
youtube_api.config({ API_KEY: youtube_api_key });

let stream = new PassThrough({
  objectMode: true,
  encoding: 'utf8',
});
if (file) {
  stream = createReadStream(file).pipe(split()).pipe(stream);
}
if (youtube) {
  stream = new youtube_api.YouTubeVideoStream(youtube).pipe(stream);
}

let auto_accept_all_search_queries = false;
let auto_accept_all_search_results = false;
const unresolved_queries: string[] = [];
let playlist: SoundCloud.PlaylistCreate | SoundCloud.PlaylistGet = null;



const process_line = async (line: string) => {

  if (!auto_accept_all_search_queries) {
    const { line_decision } = await inquirer.prompt([{
      type: 'expand',
      name: 'line_decision',
      message: `Search for "${line}" ?`,
      default: 'yes',
      choices: [
        {
          key: 'y',
          name: 'Yes',
          value: 'yes',
        },
        {
          key: 'e',
          name: 'Edit',
          value: 'edit',
        },
        {
          key: 's',
          name: 'Skip',
          value: 'skip',
        },
        {
          key: 'x',
          name: 'Yes to all',
          value: 'yes_to_all',
        },
      ],
    }]);

    if (line_decision === 'skip') {
      return;
    }
    if (line_decision === 'edit') {
      const { new_value } = await inquirer.prompt([{
        type: 'editor',
        name: 'new_value',
        message: 'New value:',
        default: line,
      }]);
      line = new_value;
    }
    else if (line_decision === 'yes_to_all') {
      auto_accept_all_search_queries = true;
    }
  }

  process.stdout.write(`Searching SoundCloud for "${line}"...`);
  const search_result = await soundcloud.search(line);
  process.stdout.write('OK.\n');


  if (!search_result.collection.length) {
    const { no_results_decision } = await inquirer.prompt([{
      type: 'expand',
      name: 'no_results_decision',
      message: `No results for search "${line}"`,
      default: 'give_up',
      choices: [
        {
          key: 'r',
          name: 'Restart this search',
          value: 'restart',
        },
        {
          key: 'g',
          name: 'Give up',
          value: 'give_up',
        },
      ],
    }]);
    if (no_results_decision === 'restart') {
      auto_accept_all_search_queries = false;
      await process_line(line);
      return;
    }
    if (no_results_decision === 'give_up') {
      unresolved_queries.push(line);
      return;
    }
  }

  let accepted_result: SoundCloud.Track = null;
  if (auto_accept_all_search_results) {
    accepted_result = search_result.collection[0];
  }
  else {
    const { search_result_decision } = await inquirer.prompt([
      {
        type: 'list',
        name: 'search_result_decision',
        message: `Pick the matching song for "${line}"`,
        default: search_result.collection[0],
        choices: [
          ...search_result.collection.map((track, i) => {
            return {
              name: `"${track.title}" by ${track.user.full_name || track.user.first_name || track.user.username || '?'}`,
              value: String(i),
            };
          }),
          new inquirer.Separator(),
          {
            key: 'g',
            name: 'Give up on this search',
            value: 'give_up',
          },
          {
            key: 'r',
            name: 'Restart this search',
            value: 'restart',
          },
          {
            key: 'x',
            name: 'Automatically select first result for all',
            value: 'yes_to_all',
          },
          new inquirer.Separator(),
        ],
      },
    ]);

    if (search_result_decision === 'restart') {
      auto_accept_all_search_queries = false;
      await process_line(line);
      return;
    }
    if (search_result_decision === 'give_up') {
      unresolved_queries.push(line);
      return;
    }
    if (search_result_decision === 'yes_to_all') {
      auto_accept_all_search_results = true;
      accepted_result = search_result.collection[0];
    }
    else {
      accepted_result = search_result.collection[search_result_decision];
    }
  }

  process.stdout.write(`Adding track "${accepted_result.title}" by ${accepted_result.user.full_name} to playlist "${playlist.title}"...`);
  await soundcloud.playlist_add(playlist, accepted_result.id);
  process.stdout.write('OK.\n');
};

const start = async () => {

  process.stdout.write('Fetching playlist...');
  if (use_existing_playlist) {
    playlist = await soundcloud.playlist_get(use_existing_playlist);
  }
  else {
    playlist = await soundcloud.playlist_create(playlist_name);
  }
  process.stdout.write('OK.\n');
  process.stdout.write(`Using playlist "${playlist.title}" (${playlist.id})\n`);

  let has_ended = false;
  stream
    .on('end', () => has_ended = true)
    .on('data', async (line: string) => {
      stream.pause();
      if (!line) {
        stream.resume();
        return;
      }
      await process_line(line);

      stream.resume();
      if (has_ended && unresolved_queries.length) {
        writeFile(unresolved_queries_file, unresolved_queries);
        process.stdout.write(`Wrote unresolved queries to ${unresolved_queries_file}`);
      }
    })
    ;
};

start();
