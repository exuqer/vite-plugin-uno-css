import { parse } from 'node-html-parser';

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

export class HTMLProcessor {
  async process(code: string, id: string, classMappingCache: Map<string, string>): Promise<string> {
    try {
      // Если это HTML файл, обрабатываем его напрямую
      if (id.endsWith('.html')) {
        return await this.processHTML(code, classMappingCache);
      }

      // Ищем HTML строки в JS/TS коде
      const htmlMatches = code.match(/`([^`]*<[^`]*>[^`]*)`/g) || [];
      
      let processedCode = code;
      
      for (const htmlMatch of htmlMatches) {
        const htmlContent = htmlMatch.slice(1, -1); // Убираем backticks
        const processedHTML = await this.processHTML(htmlContent, classMappingCache);
        processedCode = processedCode.replace(htmlMatch, `\`${processedHTML}\``);
      }
      
      // Также обрабатываем обычные строки с HTML
      const stringMatches = code.match(/"([^"]*<[^"]*>[^"]*)"/g) || [];
      
      for (const stringMatch of stringMatches) {
        const htmlContent = stringMatch.slice(1, -1); // Убираем кавычки
        const processedHTML = await this.processHTML(htmlContent, classMappingCache);
        processedCode = processedCode.replace(stringMatch, `"${processedHTML}"`);
      }
      
      return processedCode;
    } catch (error) {
      console.error('Error processing HTML in JS/TS file:', error);
      return code;
    }
  }

  private async processHTML(html: string, classMappingCache: Map<string, string>): Promise<string> {
    try {
      const root = parse(html);
      
      // Обрабатываем все элементы с классами
      const elements = root.querySelectorAll('*');
      
      for (const element of elements) {
        const classAttr = element.getAttribute('class');
        if (classAttr) {
          const classes = splitUnoClasses(classAttr).filter(Boolean);
          const processedClasses: string[] = [];
          
          for (const className of classes) {
            const unoClasses = classMappingCache.get(className);
            if (unoClasses) {
              processedClasses.push(...splitUnoClasses(unoClasses));
            } else {
              processedClasses.push(className);
            }
          }
          
          if (processedClasses.length > 0) {
            element.setAttribute('class', processedClasses.join(' '));
          }
        }
      }
      
      return root.toString();
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return html;
    }
  }

  addCSSLink(html: string, cssFileName: string): string {
    try {
      const root = parse(html);
      const head = root.querySelector('head');
      
      if (head) {
        // Удаляем ссылки на исходные CSS файлы
        const cssLinks = head.querySelectorAll('link[rel="stylesheet"]');
        for (const link of cssLinks) {
          const href = link.getAttribute('href');
          if (href && (href.includes('.css') || href.includes('style.css'))) {
            link.remove();
          }
        }
        
        // Проверяем, есть ли уже ссылка на этот CSS файл
        const existingLink = head.querySelector(`link[href="${cssFileName}"]`);
        if (!existingLink) {
          const linkElement = parse(`<link rel="stylesheet" href="${cssFileName}">`);
          head.appendChild(linkElement);
        }
      }
      
      return root.toString();
    } catch (error) {
      console.error('Error adding CSS link:', error);
      return html;
    }
  }
} 