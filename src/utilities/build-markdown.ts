import { u } from 'unist-builder';
import { unified } from 'unified';
import rs from 'remark-stringify';
import type { NostrEvent } from '@nostr-dev-kit/ndk';
import type { Root } from 'mdast';

import { groupByTag } from '.';

export function convertEventsToMarkdown(events: NostrEvent[]) {
  // group by url
  const groupedEvents = groupByTag(events, 'r');
  const mdas = createMdastFromEventEnties(groupedEvents);

  return stringifyUnifiedMarkdown(mdas);
}

type GroupedEvents = {
  [groupName: string]: NostrEvent[];
};

export function createMdastFromEventEnties(groupedEvemts: GroupedEvents): Root {
  const listItems = Object.entries(groupedEvemts).map(([url, events]) => {
    const children = events.map((e) =>
      u('listItem', [u('paragraph', [u('text', e.content)])])
    );

    return u('listItem', [
      u('paragraph', [u('text', url)]),
      u('list', { ordered: false }, children)
    ]);
  });

  return u('root', [u('list', { ordered: false }, listItems)]);
}

export function stringifyUnifiedMarkdown(mdast: Root) {
  const processor = unified().use(rs);

  return processor.stringify(mdast).replaceAll('\n\n', '\n');
}
