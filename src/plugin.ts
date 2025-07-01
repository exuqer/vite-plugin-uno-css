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

// Вспомогательная функция для преобразования классов с числовыми суффиксами в arbitrary values UnoCSS
function normalizeArbitraryClass(cls: string): string {
  // Преобразуем w-150px -> w-[150px], rounded-8px -> rounded-[8px], и т.п.
  // Поддержка px, rem, em, %, и просто числа
  return cls.replace(
    /^(w|h|m|p|rounded|text|gap|top|left|right|bottom|z|border|inset|min-w|min-h|max-w|max-h)-(\-?\d+(?:px|rem|em|%)?)/,
    (_, prefix, value) => `${prefix}-[${value}]`
  );
}

function isUnoClass(cls: string): boolean {
  // Примитивная проверка: uno-класс содержит дефис и не является BEM/кастомным
  // Можно доработать под ваши правила
  return /-|\[.*\]/.test(cls) && !/^[_a-zA-Z0-9]+(__|--)/.test(cls);
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
  const allUnoClasses = new Set<string>();

  let unoCssHtml = '';
  let unoCssRaw = '';

  return {
    ...base,
    async transform(code, id) {
      console.log('PLUGIN:', id);
      // Не трогать node_modules и виртуальные файлы
      if (id.includes('node_modules') || id.startsWith('\0')) return null;

      if (id.endsWith('.css')) {
        await cssProcessor.process(code, id, classMappingCache);
        return '';
      }
      // Обрабатываем только исходные .vue-файлы с <template>
      if (id.endsWith('.vue') && !id.includes('?') && code.includes('<template')) {
        let processed = await vueProcessor.process(code, id, classMappingCache, allUnoClasses);
        // Заменяем кастомные классы на uno-классы только внутри <template>...</template> через парсер
        processed = processed.replace(/(<template[^>]*>)([\s\S]*?)(<\/template>)/, (full: string, open: string, templateContent: string, close: string) => {
          // Парсим только содержимое шаблона, без <html><head><body>
          const root = parseHtml(`<root>${templateContent}</root>`);
          root.querySelectorAll('[class]').forEach(el => {
            const orig = el.getAttribute('class')!;
            const uno = orig.split(/\s+/)
              .map((cls: string) => {
                const mapped = classMappingCache.get(cls) || cls;
                const normalized = normalizeArbitraryClass(mapped);
                return isUnoClass(normalized) ? normalized : '';
              })
              .filter(Boolean)
              .join(' ');
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
      return null;
    },
    async generateBundle(_options: any, bundle: any) {
      // UnoCSS CSS generation is now handled in transformIndexHtml
    },
    async transformIndexHtml(html: string) {
      console.log('[vite-plugin-unocss-css] transformIndexHtml called');
      // Заменяем кастомные классы на uno-классы
      const root = parseHtml(html);
      root.querySelectorAll('[class]').forEach(el => {
        const orig = el.getAttribute('class')!;
        const uno = orig.split(/\s+/)
          .map((cls: string) => {
            const mapped = classMappingCache.get(cls) || cls;
            const normalized = normalizeArbitraryClass(mapped);
            return isUnoClass(normalized) ? normalized : '';
          })
          .filter(Boolean)
          .join(' ');
        el.setAttribute('class', uno);
      });
      // Собираем все классы из HTML
      const unoClassSet = new Set<string>();
      root.querySelectorAll('[class]').forEach(el => {
        el.getAttribute('class')!.split(/\s+/).forEach(cls => {
          const normalized = normalizeArbitraryClass(cls);
          if (isUnoClass(normalized)) unoClassSet.add(normalized);
        });
      });
      // Дополнительно собираем классы из всех JS-файлов в assets
      const assetsDir = path.resolve(__dirname, '../example/dist-example/assets');
      try {
        const files = await fs.readdir(assetsDir);
        for (const file of files) {
          if (file.endsWith('.js')) {
            const content = await fs.readFile(path.join(assetsDir, file), 'utf8');
            // Расширенная регулярка для поиска uno-классов в строках и шаблонах
            const classRegex = /class\s*[:=]\s*["'`]([^"'`]+)["'`]/g;
            let match;
            while ((match = classRegex.exec(content))) {
              match[1].split(/\s+/).forEach(cls => {
                const normalized = normalizeArbitraryClass(cls);
                if (isUnoClass(normalized)) unoClassSet.add(normalized);
              });
            }
            // Также ищем uno-классы в шаблонных строках
            const tplRegex = /class:\s*["'`]([^"'`]+)["'`]/g;
            while ((match = tplRegex.exec(content))) {
              match[1].split(/\s+/).forEach(cls => {
                const normalized = normalizeArbitraryClass(cls);
                if (isUnoClass(normalized)) unoClassSet.add(normalized);
              });
            }
          }
        }
      } catch (e) {
        // ignore if assets dir does not exist yet
      }
      // После сбора unoClassSet из HTML и JS:
      allUnoClasses.forEach(cls => unoClassSet.add(cls));
      const unoClassesArr = Array.from(unoClassSet);
      console.log('[vite-plugin-unocss-css] UnoCSS классы для генерации:', unoClassesArr);
      const uno = createGenerator({ presets: [presetUno, presetAttributify, presetIcons] });
      const { css } = await uno.generate(unoClassesArr.join(' '));
      // Собираем CSS в dist/unocss-generated.css текущего проекта
      const fsPath = path.resolve(process.cwd(), 'dist/unocss-generated.css');
      try {
        await fs.mkdir(path.dirname(fsPath), { recursive: true });
        await fs.writeFile(fsPath, css, 'utf8');
        console.log('[vite-plugin-unocss-css] CSS written to', fsPath);
      } catch (e) {
        console.error('[vite-plugin-unocss-css] Failed to write CSS:', e);
      }
      // Возвращаем HTML с правильной ссылкой
      let out = root.toString();
      out = out.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
      out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="unocss-generated.css" /></head>');
      return out;
    },
    // Добавьте остальные хуки аналогично, если нужно
  };
} 