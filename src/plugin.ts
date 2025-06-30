import type { Plugin } from 'vite';
import type { OutputAsset } from 'rollup';
import { processAllSources, processVueFile, processHtmlAndCssStrings } from './full-processor';
import fs from 'fs/promises';
import { sync as globSync } from 'glob';
import path from 'path';
import { load } from 'cheerio';
import { CSSProcessor } from './css-processor';
import { VueProcessor } from './vue-processor';
import { HTMLProcessor } from './html-processor';
import { createGenerator } from '@unocss/core';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import { parse as parseHtml } from 'node-html-parser';

interface PluginOptions {
  presets?: any[];
  theme?: any;
  shortcuts?: any;
  rules?: any[];
  dev?: boolean;
}

// Вспомогательная функция для сбора uno-классов из HTML
function extractUnoClassesFromHtml(html: string): string[] {
  const classSet = new Set<string>();
  const classRegex = /class\s*=\s*["']([^"']+)["']/g;
  let match;
  while ((match = classRegex.exec(html))) {
    match[1].split(/\s+/).forEach(cls => classSet.add(cls));
  }
  return Array.from(classSet);
}

// Вспомогательная функция для сбора uno-классов из JS
function extractUnoClassesFromJs(js: string): string[] {
  const classSet = new Set<string>();
  // Примитивная регулярка для uno-классов (можно доработать)
  const unoRegex = /['"]([\w-:\[\]#\/.%]+)['"]/g;
  let match;
  while ((match = unoRegex.exec(js))) {
    if (
      /^(bg-|text-|m-|p-|w-|h-|color-|font-|rounded-|items-|justify-|flex|border-|shadow|opacity|z-|gap-|grid-|col-|row-|order-|self-|content-|leading-|tracking-|align-|object-|overflow-|cursor-|select-|pointer-events-|transition|duration|ease|delay|animate|aspect-|top|right|bottom|left|visible|float|clear|resize|list|appearance|outline|filter|backdrop|blend|box|content|writing|whitespace|break|underline|decoration|indent|tab|caret|stroke|fill|scale|rotate|translate|skew)/.test(
        match[1]
      )
    ) {
      classSet.add(match[1]);
    }
  }
  return Array.from(classSet);
}

function isAsset(file: unknown): file is OutputAsset {
  return !!file && typeof file === 'object' && (file as any).type === 'asset';
}

export function UnoCSSPlugin(options: PluginOptions = {}): Plugin {
  // Плагин работает только для сборки (vite build)
  const base: Plugin = {
    name: 'vite-plugin-unocss-css',
    enforce: 'pre',
    apply: 'build',
  };

  const classMappingCache = new Map<string, string>();
  const cssProcessor = new CSSProcessor(null as any); // UnoGenerator будет позже
  const vueProcessor = new VueProcessor();
  const htmlProcessor = new HTMLProcessor();

  let unoCssHtml = '';
  let unoCssRaw = '';

  return {
    ...base,
    async transform(code, id) {
      // Не трогать node_modules и виртуальные файлы
      if (id.includes('node_modules') || id.startsWith('\0')) return null;

      if (id.endsWith('.css')) {
        await cssProcessor.process(code, id, classMappingCache);
        return '';
      }
      // Обрабатываем только исходные .vue-файлы с <template>
      if (id.endsWith('.vue') && code.includes('<template')) {
        let processed = await vueProcessor.process(code, id, classMappingCache);
        processed = processed.replace(/(<template[^>]*>)([\s\S]*?)(<\/template>)/, (full: string, open: string, templateContent: string, close: string) => {
          // Парсим только содержимое шаблона, без <html><head><body>
          const root = parseHtml(`<root>${templateContent}</root>`);
          root.querySelectorAll('[class]').forEach(el => {
            const orig = el.getAttribute('class')!;
            const uno = orig.split(/\s+/).map((cls: string) => classMappingCache.get(cls) || cls).join(' ');
            el.setAttribute('class', uno);
          });
          // Возвращаем только внутренности <root>...</root>
          const first = root.firstChild;
          if (first && 'innerHTML' in first) {
            return open + (first as any).innerHTML + close;
          } else {
            return open + templateContent + close;
          }
        });
        return processed;
      }
      if (id.endsWith('.html')) {
        const root = parseHtml(code);
        root.querySelectorAll('[class]').forEach(el => {
          const orig = el.getAttribute('class')!;
          const uno = orig.split(/\s+/).map((cls: string) => classMappingCache.get(cls) || cls).join(' ');
          el.setAttribute('class', uno);
        });
        return root.toString();
      }
      // Только js/ts исходники проекта
      if ((id.endsWith('.js') || id.endsWith('.ts')) && (id.includes('/src/') || id.includes('/example/'))) {
        let processed = await htmlProcessor.process(code, id, classMappingCache);
        processed = processed.replace(/class\s*=\s*["']([^"']+)["']/g, (full, classStr) => {
          const unoClasses = classStr.split(/\s+/).map((cls: string) => classMappingCache.get(cls) || cls).join(' ');
          return `class=\"${unoClasses}\"`;
        });
        return processed;
      }
      return null;
    },
    async generateBundle(_options: any, bundle: any) {
      // UnoCSS CSS generation is now handled in transformIndexHtml
    },
    async transformIndexHtml(html: string) {
      // Заменяем кастомные классы на uno-классы
      const root = parseHtml(html);
      root.querySelectorAll('[class]').forEach(el => {
        const orig = el.getAttribute('class')!;
        const uno = orig.split(/\s+/).map((cls: string) => classMappingCache.get(cls) || cls).join(' ');
        el.setAttribute('class', uno);
      });
      // Собираем все классы
      const unoClassSet = new Set<string>();
      root.querySelectorAll('[class]').forEach(el => {
        el.getAttribute('class')!.split(/\s+/).forEach(cls => unoClassSet.add(cls));
      });
      const unoClassesArr = Array.from(unoClassSet);
      const uno = createGenerator({ presets: [presetUno, presetAttributify, presetIcons] });
      const { css } = await uno.generate(unoClassesArr.join(' '));
      // Сохраняем CSS в example/dist-example/unocss-generated.css
      const fsPath = path.resolve(__dirname, '../example/dist-example/unocss-generated.css');
      await fs.writeFile(fsPath, css, 'utf8');
      // Возвращаем HTML с правильной ссылкой
      let out = root.toString();
      out = out.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
      out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="unocss-generated.css" /></head>');
      return out;
    },
    // Добавьте остальные хуки аналогично, если нужно
  };
} 