import { type RawEventJob } from 'mq';

export async function createEventProcessor(
  rawEvent: RawEventJob,
): Promise<void> {
  console.log(`creating event for raw event ${rawEvent.name}`);
}
