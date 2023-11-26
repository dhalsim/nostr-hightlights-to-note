import NDK, { NDKEvent, NDKTag, NostrEvent } from '@nostr-dev-kit/ndk';

export type NostrEventWithoutSig = Exclude<NostrEvent, 'sig'>;

export function extractLogableEvent(event: NostrEvent): NostrEventWithoutSig {
  const { sig, ...rest } = event;

  return rest;
}

export async function getRelatedEvents(
  event: NostrEvent,
  ndk: NDK
): Promise<NostrEvent[]> {
  const fetchEventTasks = event.tags
    .filter((tagArray) => tagArray[0] === 'e')
    .map(async (tagArray) => {
      const eventId = tagArray[1];

      const event = await ndk.fetchEvent(eventId);

      // TODO: fetchEvent can return null
      // should we handle this differently?

      if (!event) {
        throw new Error('Could not find the event');
      }

      return event;
    });

  const events = await Promise.all(fetchEventTasks);

  return events.map((e) => e.rawEvent());
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

export function findLatestCreatedAt(events: Set<NDKEvent>): number {
  return [...events].reduce((acc, curr) => {
    if (curr.created_at && curr.created_at > acc) {
      acc = curr.created_at;
    }

    return acc;
  }, 0);
}
