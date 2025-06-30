import postcss from 'postcss';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import { parse as parseVue } from '@vue/compiler-sfc';
import { CSSUtils } from './utils';
// Обработка .vue-файла: возвращает { html, unoClasses }
export async function processVueFile(vuePath) {
    const src = await fs.readFile(vuePath, 'utf-8');
    const { descriptor } = parseVue(src);
    const template = descriptor.template?.content || '';
    const styles = descriptor.styles.map((s) => s.content).join('\n');
    // 1. Парсим стили, строим маппинг для всех классов из всех селекторов
    const root = postcss.parse(styles);
    const classMap = {};
    root.walkRules((rule) => {
        // Извлекаем все классы из селектора (включая сложные)
        const classNames = Array.from(rule.selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
        if (classNames.length === 0)
            return;
        const unoClasses = [];
        rule.walkDecls((decl) => {
            const uno = CSSUtils.convertPropertyToUnoClass(decl.prop, decl.value);
            if (uno)
                unoClasses.push(...uno);
        });
        for (const className of classNames) {
            if (!classMap[className])
                classMap[className] = [];
            classMap[className].push(...unoClasses);
        }
    });
    // 2. Заменяем классы в шаблоне
    const $ = cheerio.load(template, { xmlMode: false });
    $('[class]').each((_, el) => {
        const orig = $(el).attr('class');
        const uno = orig.split(/\s+/).flatMap((cls) => classMap[cls] || cls);
        $(el).attr('class', uno.join(' '));
    });
    // Удаляем scoped-атрибуты
    $('*').each((_, el) => {
        // @ts-ignore: attribs есть только у тегов
        if (el.type === 'tag' && el.attribs) {
            for (const attr of Object.keys(el.attribs)) {
                if (attr.startsWith('data-v-'))
                    $(el).removeAttr(attr);
            }
        }
    });
    const htmlOut = $.html();
    const unoClasses = Object.values(classMap).flat();
    return { html: htmlOut, unoClasses };
}
// Основная функция: processAllSources (HTML+CSS)
export async function processAllSources({ htmlPath, cssPath }) {
    // 1. Читаем исходные файлы
    const htmlRaw = await fs.readFile(htmlPath, 'utf-8');
    const cssRaw = await fs.readFile(cssPath, 'utf-8');
    // 2. Парсим CSS, строим маппинг для всех классов из всех селекторов
    const root = postcss.parse(cssRaw);
    const classMap = {};
    root.walkRules((rule) => {
        // Извлекаем все классы из селектора (включая сложные)
        const classNames = Array.from(rule.selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
        if (classNames.length === 0)
            return;
        const unoClasses = [];
        rule.walkDecls((decl) => {
            const uno = CSSUtils.convertPropertyToUnoClass(decl.prop, decl.value);
            if (uno)
                unoClasses.push(...uno);
        });
        for (const className of classNames) {
            if (!classMap[className])
                classMap[className] = [];
            classMap[className].push(...unoClasses);
        }
    });
    // 3. Заменяем классы в HTML
    const $ = cheerio.load(htmlRaw);
    // Собираем все реально используемые классы
    const usedClasses = new Set();
    $('[class]').each((_, el) => {
        const orig = $(el).attr('class');
        orig.split(/\s+/).forEach((cls) => usedClasses.add(cls));
        const uno = orig.split(/\s+/).flatMap((cls) => classMap[cls] || cls);
        $(el).attr('class', uno.join(' '));
    });
    const htmlOut = $.html();
    // 4. Генерируем финальный CSS через UnoCSS (импорты внутри функции, с any для совместимости)
    const { createGenerator } = await import('@unocss/core');
    const { default: presetUno } = await import('@unocss/preset-uno');
    const { default: presetAttributify } = await import('@unocss/preset-attributify');
    const { default: presetIcons } = await import('@unocss/preset-icons');
    const uno = createGenerator({ presets: [presetUno, presetAttributify, presetIcons] });
    // Собираем все uno-классы, которые реально используются, включая унарные
    const allUnoClasses = [
        ...Object.values(classMap).flat(),
        ...Array.from(usedClasses).filter(cls => !(cls in classMap)),
    ];
    const { css } = await uno.generate(allUnoClasses.join(' '));
    return { html: htmlOut, css };
}
// Новая функция: обработка HTML-строки и CSS-строки, возвращает { html, css }
export async function processHtmlAndCssStrings(htmlRaw, cssRaw) {
    // 1. Парсим CSS, строим маппинг для всех классов из всех селекторов
    const root = postcss.parse(cssRaw);
    const classMap = {};
    root.walkRules((rule) => {
        // Извлекаем все классы из селектора (включая сложные)
        const classNames = Array.from(rule.selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
        if (classNames.length === 0)
            return;
        const unoClasses = [];
        rule.walkDecls((decl) => {
            const uno = CSSUtils.convertPropertyToUnoClass(decl.prop, decl.value);
            if (uno)
                unoClasses.push(...uno);
        });
        for (const className of classNames) {
            if (!classMap[className])
                classMap[className] = [];
            classMap[className].push(...unoClasses);
        }
    });
    // 2. Заменяем классы в HTML
    const $ = cheerio.load(htmlRaw);
    // Собираем все реально используемые классы
    const usedClasses = new Set();
    $('[class]').each((_, el) => {
        const orig = $(el).attr('class');
        orig.split(/\s+/).forEach((cls) => usedClasses.add(cls));
        const uno = orig.split(/\s+/).flatMap((cls) => classMap[cls] || cls);
        $(el).attr('class', uno.join(' '));
    });
    const htmlOut = $.html();
    // 3. Генерируем финальный CSS через UnoCSS
    const { createGenerator } = await import('@unocss/core');
    const { default: presetUno } = await import('@unocss/preset-uno');
    const { default: presetAttributify } = await import('@unocss/preset-attributify');
    const { default: presetIcons } = await import('@unocss/preset-icons');
    const uno = createGenerator({ presets: [presetUno, presetAttributify, presetIcons] });
    // Собираем все uno-классы, которые реально используются, включая унарные
    const allUnoClasses = [
        ...Object.values(classMap).flat(),
        ...Array.from(usedClasses).filter(cls => !(cls in classMap)),
    ];
    const { css } = await uno.generate(allUnoClasses.join(' '));
    return { html: htmlOut, css };
}
//# sourceMappingURL=full-processor.js.map