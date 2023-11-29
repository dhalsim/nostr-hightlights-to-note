import type { NDKTag, NostrEvent, NDKEvent } from '@nostr-dev-kit/ndk';
import type NDK from '@nostr-dev-kit/ndk';
import groupBy from 'lodash.groupby';

export type NostrEventWithoutSig = Exclude<NostrEvent, 'sig'>;

export function isFulfilled<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

export function isRejected<T>(
  result: PromiseSettledResult<T>
): result is PromiseRejectedResult {
  return result.status === 'rejected';
}

export function extractLogableEvent(event: NostrEvent): NostrEventWithoutSig {
  const { sig: _, ...rest } = event;

  return rest;
}

export async function getRelatedEvents(
  event: NostrEvent,
  ndk: NDK
): Promise<NostrEvent[]> {
  const fetchEventTasks: Promise<NDKEvent>[] = event.tags
    .filter((tagArray) => tagArray[0] === 'e')
    .map((tagArray) => {
      const eventId = tagArray[1];

      return new Promise((resolve, reject) => {
        return ndk
          .fetchEvent(eventId)
          .then((e) => {
            if (!e) {
              return reject(`Could not find the event with id ${eventId}`);
            } else {
              return resolve(e);
            }
          })
          .catch(reject);
      });
    });

  const settledEvents = await Promise.allSettled(fetchEventTasks);

  settledEvents.filter(isRejected).forEach((res) => console.log(res.reason));

  return settledEvents.filter(isFulfilled).map((e) => e.value.rawEvent());
}

function getTags(event: NostrEvent, tagMatch: string) {
  return event.tags
    .filter(([tag]) => {
      return tag === tagMatch;
    })
    .map(([_, tagValue]) => tagValue);
}

export function getEventHashtags(event: NostrEvent): string[] {
  return getTags(event, 'e');
}

export function getUrlTag(event: NostrEvent): string | null {
  const rtag: NDKTag | undefined = event.tags.find(([tag]) => tag === 'r');

  return rtag && rtag.length === 2 ? rtag[1] : null;
}

export function findLatestCreatedAt(events: NDKEvent[]): number {
  return events.reduce((acc, curr) => {
    if (curr.created_at && curr.created_at > acc) {
      acc = curr.created_at;
    }

    return acc;
  }, 0);
}

type ObjectWithTags = Pick<NostrEvent, 'tags'>;

export function groupByTag(events: ObjectWithTags[], tag: string) {
  return groupBy(events, (obj) => {
    const rTag = obj.tags.find((t) => t[0] === tag);

    return rTag ? rTag[1] : 'ungrouped';
  });
}
