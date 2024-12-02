import { domain } from './firebase';

export function getCallbackUrl(path: string): string {
  return `${domain}${path}`;
}

