import { transports } from 'winston';
import { format, type TransformableInfo } from 'logform';
import { type TransformableInfoModel } from '../shared/transformable-info.model.js';

export const CONSOLE_TRANSPORT = new transports.Console({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.colorize(),
    format.printf((info: TransformableInfo) => {
      const { timestamp, label, level, message, ...extra } =
        info as TransformableInfoModel;

      const extraStringified =
        Object.keys(extra).length === 0 ? '' : JSON.stringify(extra);

      const messageStringified =
        label != null ? `[${label}]: ${message}` : message;

      return `${timestamp} - ${level} ${messageStringified} ${extraStringified}`;
    }),
  ),
});

export type ConsoleTransportConfig = true;
