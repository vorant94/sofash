export interface Env {
  NODE_ENV: NodeEnv;
  TG_CLIENT_API_ID: number;
  TG_CLIENT_API_HASH: string;
}

export type NodeEnv = 'DEV' | 'PROD';
