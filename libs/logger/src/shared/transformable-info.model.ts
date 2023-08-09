import { type TransformableInfo } from 'logform';

export interface TransformableInfoModel extends TransformableInfo {
  timestamp: string;
  message: string;
  label?: string;
}
