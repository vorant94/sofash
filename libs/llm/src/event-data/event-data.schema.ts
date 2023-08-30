import joi from 'joi';
import { type EventDataModel } from './event-data.model.js';

export const EVENT_DATA_SCHEMA = joi
  .object<EventDataModel, true>({
    title: joi.string().allow(null),
    description: joi.string().allow(null),
    startingAt: joi.string().allow(null),
    endingAt: joi.string().allow(null),
    price: joi.number().allow(null),
    city: joi.string().allow(null),
    language: joi.string().allow(null),
  })
  .options({ stripUnknown: true });
