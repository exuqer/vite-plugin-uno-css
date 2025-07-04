import { parse as parseSFC } from '@vue/compiler-sfc';
// import { parse } from 'node-html-parser';
import { parse as parseCSS, walk } from 'css-tree';
import { CSSUtils } from './utils';
// Вспомогательная функция для корректного разбиения UnoCSS-классов с arbitrary values
function splitUnoClasses(str) {
    const result = [];
    let current = '';
    let bracket = 0;
    for (const char of str) {
        if (char === '[')
            bracket++;
        if (char === ']')
            bracket--;
        if (char === ' ' && bracket === 0) {
            if (current)
                result.push(current);
            current = '';
        }
        else {
            current += char;
        }
    }
    if (current)
        result.push(current);
    return result;
}
export class VueProcessor {
    async process(code, id, classMappingCache, allUnoClasses) {
        try {
            const { descriptor } = parseSFC(code);
            // 1. Сначала обработать все стили и построить маппинг
            for (const style of descriptor.styles) {
                const styleContent = code.slice(style.loc.start.offset, style.loc.end.offset);
                await this.extractClassesFromStyles(styleContent, classMappingCache);
            }
            // 2. Теперь обработать шаблон
            let processedTemplate = descriptor.template?.content || '';
            if (processedTemplate) {
                processedTemplate = await this.processTemplate(processedTemplate, classMappingCache);
            }
            if (allUnoClasses) {
                for (const uno of classMappingCache.values()) {
                    splitUnoClasses(uno).forEach(cls => allUnoClasses.add(cls));
                }
            }
            // Новый способ: заменяем только <template>...</template> в исходном коде
            if (processedTemplate) {
                return code.replace(/<template[^>]*>[\s\S]*?<\/template>/, `<template>${processedTemplate}</template>`);
            }
            return code;
        }
        catch (error) {
            console.error('Error processing Vue file:', error);
            return code;
        }
    }
    async processTemplate(template, classMappingCache) {
        // Временно отключено для диагностики ошибок
        return template;
    }
    async extractClassesFromStyles(styles, classMappingCache) {
        try {
            // Парсим CSS с помощью css-tree для более точного извлечения классов
            const ast = parseCSS(styles);
            walk(ast, {
                visit: 'Rule',
                enter: async (node) => {
                    if (node.type === 'Rule') {
                        await this.processCSSRule(node, classMappingCache);
                    }
                }
            });
        }
        catch (error) {
            console.error('Error extracting classes from styles:', error);
            // Fallback к простому парсингу
            await this.fallbackExtractClasses(styles, classMappingCache);
        }
    }
    async processCSSRule(rule, classMappingCache) {
        const selectors = CSSUtils.extractSelectors(rule.prelude);
        const properties = CSSUtils.extractProperties(rule.block);
        if (!selectors.length || !properties.length) {
            return;
        }
        for (const selector of selectors) {
            const className = CSSUtils.extractClassName(selector);
            if (className) {
                // Пропускаем scoped классы
                if (className.includes('data-v-')) {
                    continue;
                }
                const unoClasses = await this.convertPropertiesToUnoClasses(properties);
                if (unoClasses.length > 0) {
                    classMappingCache.set(className, unoClasses.join(' '));
                    console.log(`[vue-processor] Mapped ${className} -> ${unoClasses.join(' ')}`);
                }
            }
        }
    }
    async convertPropertiesToUnoClasses(properties) {
        const unoClasses = [];
        for (const property of properties) {
            const propertyName = property.property;
            const propertyValue = CSSUtils.propertyValueToString(property.value);
            const unoClassArr = CSSUtils.convertPropertyToUnoClass(propertyName, propertyValue);
            if (unoClassArr && unoClassArr.length > 0) {
                unoClasses.push(...unoClassArr);
            }
        }
        return unoClasses;
    }
    async fallbackExtractClasses(styles, classMappingCache) {
        // Простой парсинг CSS для извлечения классов
        const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([\s\S]*?)\}/g;
        let match;
        while ((match = classRegex.exec(styles)) !== null) {
            const className = match[1];
            const properties = match[2];
            console.log('[vue-processor][fallback] class:', className, 'props:', properties);
            // Пропускаем scoped классы
            if (className.includes('data-v-')) {
                continue;
            }
            // Конвертируем свойства в UnoCSS классы
            const unoClasses = await this.convertPropertiesStringToUnoClasses(properties);
            if (unoClasses.length > 0) {
                classMappingCache.set(className, unoClasses.join(' '));
                console.log(`[vue-processor] Mapped ${className} -> ${unoClasses.join(' ')}`);
            }
        }
    }
    async convertPropertiesStringToUnoClasses(properties) {
        const unoClasses = [];
        // Парсим CSS свойства
        const propertyRegex = /([^:]+):\s*([^;]+);/g;
        let match;
        while ((match = propertyRegex.exec(properties)) !== null) {
            const property = match[1].trim();
            const value = match[2].trim();
            const unoClassArr = CSSUtils.convertPropertyToUnoClass(property, value);
            if (unoClassArr && unoClassArr.length > 0) {
                unoClasses.push(...unoClassArr);
            }
        }
        return unoClasses;
    }
}
//# sourceMappingURL=vue-processor.js.map