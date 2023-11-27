import { NDKKind, NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import type { NostrEvent } from '@nostr-dev-kit/ndk';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';

import { getNDK } from './relays';

async function publish() {
  const sk = process.env.SECRET || generatePrivateKey(); // `sk` is a hex string
  const pk = getPublicKey(sk); // `pk` is a hex string

  const nostrEvent: NostrEvent = {
    kind: NDKKind.Highlight,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: 'Mellow!!',
    pubkey: pk
  };

  const ndk = getNDK('Local', new NDKPrivateKeySigner(sk));

  await ndk.connect(6000);
  console.log('connected to relays');

  const event = new NDKEvent(ndk, nostrEvent);

  await event.publish();

  console.log('event is published', event.id);
}

publish().catch((error) => {
  console.log('what! ', error);
});
