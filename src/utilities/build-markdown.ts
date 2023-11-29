import { u } from 'unist-builder';
import { unified } from 'unified';
import rs from 'remark-stringify';
import type { NostrEvent } from '@nostr-dev-kit/ndk';

export function buildMarkdownFromEvents(events: NostrEvent[]) {
  const processor = unified().use(rs);

  const markdownList = u('root', [
    u(
      'list',
      { ordered: false },
      events.map((e) => {
        // TODO: load related events and add them as a sub list (recursive?)
        // TODO: add links
        return u('listItem', [u('paragraph', [u('text', e.content)])]);
      })
    )
  ]);

  return processor.stringify(markdownList);
}
