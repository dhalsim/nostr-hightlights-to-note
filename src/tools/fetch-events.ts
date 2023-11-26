import 'websocket-polyfill';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { getNDK } from '../relays';
import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { findLatestCreatedAt } from '../utilities';
import { ApplicationType } from '../types';

const parsedArguments = yargs(hideBin(process.argv))
  .option('application-type', {
    describe: 'Type of the application',
    choices: ['Local', 'Remote', 'All'],
    default: 'Local',
    type: 'string',
    demandOption: true // This makes the argument mandatory
  })
  .option('event-id', {
    describe: 'ID of the event',
    type: 'string',
    demandOption: false // Not mandatory
  })
  .option('url', {
    describe: 'URL parameter',
    type: 'string',
    demandOption: false // Not mandatory
  })
  .option('kinds', {
    describe: 'kinds to fetch (seperated by comma if multiple)',
    type: 'string',
    demandOption: false // Not mandatory
  })
  .option('limit', {
    describe: 'limit',
    type: 'number',
    demandOption: false, // Not mandatory,
    default: 10
  })
  .conflicts('event-id', 'url') // Specify that event-id and url are mutually exclusive
  .conflicts('event-id', 'kinds') // Specify that event-id and kinds are mutually exclusive
  .check((arg) => {
    // Check that at least one of event-id, url, kinds is provided
    if (!arg['event-id'] && !arg['url'] && !arg['kinds']) {
      throw new Error('Either --event-id, --url or --kinds must be provided');
    }

    return true; // Tell yargs that the arguments passed the check
  }).argv;

async function application() {
  const argv = await parsedArguments;
  const applicationType = argv.applicationType as ApplicationType;

  const ndk = getNDK(applicationType);
  await ndk.connect(6000);
  console.log('connected to relay');

  const limit = argv['limit'];
  const eventId = argv['event-id'];
  const url = argv['url'];

  const kinds = argv['kinds']
    ? argv['kinds'].split(',').map(parseInt)
    : undefined;

  if (eventId) {
    const event = await ndk.fetchEvent(eventId);

    if (!event) {
      throw new Error('Couldnt fetch event');
    }

    console.log(event.rawEvent());
  } else {
    const filterObject: NDKFilter = {
      limit,
      kinds
    };

    if (url) {
      filterObject['#r'] = [url];
    }

    const events = await ndk.fetchEvents(filterObject);
    const since = findLatestCreatedAt(events);

    console.log('events size', events.size);
    console.log('since', since);

    if (since) {
      filterObject.since = since + 1;
    }

    // subscribe to future events
    const subs = await ndk.subscribe(filterObject);

    subs.on('event', async (event: NDKEvent) => {
      console.log('event subs');

      console.log(event.rawEvent());

      events.add(event);
    });
  }
}

application().catch((err) => console.log(err));
