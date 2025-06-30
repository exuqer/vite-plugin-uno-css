import { parse } from 'node-html-parser';
import { parse as parseCSS, walk } from 'css-tree';
import { CSSUtils } from './utils';

export class VueProcessor {
  async process(code: string, id: string, classMappingCache: Map<string, string>, allUnoClasses?: Set<string>): Promise<string> {
    try {
      console.log(`[vue-processor] Processing Vue file: ${id}`);
      console.log(`[vue-processor] Code length: ${code.length}`);
      console.log(`[vue-processor] Code preview: ${code.substring(0, 200)}...`);
      
      // Разбираем Vue файл на секции
      const templateMatch = code.match(/<template[^>]*>([\s\S]*?)<\/template>/);
      const styleMatches = code.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
      
      console.log(`[vue-processor] Found ${styleMatches?.length || 0} style blocks`);
      console.log(`[vue-processor] Template found: ${!!templateMatch}`);
      
      if (styleMatches) {
        styleMatches.forEach((match, index) => {
          console.log(`[vue-processor] Style block ${index}: ${match.substring(0, 100)}...`);
        });
      }
      
      let processedCode = code;
      
      // Обрабатываем template
      if (templateMatch) {
        const templateContent = templateMatch[1];
        const processedTemplate = await this.processTemplate(templateContent, classMappingCache);
        processedCode = processedCode.replace(templateMatch[0], 
          templateMatch[0].replace(templateContent, processedTemplate));
      }
      
      // Обрабатываем стили
      if (styleMatches) {
        for (const styleMatch of styleMatches) {
          const styleContent = styleMatch.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1];
          if (styleContent) {
            console.log(`[vue-processor] Processing style block:`, styleContent.substring(0, 100) + '...');
            
            // Извлекаем классы из стилей и добавляем в кэш
            await this.extractClassesFromStyles(styleContent, classMappingCache);
            
            // Удаляем scoped атрибут
            const processedStyleMatch = styleMatch.replace(/scoped/g, '');
            processedCode = processedCode.replace(styleMatch, processedStyleMatch);
          }
        }
      }
      
      if (allUnoClasses) {
        for (const uno of classMappingCache.values()) {
          uno.split(' ').forEach(cls => allUnoClasses.add(cls));
        }
      }
      
      console.log(`[vue-processor] Cache size after processing: ${classMappingCache.size}`);
      return processedCode;
    } catch (error) {
      console.error('Error processing Vue file:', error);
      return code;
    }
  }

  private async processTemplate(template: string, classMappingCache: Map<string, string>): Promise<string> {
    try {
      const root = parse(template);
      
      // Обрабатываем все элементы с классами
      const elements = root.querySelectorAll('*');
      
      for (const element of elements) {
        const classAttr = element.getAttribute('class');
        if (classAttr) {
          const classes = classAttr.split(' ').filter(Boolean);
          const processedClasses: string[] = [];
          for (const className of classes) {
            if (!className.startsWith('data-v-')) {
              const unoClasses = classMappingCache.get(className);
              if (unoClasses) {
                processedClasses.push(...unoClasses.split(' '));
              } else {
                // Логируем предупреждение и оставляем класс для отладки
                console.warn(`[vue-processor] Класс '${className}' не найден в маппинге!`);
                processedClasses.push(className);
              }
            }
          }
          if (processedClasses.length > 0) {
            element.setAttribute('class', processedClasses.join(' '));
          } else {
            element.removeAttribute('class');
          }
        }
        
        // Удаляем data-v атрибуты
        const attributes = element.attributes;
        const dataVAttrs: string[] = [];
        for (const attr in attributes) {
          if (attr.startsWith('data-v-')) {
            dataVAttrs.push(attr);
          }
        }
        for (const attr of dataVAttrs) {
          element.removeAttribute(attr);
        }
      }
      
      return root.toString();
    } catch (error) {
      console.error('Error parsing Vue template:', error);
      return template;
    }
  }

  private async extractClassesFromStyles(styles: string, classMappingCache: Map<string, string>): Promise<void> {
    try {
      // Парсим CSS с помощью css-tree для более точного извлечения классов
      const ast = parseCSS(styles);
      
      walk(ast, {
        visit: 'Rule',
        enter: async (node: any) => {
          if (node.type === 'Rule') {
            await this.processCSSRule(node, classMappingCache);
          }
        }
      });
    } catch (error) {
      console.error('Error extracting classes from styles:', error);
      // Fallback к простому парсингу
      await this.fallbackExtractClasses(styles, classMappingCache);
    }
  }

  private async processCSSRule(rule: any, classMappingCache: Map<string, string>): Promise<void> {
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

  private async fallbackExtractClasses(styles: string, classMappingCache: Map<string, string>): Promise<void> {
    // Простой парсинг CSS для извлечения классов
    const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match;
    
    while ((match = classRegex.exec(styles)) !== null) {
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
        console.log(`[vue-processor] Mapped ${className} -> ${unoClasses.join(' ')}`);
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