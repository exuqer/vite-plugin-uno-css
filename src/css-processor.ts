import { parse, walk } from 'css-tree';
import type { UnoGenerator } from '@unocss/core';
import { CSSUtils } from './utils';

export class CSSProcessor {
  constructor(private uno: UnoGenerator) {}

  async process(code: string, id: string, classMappingCache: Map<string, string>, allUnoClasses?: Set<string>): Promise<string> {
    try {
      console.log(`[css-processor] Processing CSS file: ${id}`);
      
      // Всегда используем fallback парсинг, так как он работает лучше
      await this.fallbackExtractClasses(code, classMappingCache, allUnoClasses);
      
      console.log(`[css-processor] Found ${classMappingCache.size} classes in ${id}`);
      
      // В dev режиме возвращаем пустой CSS, так как все стили будут сгенерированы UnoCSS
      // В обычном режиме возвращаем исходный CSS
      return '';
    } catch (error) {
      console.error('Error processing CSS:', error);
      return code;
    }
  }

  private async extractClassesFromCSS(ast: any, classMappingCache: Map<string, string>): Promise<void> {
    console.log(`[css-processor] Starting to extract classes from CSS AST`);
    
    walk(ast, {
      visit: 'Rule',
      enter: async (node: any) => {
        if (node.type === 'Rule') {
          console.log(`[css-processor] Processing rule:`, node);
          await this.processRule(node, classMappingCache);
        }
      }
    });
  }

  private async processRule(rule: any, classMappingCache: Map<string, string>): Promise<void> {
    const selectors = CSSUtils.extractSelectors(rule.prelude);
    const properties = CSSUtils.extractProperties(rule.block);

    console.log(`[css-processor] Found selectors:`, selectors);
    console.log(`[css-processor] Found properties:`, properties.length);

    if (!selectors.length || !properties.length) {
      return;
    }

    for (const selector of selectors) {
      const className = CSSUtils.extractClassName(selector);
      console.log(`[css-processor] Extracted className:`, className);
      
      if (className) {
        const unoClasses = await this.convertPropertiesToUnoClasses(properties);
        console.log(`[css-processor] Converted to uno classes:`, unoClasses);
        
        if (unoClasses.length > 0) {
          classMappingCache.set(className, unoClasses.join(' '));
          console.log(`[css-processor] Mapped ${className} -> ${unoClasses.join(' ')}`);
        }
      }
    }
  }

  private async convertPropertiesToUnoClasses(properties: any[]): Promise<string[]> {
    const unoClasses: string[] = [];
    
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

  private async fallbackExtractClasses(css: string, classMappingCache: Map<string, string>, allUnoClasses?: Set<string>): Promise<void> {
    // Всегда используем RegExp для извлечения классов
    await this.regexExtractClasses(css, classMappingCache, allUnoClasses);
  }

  private async regexExtractClasses(css: string, classMappingCache: Map<string, string>, allUnoClasses?: Set<string>): Promise<void> {
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
      const unoClasses = await this.convertPropertiesStringToUnoClasses(properties);
      if (unoClasses.length > 0) {
        classMappingCache.set(className, unoClasses.join(' '));
        if (allUnoClasses) {
          for (const unoClass of unoClasses) {
            allUnoClasses.add(unoClass);
          }
        }
        console.log(`[css-processor] Mapped ${className} -> ${unoClasses.join(' ')}`);
      }
    }
  }

  private async convertPropertiesStringToUnoClasses(properties: string): Promise<string[]> {
    const unoClasses: string[] = [];
    
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