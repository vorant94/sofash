// TODO fix typeorm shared enum duplication problem
//  https://github.com/typeorm/typeorm/issues/5648
export const EVENT_LANGUAGES = ['ru', 'he', 'en'] as const;
export type EventLanguage = (typeof EVENT_LANGUAGES)[number];
