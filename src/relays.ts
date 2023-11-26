import NDK, { NDKSigner } from '@nostr-dev-kit/ndk';

import { ApplicationType } from './types';
import { assertNever } from './utilities';

// TODO: move it to config or dotenv
const localRelayPort = 8008;

const devWriteRelays = [`ws://localhost:${localRelayPort}`];

const globalReadRelays = [
  'wss://purplepag.es',
  'ws://localhost:8008',
  'wss://nos.lol',
  'wss://relay.f7z.io',
  'wss://relay.damus.io',
  'wss://nostr.mom',
  'wss://nostr.terminus.money',
  'wss://atlas.nostr.land/',
  'wss://offchain.pub/'
];

const allRelays = devWriteRelays.concat(globalReadRelays);

function getRelaysForApplication(type: ApplicationType): string[] {
  switch (type) {
    case 'Local':
      return devWriteRelays;
    case 'Remote':
      return globalReadRelays;
    case 'All':
      return allRelays;
    default:
      return assertNever(type);
  }
}

export function getNDK(type: ApplicationType, signer?: NDKSigner) {
  const relays = getRelaysForApplication(type);

  return new NDK({
    explicitRelayUrls: relays,
    signer
  });
}
