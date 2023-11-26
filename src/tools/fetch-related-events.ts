import 'websocket-polyfill';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

import { getNDK } from '../relays';
import { NDKEvent } from '@nostr-dev-kit/ndk';

const argv = yargs(hideBin(process.argv)).option('event-id', {
  describe: 'ID of the event',
  type: 'string',
  demandOption: true,
}).argv;

async function application() {
  const ndk = getNDK('Remote');

  const eventId = argv['event-id'];

  const subs = ndk.subscribe({
    ['#e']: eventId,
  });

  console.log(`Listing related events to ${eventId}`);

  subs.on('event', async (event: NDKEvent) => {
    console.log(event.rawEvent());
  });
}

application().catch((error) => console.log(error));
