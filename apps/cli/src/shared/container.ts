import { Container } from 'inversify';

export const CONTAINER = new Container();

export const ENV = Symbol('ENV');
export const PG = Symbol('PG');
export const DB = Symbol('DB');
export const TELEGRAM = Symbol('TELEGRAM');
export const MQ = Symbol('MQ');
export const LOGGER = Symbol('LOGGER');
