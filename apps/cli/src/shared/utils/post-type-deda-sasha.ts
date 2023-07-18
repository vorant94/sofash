import { checkFields } from './field-checker.js';

export function isDashaSashaPostType(postData: any): boolean {
  const requiredFields = [
    'message',
    'message.message_id',
    'message.from',
    'message.from.id',
    'message.from.is_bot',
    'message.from.first_name',
    'message.from.last_name',
    'message.from.username',
    'message.from.language_code',
    'message.from.is_premium',
    'message.chat',
    'message.chat.id',
    'message.chat.first_name',
    'message.chat.last_name',
    'message.chat.username',
    'message.chat.type',
    'message.date',
  ];

  return checkFields(postData, requiredFields);
}
