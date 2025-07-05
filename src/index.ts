import type { Plugin } from 'vite';
import { UnoCSSPlugin } from './plugin';

export default function unocssCSSPlugin(): Plugin {
  return UnoCSSPlugin();
}

export { UnoCSSPlugin }; 