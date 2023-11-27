import type NDK from '@nostr-dev-kit/ndk';

import { getNDK } from './relays';
import { stringify, extractLogableEvent, getRelatedEvents } from './utilities';
import type { ApplicationType } from './types';

type FetchEventParams = {
  limit: number;
  ndk: NDK;
  kinds: number[];
};

async function fetchEvents({ limit, ndk, kinds }: FetchEventParams) {
  console.log(`Will fetch for kinds ${kinds}, limit ${limit}`);

  const events = await ndk.fetchEvents({
    kinds,
    limit
  });

  console.log(`${events.size} number of events are fetched`);

  let counter = 0;

  for (const event of events) {
    counter++;

    const rawEvent = event.rawEvent();

    console.log(`${counter}. event`, stringify(extractLogableEvent(rawEvent)));

    const relatedEvents = await getRelatedEvents(rawEvent, ndk);

    if (relatedEvents.length) {
      console.log(
        `${relatedEvents.length} Related events for Event ${counter}`
      );
    }

    relatedEvents.forEach((re, reIndex) =>
      console.log(
        `${reIndex + 1}. Related event`,
        stringify(extractLogableEvent(re))
      )
    );
  }
}

export async function application(applicationType: ApplicationType) {
  console.log(`Application type is set to: ${applicationType}`);

  const ndk = getNDK(applicationType);

  await ndk.connect(6000);

  console.log('connected to relays');

  await fetchEvents({ limit: 5, kinds: [9802], ndk });
}

const applicationType: ApplicationType = 'Remote';

application(applicationType)
  .catch((error) => {
    console.log('Application error', error);
  })
  .then(() => console.log('application run with success'));
