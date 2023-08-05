import { Container } from 'inversify';

export const CONTAINER = new Container();

export const ENV = Symbol('ENV');
export const DB = Symbol('DB');
export const TELEGRAF = Symbol('TELEGRAF');
export const MQ = Symbol('MQ');
