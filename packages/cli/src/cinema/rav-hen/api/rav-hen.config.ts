import type { RavHenCinemaId } from './rav-hen.models.js';

const cinemaIdToName = {
  1058: 'givataiim',
  1071: 'dizengoff',
  1062: 'kiryat ono',
} as const satisfies Record<RavHenCinemaId, string>;

export const ravHenConfig = {
  baseUrl: new URL(`https://www.rav-hen.co.il`),
  tenantId: 10104,
  timeZone: 'Asia/Jerusalem',
  cinemaIdToName,
} as const;
