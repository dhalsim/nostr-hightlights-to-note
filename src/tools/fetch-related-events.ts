import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import type { NDKEvent } from '@nostr-dev-kit/ndk';

import { getNDK } from '../relays';

const parsedArguments = yargs(hideBin(process.argv)).option('event-id', {
  describe: 'ID of the event',
  type: 'string',
  demandOption: true
}).argv;

async function application() {
  const argv = await parsedArguments;
  const ndk = getNDK('Remote');

  const eventId = argv['event-id'];

  const subs = ndk.subscribe({
    ['#e']: [eventId]
  });

  console.log(`Listing related events to ${eventId}`);

  subs.on('event', (event: NDKEvent) => {
    console.log(event.rawEvent());
  });
}

application().catch((error) => console.log(error));
