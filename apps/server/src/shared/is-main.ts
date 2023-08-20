import { fileURLToPath } from 'url';
import { argv } from 'process';

export function isMain(moduleUrl: string): boolean {
  const modulePath = fileURLToPath(moduleUrl);
  const [_, mainScriptPath] = argv;
  return modulePath === mainScriptPath;
}
