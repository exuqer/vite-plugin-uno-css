import type { Plugin } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { processCSS } from './css-processor';
import { processVue } from './vue-processor';
import { createGenerator } from '@unocss/core';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import { parse as parseHtml } from 'node-html-parser';



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

// Вспомогательная функция для корректного разбиения UnoCSS-классов с arbitrary values
function splitUnoClasses(str: string): string[] {
  const result = [];
  let current = '';
  let bracket = 0;
  for (const char of str) {
    if (char === '[') bracket++;
    if (char === ']') bracket--;
    if (char === ' ' && bracket === 0) {
      if (current) result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) result.push(current);
  return result;
}

export function UnoCSSPlugin(): Plugin {
  // Плагин работает только для сборки (vite build)
  const base: Plugin = {
    name: 'vite-plugin-unocss-css',
    enforce: 'pre',
    apply: 'build',
  };

  const classMappingCache = new Map<string, string>();
  const allUnoClasses = new Set<string>();

  return {
    ...base,
    async transform(code, id) {
      // Не трогать node_modules и виртуальные файлы
      if (id.includes('node_modules') || id.startsWith('\0')) return null;

      if (id.endsWith('.css')) {
        await processCSS(code, id, classMappingCache, allUnoClasses);
        return '';
      }
      // Обрабатываем только исходные .vue-файлы с <template>
      if (id.endsWith('.vue') && !id.includes('?') && code.includes('<template')) {
        let processed = await processVue(code, id, classMappingCache, allUnoClasses);
        // Заменяем кастомные классы на uno-классы только внутри <template>...</template> через парсер
        processed = processed.replace(/(<template[^>]*>)([\s\S]*?)(<\/template>)/, (full: string, open: string, templateContent: string, close: string) => {
          // Парсим только содержимое шаблона, без <html><head><body>
          const root = parseHtml(`<root>${templateContent}</root>`);
          root.querySelectorAll('[class]').forEach(el => {
            const orig = el.getAttribute('class')!;
            const uno = splitUnoClasses(orig)
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
        // Не обрабатываем HTML здесь, оставляем для transformIndexHtml
        return null;
      }
      return null;
    },
    async transformIndexHtml(html: string) {
      // Заменяем кастомные классы на uno-классы
      const root = parseHtml(html);
      root.querySelectorAll('[class]').forEach(el => {
        const orig = el.getAttribute('class')!;
        const uno = splitUnoClasses(orig)
                      .map((cls: string) => {
              const mapped = classMappingCache.get(cls);
              if (!mapped) {
                console.warn('[vite-plugin-unocss-css] Класс не найден в classMappingCache:', cls, 'в исходном:', orig);
              }
              const normalized = normalizeArbitraryClass(mapped || cls);
              return isUnoClass(normalized) ? normalized : '';
            })
          .filter(Boolean)
          .join(' ');
        el.setAttribute('class', uno);
      });
      // Собираем все классы из HTML
      const unoClassSet = new Set<string>();
      root.querySelectorAll('[class]').forEach(el => {
        splitUnoClasses(el.getAttribute('class')!).forEach((cls: string) => {
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
              match[1] && splitUnoClasses(match[1]).forEach(cls => {
                const normalized = normalizeArbitraryClass(cls);
                if (isUnoClass(normalized)) unoClassSet.add(normalized);
              });
            }
            // Также ищем uno-классы в шаблонных строках
            const tplRegex = /class:\s*["'`]([^"'`]+)["'`]/g;
            while ((match = tplRegex.exec(content))) {
              match[1] && splitUnoClasses(match[1]).forEach(cls => {
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
      
      // Создаем UnoCSS генератор с кастомными правилами для background-image
      const uno = createGenerator({ 
        presets: [presetUno, presetAttributify, presetIcons],
        rules: [
          // Кастомное правило для background-image с url() без кавычек
          [/^bg-\[url\(([^)]+)\)\]$/, ([, url]) => ({
            'background-image': `url(${url})`
          })],
          // Кастомное правило для background-image без url()
          [/^bg-\[([^\]]+)\]$/, ([, value]) => {
            if (value.startsWith("url(")) {
              return {
                'background-image': value
              };
            }
            return {
              'background-color': value
            };
          }]
        ]
      });
      
      const { css } = await uno.generate(unoClassesArr.join(' '));
      // Собираем CSS в dist/unocss-generated.css текущего проекта
      const fsPath = path.resolve(process.cwd(), 'dist/unocss-generated.css');
      try {
        await fs.mkdir(path.dirname(fsPath), { recursive: true });
        await fs.writeFile(fsPath, css, 'utf8');
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