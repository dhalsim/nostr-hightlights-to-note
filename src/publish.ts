import 'websocket-polyfill';
import { NDKEvent, NDKPrivateKeySigner, NostrEvent } from '@nostr-dev-kit/ndk';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import { config } from 'dotenv';
import { NDKKind } from '@nostr-dev-kit/ndk';

import { getNDK } from './relays';

config();

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

// import "websocket-polyfill";
// import NDK, { NDKEvent, NDKPrivateKeySigner, NDKKind } from "@nostr-dev-kit/ndk";

// import { config } from "dotenv";

// config();

// const privateKeySigner = new NDKPrivateKeySigner(process.env.SECRET);

// const ndk = new NDK({ signer: privateKeySigner, explicitRelayUrls: [
//   "ws://localhost:8008"
// ]});

// async function connect() {
//   await ndk.connect(30000);

//   console.log('connected to relay');
// }

// async function publishEvent() {
//   const user = await privateKeySigner.user();

//   console.log(
//     "user npub",
//     user.npub
//   )

//   const ndkEvent = new NDKEvent(ndk, {
//     kind: NDKKind.Highlight,
//     content: "Hello, world!1",
//     created_at: Date.now(),
//     tags: [],
//     pubkey: user.pubkey,
//   });

//   ndkEvent.isEphemeral()

//   await ndkEvent.sign();
//   await ndkEvent.publish(undefined, 100000);
// }

// connect().then(publishEvent).catch((error) => {
//   console.log(error);
// })
