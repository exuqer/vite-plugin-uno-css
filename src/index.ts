import type { Plugin } from 'vite';
import { UnoCSSPlugin } from './plugin';

export default function unocssCSSPlugin(options?: {
  presets?: any[];
  theme?: any;
  shortcuts?: any;
  rules?: any[];
}): Plugin {
  return UnoCSSPlugin(options);
}

export { UnoCSSPlugin }; 