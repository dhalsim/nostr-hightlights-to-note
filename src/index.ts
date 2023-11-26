import 'websocket-polyfill';
import NDK from '@nostr-dev-kit/ndk';

import { getNDK } from './relays';
import { ApplicationType } from './types';
import { stringify, extractLogableEvent, getRelatedEvents } from './utilities';

async function fetchEvents({ limit, ndk }: { limit: number; ndk: NDK }) {
  const events = await ndk.fetchEvents({
    kinds: [9802],
    limit
  });

  for (const event of events) {
    const rawEvent = event.rawEvent();

    console.log('event', stringify(extractLogableEvent(rawEvent)));

    const relatedEvents = await getRelatedEvents(rawEvent, ndk);

    if (relatedEvents.length) {
      console.log(`${relatedEvents.length} Related events`);
    }

    relatedEvents.forEach((re) =>
      console.log(stringify(extractLogableEvent(re)))
    );
  }
}

export async function application(applicationType: ApplicationType) {
  const ndk = getNDK(applicationType);

  await ndk.connect(6000);

  console.log('connected to relays');

  fetchEvents({ limit: 5, ndk });
}

const applicationType: ApplicationType = 'All';

application(applicationType).catch((error) => {
  console.log('Application error', error);
});
