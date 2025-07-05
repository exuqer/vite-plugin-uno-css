import type { UnoGenerator } from '@unocss/core';
import { convertPropertyToUnoClass } from './utils';

export async function processCSS(
  code: string, 
  id: string, 
  classMappingCache: Map<string, string>, 
  allUnoClasses?: Set<string>
): Promise<string> {
  try {
    // Всегда используем fallback парсинг, так как он работает лучше
    await fallbackExtractClasses(code, classMappingCache, allUnoClasses);
    
    // В dev режиме возвращаем пустой CSS, так как все стили будут сгенерированы UnoCSS
    // В обычном режиме возвращаем исходный CSS
    return '';
  } catch (error) {
    console.error('Error processing CSS:', error);
    return code;
  }
}

async function fallbackExtractClasses(
  css: string, 
  classMappingCache: Map<string, string>, 
  allUnoClasses?: Set<string>
): Promise<void> {
  // Всегда используем RegExp для извлечения классов
  await regexExtractClasses(css, classMappingCache, allUnoClasses);
}

async function regexExtractClasses(
  css: string, 
  classMappingCache: Map<string, string>, 
  allUnoClasses?: Set<string>
): Promise<void> {
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

async function convertPropertiesStringToUnoClasses(properties: string): Promise<string[]> {
  const unoClasses: string[] = [];
  
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