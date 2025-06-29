import type { Plugin } from 'vite';
import { createGenerator } from '@unocss/core';
import { presetUno } from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';
import { presetIcons } from '@unocss/preset-icons';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { CSSProcessor } from './css-processor';
import { HTMLProcessor } from './html-processor';
import { VueProcessor } from './vue-processor';
import { PostCSSProcessor } from './postcss-processor';
import { sync as globSync } from 'glob';
import { promises as fs } from 'fs';

interface PluginOptions {
  presets?: any[];
  theme?: any;
  shortcuts?: any;
  rules?: any[];
  mode?: 'auto' | 'dev' | 'build' | ('dev' | 'build')[];
  dev?: boolean;
}

export function UnoCSSPlugin(options: PluginOptions = {}): Plugin {
  const {
    presets = [presetUno(), presetAttributify(), presetIcons()],
    theme = {},
    shortcuts = {},
    rules = [],
    mode = 'auto',
    dev = false,
  } = options;

  // Определяем активные режимы работы
  let activeModes: ('dev' | 'build')[];
  if (mode === 'auto') {
    activeModes = dev ? ['dev'] : [];
  } else if (Array.isArray(mode)) {
    activeModes = mode;
  } else {
    activeModes = [mode];
  }

  const isDevMode = activeModes.includes('dev');
  const isBuildMode = activeModes.includes('build');

  console.log(`[uno-css-plugin] Active modes: ${activeModes.join(', ')}`);
  console.log(`[uno-css-plugin] Dev option: ${dev}`);

  // Создаем UnoCSS генератор только если нужен
  const uno = isDevMode || isBuildMode ? createGenerator({
    presets,
    theme,
    shortcuts,
    rules
  }) : null;

  const cssProcessor = isDevMode || isBuildMode ? new CSSProcessor(uno!) : null;
  const htmlProcessor = isDevMode || isBuildMode ? new HTMLProcessor() : null;
  const vueProcessor = isDevMode || isBuildMode ? new VueProcessor() : null;
  const postcssProcessor = isBuildMode ? new PostCSSProcessor() : null;

  // Кэш для маппинга классов (только если нужен)
  const classMappingCache = isDevMode || isBuildMode ? new Map<string, string>() : null;

  // Поддерживаемые расширения файлов
  const SUPPORTED_EXTENSIONS = {
    css: ['.css', '.scss', '.sass'],
    vue: ['.vue'],
    html: ['.html']
  };

  const isSupportedFile = (id: string, type: keyof typeof SUPPORTED_EXTENSIONS): boolean => {
    return SUPPORTED_EXTENSIONS[type].some(ext => id.endsWith(ext));
  };

  // Вспомогательные функции
  const processCSSAssets = async (bundle: any) => {
    if (!cssProcessor || !classMappingCache) return;
    
    for (const fileName in bundle) {
      const file = bundle[fileName];
      if (file.type === 'asset' && (fileName.endsWith('.css') || fileName.includes('.css'))) {
        const cssFile = file as any;
        if (cssFile.source) {
          console.log(`[uno-css-plugin] Processing CSS asset: ${fileName}`);
          try {
            await cssProcessor.process(cssFile.source, fileName, classMappingCache);
            // Удаляем исходный CSS файл из bundle
            delete bundle[fileName];
            console.log(`[uno-css-plugin] Removed original CSS file: ${fileName}`);
          } catch (error) {
            console.error(`[uno-css-plugin] Error processing CSS asset ${fileName}:`, error);
          }
        }
      }
    }
  };

  const processJSAssets = async (bundle: any) => {
    if (!classMappingCache) return;
    
    for (const fileName in bundle) {
      const file = bundle[fileName];
      if (file.type === 'chunk' && fileName.endsWith('.js')) {
        const jsFile = file as any;
        if (jsFile.code) {
          console.log(`[uno-css-plugin] Processing JS asset: ${fileName}`);
          try {
            const processedCode = await processJavaScriptCode(jsFile.code, classMappingCache);
            jsFile.code = processedCode;
            console.log(`[uno-css-plugin] Processed JS file: ${fileName}`);
          } catch (error) {
            console.error(`[uno-css-plugin] Error processing JS asset ${fileName}:`, error);
          }
        }
      }
    }
  };

  const processJavaScriptCode = async (code: string, classMappingCache: Map<string, string>): Promise<string> => {
    let processedCode = code;
    
    // Заменяем классы в строковых литералах
    for (const [className, unoClasses] of classMappingCache) {
      // Ищем классы в различных контекстах, но избегаем замены с префиксами
      const patterns = [
        // class: "className" (точное совпадение)
        new RegExp(`class:\\s*["']${className}["']`, 'g'),
        // class: 'className' (точное совпадение)
        new RegExp(`class:\\s*["']${className}["']`, 'g'),
        // "className" (точное совпадение, не в начале строки)
        new RegExp(`(?<!\\w)["']${className}["'](?!\\w)`, 'g'),
        // 'className' (точное совпадение, не в начале строки)
        new RegExp(`(?<!\\w)["']${className}["'](?!\\w)`, 'g')
      ];
      
      for (const pattern of patterns) {
        processedCode = processedCode.replace(pattern, (match) => {
          // Если это class: "className", заменяем на class: "unoClasses"
          if (match.startsWith('class:')) {
            return match.replace(className, unoClasses);
          }
          // Если это просто строка с классом, заменяем на unoClasses
          return match.replace(className, unoClasses);
        });
      }
    }
    
    return processedCode;
  };

  const generateUnoCSS = async () => {
    if (!classMappingCache || !uno) return { allUnoClasses: new Set<string>(), finalCSS: [] };
    
    const allUnoClasses = new Set<string>();
    const finalCSS: string[] = [];

    // Собираем все UnoCSS классы из кэша
    for (const [_, unoClasses] of classMappingCache) {
      const classes = unoClasses.split(' ');
      classes.forEach(cls => allUnoClasses.add(cls));
    }

    console.log(`[uno-css-plugin] Found ${allUnoClasses.size} unique classes in cache`);

    // Генерируем CSS для всех уникальных классов
    for (const className of allUnoClasses) {
      try {
        const css = await uno.generate(className);
        if (css.css) {
          finalCSS.push(css.css);
        }
      } catch (error) {
        console.warn(`Failed to generate CSS for class ${className}:`, error);
      }
    }

    return { allUnoClasses, finalCSS };
  };

  const updateHTMLFiles = async (bundle: any, cssFileName: string) => {
    if (!htmlProcessor || !classMappingCache) return;
    
    for (const fileName in bundle) {
      const file = bundle[fileName];
      if (file.type === 'asset' && fileName.endsWith('.html')) {
        const htmlFile = file as any;
        if (htmlFile.source) {
          // Сначала заменяем классы в HTML
          const processedHTML = await htmlProcessor.process(htmlFile.source, fileName, classMappingCache);
          // Потом добавляем ссылку на CSS
          const updatedHTML = htmlProcessor.addCSSLink(processedHTML, cssFileName);
          htmlFile.source = updatedHTML;
        }
      }
    }
  };

  const VIRTUAL_CSS_ID = '/@unocss-generated.css';

  return {
    name: 'vite-plugin-unocss-css',
    enforce: 'post' as const,

    // Конфигурация сервера для dev-режима
    configureServer(server) {
      if (isDevMode) {
        console.log(`[uno-css-plugin] Configuring dev server`);
        
        // Добавляем middleware для обработки CSS модулей из Vue компонентов
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.includes('?vue&type=style')) {
            console.log(`[uno-css-plugin] Intercepted Vue style module: ${req.url}`);
            // Здесь можно добавить обработку CSS модулей из Vue компонентов
          }
          next();
        });
      }
    },

    async transform(code: string, id: string) {
      if (!isDevMode && !isBuildMode) return null;

      // Только для CSS/SCSS
      if (isSupportedFile(id, 'css') && cssProcessor && classMappingCache) {
        const processedCSS = await cssProcessor.process(code, id, classMappingCache);
        return { code: processedCSS, map: null };
      }

      // Только для Vue, если реально что-то меняем
      if (id.includes('.vue') && vueProcessor && classMappingCache) {
        const processedCode = await vueProcessor.process(code, id, classMappingCache);
        if (processedCode === code) return null;
        return { code: processedCode, map: null };
      }

      // Всё остальное не трогаем
      return null;
    },

    // --- DEV MODE ONLY ---
    resolveId(id: string) {
      if (isDevMode && id === VIRTUAL_CSS_ID) {
        return VIRTUAL_CSS_ID;
      }
      return null;
    },
    async load(id: string) {
      if (isDevMode && id === VIRTUAL_CSS_ID && uno && classMappingCache) {
        console.log(`[uno-css-plugin] Generating virtual CSS. Cache size: ${classMappingCache.size}`);
        
        // Генерируем CSS из кэша
        const allUnoClasses = new Set<string>();
        for (const unoClasses of classMappingCache.values()) {
          unoClasses.split(' ').forEach(cls => allUnoClasses.add(cls));
        }
        
        console.log(`[uno-css-plugin] Found ${allUnoClasses.size} unique UnoCSS classes`);
        console.log(`[uno-css-plugin] Classes:`, Array.from(allUnoClasses));
        
        const { css } = await uno.generate([...allUnoClasses].join(' '), { preflights: false });
        
        console.log(`[uno-css-plugin] Generated CSS length: ${css.length}`);
        return css;
      }
      
      // Обрабатываем CSS модули из Vue компонентов в dev-режиме
      if (isDevMode && id.includes('?vue&type=style') && cssProcessor && classMappingCache) {
        console.log(`[uno-css-plugin] Loading Vue CSS module: ${id}`);
        // Здесь можно добавить обработку CSS модулей из Vue компонентов
        return null;
      }
      
      return null;
    },
    transformIndexHtml(html: string) {
      if (isDevMode) {
        // Вставляем линк на виртуальный CSS
        if (!html.includes(VIRTUAL_CSS_ID)) {
          return html.replace('</head>', `<link rel="stylesheet" href="${VIRTUAL_CSS_ID}"></head>`);
        }
      }
      return html;
    },
    // Обработка горячей замены модулей в dev-режиме
    handleHotUpdate(ctx) {
      if (isDevMode) {
        console.log(`[uno-css-plugin] Hot update for: ${ctx.file}`);
        
        // Если обновился Vue файл, обрабатываем его стили
        if (ctx.file.endsWith('.vue')) {
          console.log(`[uno-css-plugin] Vue file updated, processing styles`);
          // Здесь можно добавить обработку стилей из Vue файла
        }
        
        // Если обновился CSS файл, обрабатываем его
        if (ctx.file.endsWith('.css') || ctx.file.endsWith('.scss')) {
          console.log(`[uno-css-plugin] CSS file updated, processing styles`);
          // Здесь можно добавить обработку CSS файла
        }
      }
      return ctx.modules;
    },
    // --- END DEV MODE ---

    // --- BUILD MODE ---
    async generateBundle(options: any, bundle: any) {
      if (!isBuildMode) return;
      try {
        console.log('[uno-css-plugin] Starting generateBundle');
        console.log('[uno-css-plugin] Cache size:', classMappingCache?.size || 0);

        // 1. Собираем все .css, .scss, .vue файлы из исходников
        const files = [
          ...globSync('example/**/*.css'),
          ...globSync('example/**/*.scss'),
          ...globSync('example/**/*.vue'),
        ];
        for (const file of files) {
          const code = await fs.readFile(file, 'utf-8');
          if (file.endsWith('.vue')) {
            await vueProcessor?.process(code, file, classMappingCache!);
          } else {
            await cssProcessor?.process(code, file, classMappingCache!);
          }
        }

        if (!classMappingCache || classMappingCache.size === 0) {
          console.log('[uno-css-plugin] No classes found, skipping generation');
          return;
        }

        // Обрабатываем CSS файлы в bundle
        if (processCSSAssets) {
          await processCSSAssets(bundle);
        }
        
        console.log('[uno-css-plugin] Cache size after CSS processing:', classMappingCache?.size || 0);
        
        if (!classMappingCache || classMappingCache.size === 0) {
          console.log('[uno-css-plugin] No classes found, skipping generation');
          return;
        }

        // Получаем все уникальные классы
        const allClasses = Array.from(classMappingCache.values()).flat();
        const uniqueClasses = [...new Set(allClasses)];
        
        console.log('[uno-css-plugin] Found', uniqueClasses.length, 'unique classes in cache');
        console.log('[uno-css-plugin] Classes:', uniqueClasses);

        // Генерируем CSS с помощью UnoCSS
        if (uno) {
          const { css } = await uno.generate(uniqueClasses.join(' '), {
            preflights: false
          });

          console.log('[uno-css-plugin] Generated CSS length:', css.length);

          // Добавляем сгенерированный CSS в bundle
          bundle['unocss-generated.css'] = {
            type: 'asset',
            fileName: 'unocss-generated.css',
            source: css
          };

          console.log('[uno-css-plugin] Added CSS to bundle');

          // Обновляем HTML файлы
          if (updateHTMLFiles) {
            await updateHTMLFiles(bundle, 'unocss-generated.css');
          }
          
          // Обрабатываем JS файлы в bundle
          if (processJSAssets) {
            await processJSAssets(bundle);
          }
          
          console.log('[uno-css-plugin] generateBundle completed successfully');
        }
      } catch (error) {
        console.error('[uno-css-plugin] Error in generateBundle:', error);
        throw error;
      }
    }
  } as Plugin;
} 