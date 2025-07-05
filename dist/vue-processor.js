import { parse as parseSFC } from '@vue/compiler-sfc';
import { parse as parseTemplateAST, generate, NodeTypes } from '@vue/compiler-dom';
import { parse as parseCSS, walk } from 'css-tree';
import { convertPropertyToUnoClass, extractSelectors, extractProperties, extractClassName, propertyValueToString } from './utils';
export async function processVue(code, id, classMappingCache, allUnoClasses) {
    try {
        const { descriptor } = parseSFC(code);
        // 1. Сначала обработать ВСЕ стили и построить полный маппинг
        for (const style of descriptor.styles) {
            const styleContent = code.slice(style.loc.start.offset, style.loc.end.offset);
            await extractClassesFromStyles(styleContent, classMappingCache);
        }
        // 2. Теперь обработать шаблон с уже полным маппингом
        let processedTemplate = descriptor.template?.content || '';
        if (processedTemplate) {
            processedTemplate = await processTemplate(processedTemplate, classMappingCache);
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
async function processTemplate(template, classMappingCache) {
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
                const uno = orig.split(/\s+/)
                    .map(cls => {
                    const mapped = classMappingCache.get(cls);
                    return mapped || cls;
                })
                    .join(' ');
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
    return result;
}
async function extractClassesFromStyles(styles, classMappingCache) {
    try {
        // Парсим CSS с помощью css-tree для более точного извлечения классов
        const ast = parseCSS(styles);
        walk(ast, {
            visit: 'Rule',
            enter: async (node) => {
                if (node.type === 'Rule') {
                    await processCSSRule(node, classMappingCache);
                }
            }
        });
    }
    catch (error) {
        console.error('Error extracting classes from styles:', error);
        // Fallback к простому парсингу
        await fallbackExtractClasses(styles, classMappingCache);
    }
}
async function processCSSRule(rule, classMappingCache) {
    const selectors = extractSelectors(rule.prelude);
    const properties = extractProperties(rule.block);
    if (!selectors.length || !properties.length) {
        return;
    }
    for (const selector of selectors) {
        const className = extractClassName(selector);
        if (className) {
            // Пропускаем scoped классы
            if (className.includes('data-v-')) {
                continue;
            }
            const unoClasses = await convertPropertiesToUnoClasses(properties);
            if (unoClasses.length > 0) {
                classMappingCache.set(className, unoClasses.join(' '));
            }
        }
    }
}
async function convertPropertiesToUnoClasses(properties) {
    const unoClasses = [];
    for (const property of properties) {
        const propertyName = property.property;
        const propertyValue = propertyValueToString(property.value);
        const unoClassArr = convertPropertyToUnoClass(propertyName, propertyValue);
        if (unoClassArr && unoClassArr.length > 0) {
            unoClasses.push(...unoClassArr);
        }
    }
    return unoClasses;
}
async function fallbackExtractClasses(styles, classMappingCache) {
    // Простой парсинг CSS для извлечения классов
    const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([\s\S]*?)\}/g;
    let match;
    while ((match = classRegex.exec(styles)) !== null) {
        const className = match[1];
        const properties = match[2];
        // Пропускаем scoped классы
        if (className.includes('data-v-')) {
            continue;
        }
        // Конвертируем свойства в UnoCSS классы
        const unoClasses = await convertPropertiesStringToUnoClasses(properties);
        if (unoClasses.length > 0) {
            classMappingCache.set(className, unoClasses.join(' '));
        }
    }
}
async function convertPropertiesStringToUnoClasses(properties) {
    const unoClasses = [];
    // Парсим CSS свойства
    const propertyRegex = /([^:]+):\s*([^;]+);/g;
    let match;
    while ((match = propertyRegex.exec(properties)) !== null) {
        const property = match[1].trim();
        const value = match[2].trim();
        const unoClassArr = convertPropertyToUnoClass(property, value);
        if (unoClassArr && unoClassArr.length > 0) {
            unoClasses.push(...unoClassArr);
        }
    }
    return unoClasses;
}
//# sourceMappingURL=vue-processor.js.map