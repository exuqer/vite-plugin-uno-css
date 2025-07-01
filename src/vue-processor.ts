import { parse as parseSFC } from '@vue/compiler-sfc';
import { parse as parseTemplateAST, transform, generate, NodeTypes, AttributeNode } from '@vue/compiler-dom';
// import { parse } from 'node-html-parser';
import { parse as parseCSS, walk } from 'css-tree';
import { CSSUtils } from './utils';

export class VueProcessor {
  async process(code: string, id: string, classMappingCache: Map<string, string>, allUnoClasses?: Set<string>): Promise<string> {
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
      // Собираем новый SFC
      let result = '';
      if (processedTemplate) {
        result += `<template>${processedTemplate}</template>\n`;
      }
      if (descriptor.script) {
        result += code.slice(descriptor.script.loc.start.offset, descriptor.script.loc.end.offset) + '\n';
      }
      if (descriptor.scriptSetup) {
        result += code.slice(descriptor.scriptSetup.loc.start.offset, descriptor.scriptSetup.loc.end.offset) + '\n';
      }
      for (const style of descriptor.styles) {
        result += code.slice(style.loc.start.offset, style.loc.end.offset) + '\n';
      }
      if (allUnoClasses) {
        for (const uno of classMappingCache.values()) {
          uno.split(' ').forEach(cls => allUnoClasses.add(cls));
        }
      }
      return result;
    } catch (error) {
      console.error('Error processing Vue file:', error);
      return code;
    }
  }

  private async processTemplate(template: string, classMappingCache: Map<string, string>): Promise<string> {
    try {
      const ast = parseTemplateAST(template);
      transform(ast, {
        nodeTransforms: [node => {
          if (node.type === NodeTypes.ELEMENT && node.props) {
            for (const prop of node.props) {
              if (prop.type === NodeTypes.ATTRIBUTE && prop.name === 'class' && prop.value) {
                const classes = prop.value.content.split(' ').filter(Boolean);
                const unoClasses = classes.map((cls: string) => classMappingCache.get(cls) || cls);
                prop.value.content = unoClasses.join(' ');
              }
            }
          }
        }]
      });
      // Используем готовый генератор
      const { code } = generate(ast, { mode: 'module' });
      // Извлекаем строку шаблона из кода (между return `...`)
      const match = code.match(/return `([\s\S]*)`/);
      if (match) {
        // Возвращаем строку шаблона для SFC, а не HTML!
        return match[1];
      }
      return template;
    } catch (error) {
      console.error('Error parsing Vue template with AST:', error);
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