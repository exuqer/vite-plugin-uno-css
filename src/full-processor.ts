import postcss from 'postcss';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { parse as parseVue } from '@vue/compiler-sfc';
import { CSSUtils } from './utils';

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

// Обработка .vue-файла: возвращает { html, unoClasses }
export async function processVueFile(vuePath: string) {
  const src = await fs.readFile(vuePath, 'utf-8');
  const { descriptor } = parseVue(src);
  const template = descriptor.template?.content || '';
  const styles = descriptor.styles.map((s: any) => s.content).join('\n');

  // 1. Парсим стили, строим маппинг для всех классов из всех селекторов
  const root = postcss.parse(styles);
  const classMap: Record<string, string[]> = {};
  root.walkRules((rule: any) => {
    // Извлекаем все классы из селектора (включая сложные)
    const classNames = Array.from(rule.selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m: any) => m[1]);
    if (classNames.length === 0) return;
    const unoClasses: string[] = [];
    rule.walkDecls((decl: any) => {
      const uno = CSSUtils.convertPropertyToUnoClass(decl.prop, decl.value);
      if (uno) unoClasses.push(...uno);
    });
    for (const className of classNames) {
      if (!classMap[className]) classMap[className] = [];
      classMap[className].push(...unoClasses);
    }
  });

  // 2. Заменяем классы в шаблоне
  const $ = cheerio.load(template, { xmlMode: false });
  $('[class]').each((_: any, el: any) => {
    const orig = $(el).attr('class')!;
    const uno = splitUnoClasses(orig).flatMap((cls: string) => classMap[cls] || []).filter(Boolean);
    if (uno.length > 0) {
      $(el).attr('class', uno.join(' '));
    } else {
      $(el).removeAttr('class');
    }
  });
  // Удаляем scoped-атрибуты
  $('*').each((_: any, el: any) => {
    // @ts-ignore: attribs есть только у тегов
    if (el.type === 'tag' && el.attribs) {
      for (const attr of Object.keys(el.attribs)) {
        if (attr.startsWith('data-v-')) $(el).removeAttr(attr);
      }
    }
  });
  const htmlOut = $.html();
  const unoClasses = Object.values(classMap).flat();
  return { html: htmlOut, unoClasses };
}

// Основная функция: processAllSources (HTML+CSS)
export async function processAllSources({ htmlPath, cssPath }: { htmlPath: string, cssPath: string }) {
  // 1. Читаем исходные файлы
  const htmlRaw = await fs.readFile(htmlPath, 'utf-8');
  const cssRaw = await fs.readFile(cssPath, 'utf-8');

  // 2. Парсим CSS, строим маппинг для всех классов из всех селекторов
  const root = postcss.parse(cssRaw);
  const classMap: Record<string, string[]> = {};
  root.walkRules((rule: any) => {
    // Извлекаем все классы из селектора (включая сложные)
    const classNames = Array.from(rule.selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m: any) => m[1]);
    if (classNames.length === 0) return;
    const unoClasses: string[] = [];
    rule.walkDecls((decl: any) => {
      const uno = CSSUtils.convertPropertyToUnoClass(decl.prop, decl.value);
      if (uno) unoClasses.push(...uno);
    });
    for (const className of classNames) {
      if (!classMap[className]) classMap[className] = [];
      classMap[className].push(...unoClasses);
    }
  });

  // 3. Заменяем классы в HTML
  const $ = cheerio.load(htmlRaw);
  // Собираем все реально используемые классы
  const usedClasses = new Set<string>();
  $('[class]').each((_: any, el: any) => {
    const orig = $(el).attr('class')!;
    splitUnoClasses(orig).forEach((cls: string) => usedClasses.add(cls));
    const uno = splitUnoClasses(orig).flatMap((cls: string) => classMap[cls] || cls);
    $(el).attr('class', uno.join(' '));
  });
  const htmlOut = $.html();

  // 4. Генерируем финальный CSS через UnoCSS (импорты внутри функции, с any для совместимости)
  const { createGenerator } = await import('@unocss/core');
  const { default: presetUno } = await import('@unocss/preset-uno');
  const { default: presetAttributify } = await import('@unocss/preset-attributify');
  const { default: presetIcons } = await import('@unocss/preset-icons');
  const uno = (createGenerator as any)({ presets: [presetUno, presetAttributify, presetIcons] });
  // Собираем все uno-классы, которые реально используются, включая унарные
  const allUnoClasses = [
    ...Object.values(classMap).flat(),
    ...Array.from(usedClasses).filter(cls => !(cls in classMap)),
  ];
  const { css } = await (uno as any).generate(allUnoClasses.join(' '));

  return { html: htmlOut, css };
}

// Новая функция: обработка HTML-строки и CSS-строки, возвращает { html, css }
export async function processHtmlAndCssStrings(htmlRaw: string, cssRaw: string) {
  // 1. Парсим CSS, строим маппинг для всех классов из всех селекторов
  const root = postcss.parse(cssRaw);
  const classMap: Record<string, string[]> = {};
  root.walkRules((rule: any) => {
    // Извлекаем все классы из селектора (включая сложные)
    const classNames = Array.from(rule.selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m: any) => m[1]);
    if (classNames.length === 0) return;
    const unoClasses: string[] = [];
    rule.walkDecls((decl: any) => {
      const uno = CSSUtils.convertPropertyToUnoClass(decl.prop, decl.value);
      if (uno) unoClasses.push(...uno);
    });
    for (const className of classNames) {
      if (!classMap[className]) classMap[className] = [];
      classMap[className].push(...unoClasses);
    }
  });

  // 2. Заменяем классы в HTML
  const $ = cheerio.load(htmlRaw);
  // Собираем все реально используемые классы
  const usedClasses = new Set<string>();
  $('[class]').each((_: any, el: any) => {
    const orig = $(el).attr('class')!;
    splitUnoClasses(orig).forEach((cls: string) => usedClasses.add(cls));
    const uno = splitUnoClasses(orig).flatMap((cls: string) => classMap[cls] || cls);
    $(el).attr('class', uno.join(' '));
  });
  const htmlOut = $.html();

  // 3. Генерируем финальный CSS через UnoCSS
  const { createGenerator } = await import('@unocss/core');
  const { default: presetUno } = await import('@unocss/preset-uno');
  const { default: presetAttributify } = await import('@unocss/preset-attributify');
  const { default: presetIcons } = await import('@unocss/preset-icons');
  const uno = (createGenerator as any)({ presets: [presetUno, presetAttributify, presetIcons] });
  // Собираем все uno-классы, которые реально используются, включая унарные
  const allUnoClasses = [
    ...Object.values(classMap).flat(),
    ...Array.from(usedClasses).filter(cls => !(cls in classMap)),
  ];
  const { css } = await (uno as any).generate(allUnoClasses.join(' '));

  return { html: htmlOut, css };
} 