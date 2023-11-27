import type NDK from '@nostr-dev-kit/ndk';
import { getNDK } from '../relays';

export interface IProfileOpts {
  npub: string;
}

export default async function fetchProfile(ndk: NDK, opts: IProfileOpts) {
  const { npub } = opts;

  const user = ndk.getUser({ npub });
  await user.fetchProfile();

  return user.profile;
}
