import { u } from 'unist-builder';
import { unified } from 'unified';
import rs from 'remark-stringify';
import { NostrEvent } from '@nostr-dev-kit/ndk';

export async function buildMarkdownFromEvents(events: NostrEvent[]) {
  const processor = unified().use(rs);

  const markdownList = u('root', [
    u(
      'list',
      { ordered: false },
      events.map((e) => u('listItem', [u('paragraph', [u('text', e.content)])]))
    )
  ]);

  return processor.stringify(markdownList);
}
