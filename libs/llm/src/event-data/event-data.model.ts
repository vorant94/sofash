import { type EventEntity } from 'db';

export type EventDataModel = Partial<
  Pick<
    EventEntity,
    | 'title'
    | 'description'
    | 'startingAt'
    | 'endingAt'
    | 'price'
    | 'city'
    | 'language'
  >
>;
