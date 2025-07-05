import { convertPropertyToUnoClass } from './utils';
export async function processCSS(code, id, classMappingCache, allUnoClasses) {
    try {
        // Всегда используем fallback парсинг, так как он работает лучше
        await fallbackExtractClasses(code, classMappingCache, allUnoClasses);
        // В dev режиме возвращаем пустой CSS, так как все стили будут сгенерированы UnoCSS
        // В обычном режиме возвращаем исходный CSS
        return '';
    }
    catch (error) {
        console.error('Error processing CSS:', error);
        return code;
    }
}
async function fallbackExtractClasses(css, classMappingCache, allUnoClasses) {
    // Всегда используем RegExp для извлечения классов
    await regexExtractClasses(css, classMappingCache, allUnoClasses);
}
async function regexExtractClasses(css, classMappingCache, allUnoClasses) {
    // Простой парсинг CSS для извлечения классов
    const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match;
    while ((match = classRegex.exec(css)) !== null) {
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
            if (allUnoClasses) {
                for (const unoClass of unoClasses) {
                    allUnoClasses.add(unoClass);
                }
            }
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
//# sourceMappingURL=css-processor.js.map