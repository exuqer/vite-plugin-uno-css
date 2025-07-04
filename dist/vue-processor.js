import { parse as parseSFC } from '@vue/compiler-sfc';
import { parse as parseTemplateAST, generate, NodeTypes } from '@vue/compiler-dom';
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
            // 1. Сначала обработать ВСЕ стили и построить полный маппинг
            for (const style of descriptor.styles) {
                const styleContent = code.slice(style.loc.start.offset, style.loc.end.offset);
                console.log('[vue-processor] Processing style block:', styleContent.substring(0, 100) + '...');
                await this.extractClassesFromStyles(styleContent, classMappingCache);
            }
            // 2. Теперь обработать шаблон с уже полным маппингом
            let processedTemplate = descriptor.template?.content || '';
            if (processedTemplate) {
                console.log('[vue-processor] Processing template with full mapping:', Array.from(classMappingCache.entries()));
                processedTemplate = await this.processTemplate(processedTemplate, classMappingCache);
            }
            // 3. Собрать все UnoCSS классы
            if (allUnoClasses) {
                for (const unoClass of classMappingCache.values()) {
                    const classes = unoClass.split(/\s+/);
                    classes.forEach(cls => allUnoClasses.add(cls));
                }
            }
            // 4. Сгенерировать новый код с обработанным шаблоном
            let result = code;
            if (descriptor.template && processedTemplate !== descriptor.template.content) {
                const templateStart = descriptor.template.loc.start.offset;
                const templateEnd = descriptor.template.loc.end.offset;
                result = code.slice(0, templateStart) + processedTemplate + code.slice(templateEnd);
            }
            return result;
        }
        catch (error) {
            console.error('[vue-processor] Error processing Vue file:', error);
            return code;
        }
    }
    async processTemplate(template, classMappingCache) {
        console.log('[vue-processor] Processing template:', template);
        console.log('[vue-processor] Available mappings:', Array.from(classMappingCache.entries()));
        // Парсим шаблон как AST
        const ast = parseTemplateAST(template);
        // Рекурсивно обходим AST и патчим классы
        function patchNode(node) {
            if (node.type === NodeTypes.ELEMENT) {
                // Найти атрибут class
                const classAttr = node.props.find((p) => p.type === NodeTypes.ATTRIBUTE && p.name === 'class');
                if (classAttr && classAttr.value && classAttr.value.content) {
                    // Разбить на классы
                    const orig = classAttr.value.content;
                    console.log('[vue-processor] Found class attribute:', orig);
                    const uno = orig.split(/\s+/)
                        .map(cls => {
                        const mapped = classMappingCache.get(cls);
                        console.log('[vue-processor] Mapping class:', cls, '->', mapped || cls);
                        return mapped || cls;
                    })
                        .join(' ');
                    console.log('[vue-processor] Final classes:', uno);
                    classAttr.value.content = uno;
                }
            }
            if (node.children) {
                node.children.forEach(patchNode);
            }
        }
        patchNode(ast);
        // Генерируем новый шаблон
        const { code } = generate(ast, { mode: 'module' });
        // Извлекаем только строку шаблона из сгенерированного кода
        const match = code.match(/return `([\s\S]*)`;/);
        const result = match ? match[1] : template;
        console.log('[vue-processor] Generated template:', result);
        return result;
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