import { test, expect, describe } from '@jest/globals';
import type { NostrEvent } from '@nostr-dev-kit/ndk';

import { getUrlTag, groupByTag } from './events';

type ObjectWithTags = Pick<NostrEvent, 'tags'>;

describe('events', () => {
  test('find url in event', () => {
    const eventWithUrl = {
      created_at: 1698326278,
      content:
        'nostr:note1whxfpqukvkv3l20td8c0a5kxrv8are7j3kptzkk4def0ta9g0a2q73k0cm\n' +
        'So true! ',
      tags: [
        [
          'q',
          '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
          'quote'
        ],
        ['k', '9802'],
        [
          'r',
          'https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9'
        ],
        [
          'e',
          '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
          '',
          'mention'
        ]
      ],
      kind: 1,
      pubkey:
        '1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411',
      id: 'd7d6ce518f2e1b21067c02c525a68ed08d99c182ab5241974cb03e630c1b29ff',
      sig: 'd2767337c33ff818da12068779d514931eb3335a4fa5f338c720766d7e797c9b0fe23a8ddf0d6623413f80f5b747092952bceb224ca1ae109539fce04399a2aa'
    };

    expect(getUrlTag(eventWithUrl)).toBe(
      'https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9'
    );
  });

  test('group events by tag', () => {
    const eventsArr: ObjectWithTags[] = [
      {
        tags: [
          [
            'q',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            'quote'
          ],
          ['k', '9802'],
          ['r', 'https://url1.co'],
          [
            'e',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            '',
            'mention'
          ]
        ]
      },
      {
        tags: [
          [
            'q',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            'quote'
          ],
          ['k', '9802'],
          ['r', 'https://url1.co'],
          [
            'e',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            '',
            'mention'
          ]
        ]
      },
      {
        tags: [
          [
            'q',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            'quote'
          ],
          ['k', '9802'],
          ['r', 'https://url1.co'],
          [
            'e',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            '',
            'mention'
          ]
        ]
      },
      {
        tags: [
          [
            'q',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            'quote'
          ],
          ['k', '9802'],
          ['r', 'https://url2.co'],
          [
            'e',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            '',
            'mention'
          ]
        ]
      },
      {
        tags: [
          [
            'q',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            'quote'
          ],
          ['k', '9802'],
          [
            'e',
            '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
            '',
            'mention'
          ]
        ]
      }
    ];

    const grouped = groupByTag(eventsArr, 'r');

    expect(
      Object.entries(grouped).map(([url, group]) => ({ [url]: group.length }))
    ).toEqual([
      { 'https://url1.co': 3 },
      { 'https://url2.co': 1 },
      { unmatched: 1 }
    ]);
  });
});
