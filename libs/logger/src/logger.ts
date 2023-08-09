import type winston from 'winston';
import { createLogger } from 'winston';
import {
  CONSOLE_TRANSPORT,
  type ConsoleTransportConfig,
} from './console/console.transport.js';

export class Logger {
  // cannot be private with a #, because it needs to be accessed
  // in clone method after prev instance is cloned
  private readonly logger: winston.Logger;

  constructor(transports: Transports) {
    this.logger = createLogger();

    if (transports.console) {
      this.logger.add(CONSOLE_TRANSPORT);
    }
  }

  clone(label: string): this {
    if (label.length > 25) {
      throw new Error(
        `label max length is 25, but [${label.length}] was provided`,
      );
    }

    return Object.assign(Object.create(Object.getPrototypeOf(this)), {
      ...this,
      logger: this.logger.child({
        label: label.padEnd(25, ' '),
      }),
    });
  }

  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }
}

export interface TransportTypeToTransportConfig {
  console: ConsoleTransportConfig;
}
export type Transports = Partial<TransportTypeToTransportConfig>;
