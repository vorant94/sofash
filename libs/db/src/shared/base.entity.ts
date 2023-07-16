import { type ObjectLiteral } from 'typeorm';

export interface BaseEntity extends ObjectLiteral {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
