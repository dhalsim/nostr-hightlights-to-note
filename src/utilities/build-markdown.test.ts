import { test, expect, describe } from '@jest/globals';
import { u } from 'unist-builder';

import {
  convertEventsToMarkdown,
  stringifyUnifiedMarkdown
} from './build-markdown';

describe('markdown', () => {
  test('create an unordered list from events', async () => {
    const eventsArr = [
      {
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
      },
      {
        created_at: 1693824346,
        content:
          'One of the key differences between Nostr and other social media platforms is its decentralised architecture.',
        tags: [
          [
            'context',
            'One of the key differences between Nostr and other social media platforms is its decentralised architecture. This means that there is no central authority controlling the platform and user data is stored on a network of decentralised servers.'
          ],
          [
            'r',
            'https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9'
          ],
          [
            'alt',
            '"One of the key differences between Nostr and other social media platforms is its decentralised architecture."\n' +
              '\n' +
              'This is a highlight created on https://highlighter.com'
          ]
        ],
        kind: 9802,
        pubkey:
          'b17c59874dc05d7f6ec975bce04770c8b7fa9d37f3ad0096fdb76c9385d68928',
        id: '1027768b3e5e7ca7be7e4361a8bdc554ab9c09b63c75c6f7d7325348cba15eab',
        sig: 'bd6dd11526b51e80ee214fad6f037961e00db533f3db023a4ba9962f761fb13531f883895940d80407b1a81fd2100ed92aa3c9fe328308a1e862b1a774d1c53b'
      },
      {
        created_at: 1693824326,
        content:
          'Nostr places a high emphasis on security and privacy for its users. All data on the platform is encrypted end-to-end and stored on decentralised servers. This means that only the user has control over their data and it is not stored in a central location that can be hacked or monitored.',
        tags: [
          [
            'r',
            'https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9'
          ],
          [
            'alt',
            '"Nostr places a high emphasis on security and privacy for its users. All data on the platform is encrypted end-to-end and stored on decentralised servers. This means that only the user has control over their data and it is not stored in a central location that can be hacked or monitored."\n' +
              '\n' +
              'This is a highlight created on https://highlighter.com'
          ]
        ],
        kind: 9802,
        pubkey:
          'b17c59874dc05d7f6ec975bce04770c8b7fa9d37f3ad0096fdb76c9385d68928',
        id: 'd575fd09a6a90f5b5fbaacb19efb86ea4baebfb04d1415e8f29527a56c65d65f',
        sig: '7ccef4c97f7e91d151ba6dc02722293d730e4d3d3a6044083a2fbb8f3dadddc47a06d5bbe46813541af78446ad59b36c84593d3040f518f796b619bd9a6b243e'
      },
      {
        created_at: 1686003988,
        content:
          'Nostr is designed to be a community-driven platform. It encourages users to connect with others and build relationships, rather than simply posting content for likes and followers.',
        tags: [
          [
            'context',
            'Nostr is designed to be a community-driven platform. It encourages users to connect with others and build relationships, rather than simply posting content for likes and followers. The platform features a range of tools for users to connect and engage with each other, such as forums, chat rooms and groups.'
          ],
          [
            'r',
            'https://medium.com/btc24/nostr-a-decentralised-social-platform-2651930378b9'
          ],
          [
            'alt',
            '"Nostr is designed to be a community-driven platform. It encourages users to connect with others and build relationships, rather than simply posting content for likes and followers."\n' +
              '\n' +
              'This is a highlight created on https://highlighter.com'
          ]
        ],
        kind: 9802,
        pubkey:
          '75bf23531ae9f98c62995ba07191e488ead475975371d63d7dfd46bde1bfa895',
        id: '75cc90839665991fa9eb69f0fed2c61b0fd1e7d28d82b15ad56e52f5f4a87f54',
        sig: '07a8411a498fa30a92354e68b6c088c9e8e936aac29dfd745349ebe1ee1f6d1d58e7c7d1991de4f9c024c10d3618f341083d64ffd34a44b5304122981928a9cd'
      }
    ];

    const markdownText = convertEventsToMarkdown(eventsArr);

    expect(markdownText).toMatchSnapshot();
  });

  test('mdast to markdown convertion', () => {
    const mdast = u('root', [
      u('list', { ordered: false }, [
        u('listItem', [
          u('paragraph', [u('text', 'parent list 1')]),
          u('list', { ordered: false }, [
            u('listItem', [
              u('paragraph', [u('text', 'child A of parent list 1')])
            ]),
            u('listItem', [
              u('paragraph', [u('text', 'child B of parent list 1')])
            ])
          ])
        ]),
        u('listItem', [u('paragraph', [u('text', 'parent list 2')])])
      ])
    ]);

    // * parent list 1
    //   * child A of parent list 1
    //   * child B of parent list 1
    // * parent list 2

    expect(stringifyUnifiedMarkdown(mdast)).toMatchSnapshot();
  });
});
