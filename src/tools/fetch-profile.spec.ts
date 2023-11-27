import { test, expect, describe } from '@jest/globals';

import fetchProfile from './fetch-profile';
import { getNDK } from '../relays';

describe('fetch profile', () => {
  test('fetch profile using npub', async () => {
    const ndk = getNDK('Remote');
    await ndk.connect(2000);

    const profile = await fetchProfile(ndk, {
      npub: 'npub1a2cww4kn9wqte4ry70vyfwqyqvpswksna27rtxd8vty6c74era8sdcw83a'
    });

    expect(profile!.displayName).toBe('Lyn Alden');
  });
});
