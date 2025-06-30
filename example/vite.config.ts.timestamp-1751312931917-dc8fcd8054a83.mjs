// vite.config.ts
import { defineConfig } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/example/node_modules/vite/dist/node/index.js";
import vue from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/example/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// ../dist/plugin.js
import fs from "fs/promises";
import path from "path";

// ../dist/css-processor.js
import { walk } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/css-tree/lib/index.js";

// ../dist/utils.js
var CSSUtils = class {
  /**
   * Преобразует CSS свойство в UnoCSS класс
   */
  static convertPropertyToUnoClass(property, value) {
    const trimmedValue = value.trim();
    if (property === "display") {
      const displayMap = {
        "flex": "flex",
        "grid": "grid",
        "block": "block",
        "inline": "inline",
        "inline-block": "inline-block",
        "none": "hidden"
      };
      const unoClass = displayMap[trimmedValue];
      return unoClass ? [unoClass] : null;
    }
    if (property === "position") {
      const positionMap = {
        "relative": "relative",
        "absolute": "absolute",
        "fixed": "fixed",
        "sticky": "sticky",
        "static": "static"
      };
      const unoClass = positionMap[trimmedValue];
      return unoClass ? [unoClass] : null;
    }
    if (property === "background-image") {
      if (trimmedValue.startsWith("url(")) {
        return [`bg-[${trimmedValue}]`];
      } else if (trimmedValue.startsWith("http")) {
        return [`bg-[url(${trimmedValue})]`];
      } else {
        return [`bg-[${trimmedValue}]`];
      }
    }
    if (property === "background-color") {
      if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
        return [`bg-[${trimmedValue}]`];
      if (/^#|^rgb|^hsl/.test(trimmedValue))
        return [`bg-[${trimmedValue}]`];
      if (/^[a-zA-Z]+$/.test(trimmedValue))
        return [`bg-[${trimmedValue}]`];
      return [`bg-[${trimmedValue}]`];
    }
    if (property === "color") {
      if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
        return [`text-[${trimmedValue}]`];
      if (/^#|^rgb|^hsl/.test(trimmedValue))
        return [`text-[${trimmedValue}]`];
      if (/^[a-zA-Z]+$/.test(trimmedValue))
        return [`text-[${trimmedValue}]`];
      return [`text-[${trimmedValue}]`];
    }
    if (property === "border-radius") {
      if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
        return [`rounded-[${trimmedValue}]`];
      const unoRadiusMap = {
        "4px": "rounded",
        "8px": "rounded-md",
        "12px": "rounded-lg",
        "9999px": "rounded-full"
      };
      if (unoRadiusMap[trimmedValue])
        return [unoRadiusMap[trimmedValue]];
      return [`rounded-[${trimmedValue}]`];
    }
    if (property === "font-weight") {
      const unoWeightMap = {
        "bold": "font-bold",
        "normal": "font-normal",
        "600": "font-semibold",
        "700": "font-bold",
        "400": "font-normal"
      };
      if (unoWeightMap[trimmedValue])
        return [unoWeightMap[trimmedValue]];
      return [`font-[${trimmedValue}]`];
    }
    if (property === "font-size") {
      if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
        return [`text-[${trimmedValue}]`];
      const unoSizeMap = {
        "16px": "text-base",
        "18px": "text-lg",
        "20px": "text-xl",
        "24px": "text-2xl",
        "32px": "text-4xl",
        "12px": "text-xs",
        "14px": "text-sm"
      };
      if (unoSizeMap[trimmedValue])
        return [unoSizeMap[trimmedValue]];
      return [`text-[${trimmedValue}]`];
    }
    if (property === "text-align") {
      const alignMap = {
        "center": "text-center",
        "left": "text-left",
        "right": "text-right",
        "justify": "text-justify",
        "start": "text-start",
        "end": "text-end"
      };
      return alignMap[trimmedValue] ? [alignMap[trimmedValue]] : [`text-[${trimmedValue}]`];
    }
    if (property === "border-width") {
      const unoBorderWidthMap = {
        "1px": "border",
        "2px": "border-2",
        "4px": "border-4",
        "8px": "border-8"
      };
      if (unoBorderWidthMap[trimmedValue])
        return [unoBorderWidthMap[trimmedValue]];
      return [`border-[${trimmedValue}]`];
    }
    if (property === "border-style") {
      const unoBorderStyleMap = {
        "solid": "border-solid",
        "dashed": "border-dashed",
        "dotted": "border-dotted",
        "double": "border-double",
        "none": "border-none"
      };
      if (unoBorderStyleMap[trimmedValue])
        return [unoBorderStyleMap[trimmedValue]];
      return [`border-[${trimmedValue}]`];
    }
    if (property === "border-color") {
      if (/^#|^rgb|^hsl/.test(trimmedValue))
        return [`border-[${trimmedValue}]`];
      if (/^[a-zA-Z]+$/.test(trimmedValue))
        return [`border-[${trimmedValue}]`];
      return [`border-[${trimmedValue}]`];
    }
    if (property === "width") {
      if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
        return [`w-[${trimmedValue}]`];
      const unoWidthMap = {
        "100%": "w-full",
        "100vw": "w-screen",
        "auto": "w-auto",
        "100px": "w-100px",
        "200px": "w-200px",
        "150px": "w-150px"
      };
      if (unoWidthMap[trimmedValue])
        return [unoWidthMap[trimmedValue]];
      return [`w-[${trimmedValue}]`];
    }
    if (property === "height") {
      if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
        return [`h-[${trimmedValue}]`];
      const unoHeightMap = {
        "100%": "h-full",
        "100vh": "h-screen",
        "auto": "h-auto",
        "100px": "h-100px",
        "200px": "h-200px",
        "150px": "h-150px"
      };
      if (unoHeightMap[trimmedValue])
        return [unoHeightMap[trimmedValue]];
      return [`h-[${trimmedValue}]`];
    }
    if (property === "margin" || property === "padding") {
      return this.processShorthandProperty(property, trimmedValue);
    }
    if (property === "margin-top")
      return [`mt-[${trimmedValue}]`];
    if (property === "margin-right")
      return [`mr-[${trimmedValue}]`];
    if (property === "margin-bottom")
      return [`mb-[${trimmedValue}]`];
    if (property === "margin-left")
      return [`ml-[${trimmedValue}]`];
    if (property === "padding-top")
      return [`pt-[${trimmedValue}]`];
    if (property === "padding-right")
      return [`pr-[${trimmedValue}]`];
    if (property === "padding-bottom")
      return [`pb-[${trimmedValue}]`];
    if (property === "padding-left")
      return [`pl-[${trimmedValue}]`];
    if (property === "border") {
      const parts = trimmedValue.split(/\s+/);
      const unoClasses = [];
      for (const part of parts) {
        if (["solid", "dashed", "dotted", "double", "none"].includes(part)) {
          unoClasses.push(`border-${part}`);
        } else if (/^\d+(px|em|rem)?$/.test(part)) {
          const unoBorderWidthMap = {
            "1px": "border",
            "2px": "border-2",
            "4px": "border-4",
            "8px": "border-8"
          };
          unoClasses.push(unoBorderWidthMap[part] || `border-[${part}]`);
        } else if (part.startsWith("#") || part.startsWith("rgb") || part.startsWith("hsl")) {
          unoClasses.push(`border-[${part}]`);
        }
      }
      return unoClasses.length > 0 ? unoClasses : null;
    }
    if (property === "box-shadow") {
      return [`shadow-[${trimmedValue}]`];
    }
    if (property === "opacity") {
      return [`opacity-[${trimmedValue}]`];
    }
    if (property === "z-index") {
      return [`z-[${trimmedValue}]`];
    }
    if (property === "overflow") {
      return [`overflow-[${trimmedValue}]`];
    }
    if (property === "text-decoration") {
      return [`text-decoration-[${trimmedValue}]`];
    }
    return [`[${property}:${trimmedValue}]`];
  }
  /**
   * Обрабатывает сокращённые свойства margin/padding
   */
  static processShorthandProperty(property, value) {
    const parts = value.split(/\s+/);
    const unoClasses = [];
    const prefix = property[0];
    function format(val) {
      return `[${val}]`;
    }
    if (parts.length === 1) {
      unoClasses.push(`${prefix}-${format(parts[0])}`);
    } else if (parts.length === 2) {
      unoClasses.push(`${prefix}y-${format(parts[0])}`);
      unoClasses.push(`${prefix}x-${format(parts[1])}`);
    } else if (parts.length === 3) {
      unoClasses.push(`${prefix}t-${format(parts[0])}`);
      unoClasses.push(`${prefix}x-${format(parts[1])}`);
      unoClasses.push(`${prefix}b-${format(parts[2])}`);
    } else if (parts.length === 4) {
      unoClasses.push(`${prefix}t-${format(parts[0])}`);
      unoClasses.push(`${prefix}r-${format(parts[1])}`);
      unoClasses.push(`${prefix}b-${format(parts[2])}`);
      unoClasses.push(`${prefix}l-${format(parts[3])}`);
    }
    return unoClasses;
  }
  /**
   * Преобразует CSS AST значение в строку
   */
  static propertyValueToString(value) {
    if (value.type === "Value" && value.children) {
      const result = [];
      let current = value.children.head;
      while (current) {
        const child = current.data;
        let childValue = "";
        if (child.type === "Raw") {
          childValue = child.value;
        } else if (child.type === "String") {
          childValue = `"${child.value}"`;
        } else if (child.type === "Number") {
          childValue = child.value;
        } else if (child.type === "Dimension") {
          childValue = child.value + child.unit;
        } else if (child.type === "Hash") {
          childValue = "#" + child.value;
        } else if (child.type === "Function") {
          let funcStr = child.name + "(";
          if (child.children) {
            let funcCurrent = child.children.head;
            while (funcCurrent) {
              const funcChild = funcCurrent.data;
              if (funcChild.type === "String") {
                funcStr += `"${funcChild.value}"`;
              } else if (funcChild.type === "Number") {
                funcStr += funcChild.value;
              } else if (funcChild.type === "Dimension") {
                funcStr += funcChild.value + funcChild.unit;
              } else if (funcChild.type === "Hash") {
                funcStr += "#" + funcChild.value;
              } else if (funcChild.type === "Raw") {
                funcStr += funcChild.value;
              } else if (funcChild.type === "Identifier") {
                funcStr += funcChild.name;
              }
              funcCurrent = funcCurrent.next;
            }
          }
          funcStr += ")";
          childValue = funcStr;
        } else if (child.type === "Identifier") {
          childValue = child.name;
        } else if (child.value) {
          childValue = child.value;
        }
        if (childValue) {
          result.push(childValue);
        }
        current = current.next;
      }
      return result.join(" ");
    }
    return "";
  }
  /**
   * Извлекает имя класса из CSS селектора
   */
  static extractClassName(selector) {
    const classMatch = selector.match(/\.([a-zA-Z0-9_-]+)/);
    return classMatch ? classMatch[1] : null;
  }
  /**
   * Извлекает селекторы из CSS AST
   */
  static extractSelectors(prelude) {
    const selectors = [];
    if (prelude?.children) {
      for (const selector of prelude.children) {
        if (selector.type === "Selector") {
          const selectorText = this.selectorToString(selector);
          selectors.push(selectorText);
        }
      }
    }
    return selectors;
  }
  /**
   * Преобразует CSS AST селектор в строку
   */
  static selectorToString(selector) {
    let result = "";
    if (selector.children) {
      for (const child of selector.children) {
        if (child.type === "ClassSelector") {
          result += "." + child.name;
        } else if (child.type === "IdSelector") {
          result += "#" + child.name;
        } else if (child.type === "ElementSelector") {
          result += child.name;
        } else if (child.type === "Combinator") {
          result += " " + child.name + " ";
        }
      }
    }
    return result.trim();
  }
  /**
   * Извлекает свойства из CSS AST блока
   */
  static extractProperties(block) {
    const properties = [];
    if (block?.children) {
      for (const child of block.children) {
        if (child.type === "Declaration") {
          properties.push(child);
        }
      }
    }
    return properties;
  }
};

// ../dist/css-processor.js
var CSSProcessor = class {
  constructor(uno) {
    this.uno = uno;
  }
  async process(code, id, classMappingCache) {
    try {
      console.log(`[css-processor] Processing CSS file: ${id}`);
      await this.fallbackExtractClasses(code, classMappingCache);
      console.log(`[css-processor] Found ${classMappingCache.size} classes in ${id}`);
      return "";
    } catch (error) {
      console.error("Error processing CSS:", error);
      return code;
    }
  }
  async extractClassesFromCSS(ast, classMappingCache) {
    console.log(`[css-processor] Starting to extract classes from CSS AST`);
    walk(ast, {
      visit: "Rule",
      enter: async (node) => {
        if (node.type === "Rule") {
          console.log(`[css-processor] Processing rule:`, node);
          await this.processRule(node, classMappingCache);
        }
      }
    });
  }
  async processRule(rule, classMappingCache) {
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
          classMappingCache.set(className, unoClasses.join(" "));
          console.log(`[css-processor] Mapped ${className} -> ${unoClasses.join(" ")}`);
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
  async fallbackExtractClasses(css, classMappingCache) {
    await this.regexExtractClasses(css, classMappingCache);
  }
  async regexExtractClasses(css, classMappingCache) {
    const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match;
    while ((match = classRegex.exec(css)) !== null) {
      const className = match[1];
      const properties = match[2];
      if (className.includes("data-v-")) {
        continue;
      }
      const unoClasses = await this.convertPropertiesStringToUnoClasses(properties);
      if (unoClasses.length > 0) {
        classMappingCache.set(className, unoClasses.join(" "));
        console.log(`[css-processor] Mapped ${className} -> ${unoClasses.join(" ")}`);
      }
    }
  }
  async convertPropertiesStringToUnoClasses(properties) {
    const unoClasses = [];
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
};

// ../dist/vue-processor.js
import { parse } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/node-html-parser/dist/index.js";
import { parse as parseCSS, walk as walk2 } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/css-tree/lib/index.js";
var VueProcessor = class {
  async process(code, id, classMappingCache) {
    try {
      console.log(`[vue-processor] Processing Vue file: ${id}`);
      console.log(`[vue-processor] Code length: ${code.length}`);
      console.log(`[vue-processor] Code preview: ${code.substring(0, 200)}...`);
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
      if (templateMatch) {
        const templateContent = templateMatch[1];
        const processedTemplate = await this.processTemplate(templateContent, classMappingCache);
        processedCode = processedCode.replace(templateMatch[0], templateMatch[0].replace(templateContent, processedTemplate));
      }
      if (styleMatches) {
        for (const styleMatch of styleMatches) {
          const styleContent = styleMatch.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1];
          if (styleContent) {
            console.log(`[vue-processor] Processing style block:`, styleContent.substring(0, 100) + "...");
            await this.extractClassesFromStyles(styleContent, classMappingCache);
            const processedStyleMatch = styleMatch.replace(/scoped/g, "");
            processedCode = processedCode.replace(styleMatch, processedStyleMatch);
          }
        }
      }
      console.log(`[vue-processor] Cache size after processing: ${classMappingCache.size}`);
      return processedCode;
    } catch (error) {
      console.error("Error processing Vue file:", error);
      return code;
    }
  }
  async processTemplate(template, classMappingCache) {
    try {
      const root = parse(template);
      const elements = root.querySelectorAll("*");
      for (const element of elements) {
        const classAttr = element.getAttribute("class");
        if (classAttr) {
          const classes = classAttr.split(" ").filter(Boolean);
          const processedClasses = [];
          for (const className of classes) {
            if (!className.startsWith("data-v-")) {
              const unoClasses = classMappingCache.get(className);
              if (unoClasses) {
                processedClasses.push(...unoClasses.split(" "));
              } else {
                console.warn(`[vue-processor] \u041A\u043B\u0430\u0441\u0441 '${className}' \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0432 \u043C\u0430\u043F\u043F\u0438\u043D\u0433\u0435!`);
                processedClasses.push(className);
              }
            }
          }
          if (processedClasses.length > 0) {
            element.setAttribute("class", processedClasses.join(" "));
          } else {
            element.removeAttribute("class");
          }
        }
        const attributes = element.attributes;
        const dataVAttrs = [];
        for (const attr in attributes) {
          if (attr.startsWith("data-v-")) {
            dataVAttrs.push(attr);
          }
        }
        for (const attr of dataVAttrs) {
          element.removeAttribute(attr);
        }
      }
      return root.toString();
    } catch (error) {
      console.error("Error parsing Vue template:", error);
      return template;
    }
  }
  async extractClassesFromStyles(styles, classMappingCache) {
    try {
      const ast = parseCSS(styles);
      walk2(ast, {
        visit: "Rule",
        enter: async (node) => {
          if (node.type === "Rule") {
            await this.processCSSRule(node, classMappingCache);
          }
        }
      });
    } catch (error) {
      console.error("Error extracting classes from styles:", error);
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
        if (className.includes("data-v-")) {
          continue;
        }
        const unoClasses = await this.convertPropertiesToUnoClasses(properties);
        if (unoClasses.length > 0) {
          classMappingCache.set(className, unoClasses.join(" "));
          console.log(`[vue-processor] Mapped ${className} -> ${unoClasses.join(" ")}`);
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
    const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match;
    while ((match = classRegex.exec(styles)) !== null) {
      const className = match[1];
      const properties = match[2];
      if (className.includes("data-v-")) {
        continue;
      }
      const unoClasses = await this.convertPropertiesStringToUnoClasses(properties);
      if (unoClasses.length > 0) {
        classMappingCache.set(className, unoClasses.join(" "));
        console.log(`[vue-processor] Mapped ${className} -> ${unoClasses.join(" ")}`);
      }
    }
  }
  async convertPropertiesStringToUnoClasses(properties) {
    const unoClasses = [];
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
};

// ../dist/html-processor.js
import { parse as parse2 } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/node-html-parser/dist/index.js";
var HTMLProcessor = class {
  async process(code, id, classMappingCache) {
    try {
      if (id.endsWith(".html")) {
        return await this.processHTML(code, classMappingCache);
      }
      const htmlMatches = code.match(/`([^`]*<[^`]*>[^`]*)`/g) || [];
      let processedCode = code;
      for (const htmlMatch of htmlMatches) {
        const htmlContent = htmlMatch.slice(1, -1);
        const processedHTML = await this.processHTML(htmlContent, classMappingCache);
        processedCode = processedCode.replace(htmlMatch, `\`${processedHTML}\``);
      }
      const stringMatches = code.match(/"([^"]*<[^"]*>[^"]*)"/g) || [];
      for (const stringMatch of stringMatches) {
        const htmlContent = stringMatch.slice(1, -1);
        const processedHTML = await this.processHTML(htmlContent, classMappingCache);
        processedCode = processedCode.replace(stringMatch, `"${processedHTML}"`);
      }
      return processedCode;
    } catch (error) {
      console.error("Error processing HTML in JS/TS file:", error);
      return code;
    }
  }
  async processHTML(html, classMappingCache) {
    try {
      const root = parse2(html);
      const elements = root.querySelectorAll("*");
      for (const element of elements) {
        const classAttr = element.getAttribute("class");
        if (classAttr) {
          const classes = classAttr.split(" ").filter(Boolean);
          const processedClasses = [];
          for (const className of classes) {
            const unoClasses = classMappingCache.get(className);
            if (unoClasses) {
              processedClasses.push(...unoClasses.split(" "));
            } else {
              processedClasses.push(className);
            }
          }
          if (processedClasses.length > 0) {
            element.setAttribute("class", processedClasses.join(" "));
          }
        }
      }
      return root.toString();
    } catch (error) {
      console.error("Error parsing HTML:", error);
      return html;
    }
  }
  addCSSLink(html, cssFileName) {
    try {
      const root = parse2(html);
      const head = root.querySelector("head");
      if (head) {
        const cssLinks = head.querySelectorAll('link[rel="stylesheet"]');
        for (const link of cssLinks) {
          const href = link.getAttribute("href");
          if (href && (href.includes(".css") || href.includes("style.css"))) {
            link.remove();
          }
        }
        const existingLink = head.querySelector(`link[href="${cssFileName}"]`);
        if (!existingLink) {
          const linkElement = parse2(`<link rel="stylesheet" href="${cssFileName}">`);
          head.appendChild(linkElement);
        }
      }
      return root.toString();
    } catch (error) {
      console.error("Error adding CSS link:", error);
      return html;
    }
  }
};

// ../dist/plugin.js
import { createGenerator } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/core/dist/index.mjs";
import presetUno from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/preset-uno/dist/index.mjs";
import presetAttributify from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/preset-attributify/dist/index.mjs";
import presetIcons from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/preset-icons/dist/index.mjs";
import { parse as parseHtml } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/node-html-parser/dist/index.js";
var __vite_injected_original_dirname = "/mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/dist";
function normalizeArbitraryClass(cls) {
  return cls.replace(/^(w|h|m|p|rounded|text|gap|top|left|right|bottom|z|border|inset|min-w|min-h|max-w|max-h)-(\-?\d+(?:px|rem|em|%)?)/, (_, prefix, value) => `${prefix}-[${value}]`);
}
function isUnoClass(cls) {
  return /-|\[.*\]/.test(cls) && !/^[_a-zA-Z0-9]+(__|--)/.test(cls);
}
function UnoCSSPlugin(options = {}) {
  const base = {
    name: "vite-plugin-unocss-css",
    enforce: "pre",
    apply: "build"
  };
  const classMappingCache = /* @__PURE__ */ new Map();
  const cssProcessor = new CSSProcessor(null);
  const vueProcessor = new VueProcessor();
  const htmlProcessor = new HTMLProcessor();
  let unoCssHtml = "";
  let unoCssRaw = "";
  return {
    ...base,
    async transform(code, id) {
      if (id.includes("node_modules") || id.startsWith("\0"))
        return null;
      if (id.endsWith(".css")) {
        await cssProcessor.process(code, id, classMappingCache);
        return "";
      }
      if (id.endsWith(".vue") && code.includes("<template")) {
        let processed = await vueProcessor.process(code, id, classMappingCache);
        processed = processed.replace(/(<template[^>]*>)([\s\S]*?)(<\/template>)/, (full, open, templateContent, close) => {
          const root = parseHtml(`<root>${templateContent}</root>`);
          root.querySelectorAll("[class]").forEach((el) => {
            const orig = el.getAttribute("class");
            const uno = orig.split(/\s+/).map((cls) => {
              const mapped = classMappingCache.get(cls) || cls;
              const normalized = normalizeArbitraryClass(mapped);
              return isUnoClass(normalized) ? normalized : "";
            }).filter(Boolean).join(" ");
            el.setAttribute("class", uno);
          });
          const first = root.firstChild;
          if (first && "innerHTML" in first) {
            return open + first.innerHTML + close;
          } else {
            return open + templateContent + close;
          }
        });
        return processed;
      }
      if (id.endsWith(".html")) {
        const root = parseHtml(code);
        root.querySelectorAll("[class]").forEach((el) => {
          const orig = el.getAttribute("class");
          const uno = orig.split(/\s+/).map((cls) => classMappingCache.get(cls) || cls).join(" ");
          el.setAttribute("class", uno);
        });
        return root.toString();
      }
      if ((id.endsWith(".js") || id.endsWith(".ts")) && (id.includes("/src/") || id.includes("/example/"))) {
        let processed = await htmlProcessor.process(code, id, classMappingCache);
        processed = processed.replace(/class\s*=\s*["']([^"']+)["']/g, (full, classStr) => {
          const unoClasses = classStr.split(/\s+/).map((cls) => classMappingCache.get(cls) || cls).join(" ");
          return `class="${unoClasses}"`;
        });
        return processed;
      }
      return null;
    },
    async generateBundle(_options, bundle) {
    },
    async transformIndexHtml(html) {
      console.log("[vite-plugin-unocss-css] transformIndexHtml called");
      const root = parseHtml(html);
      root.querySelectorAll("[class]").forEach((el) => {
        const orig = el.getAttribute("class");
        const uno2 = orig.split(/\s+/).map((cls) => {
          const mapped = classMappingCache.get(cls) || cls;
          const normalized = normalizeArbitraryClass(mapped);
          return isUnoClass(normalized) ? normalized : "";
        }).filter(Boolean).join(" ");
        el.setAttribute("class", uno2);
      });
      const unoClassSet = /* @__PURE__ */ new Set();
      root.querySelectorAll("[class]").forEach((el) => {
        el.getAttribute("class").split(/\s+/).forEach((cls) => {
          const normalized = normalizeArbitraryClass(cls);
          if (isUnoClass(normalized))
            unoClassSet.add(normalized);
        });
      });
      const assetsDir = path.resolve(__vite_injected_original_dirname, "../example/dist-example/assets");
      try {
        const files = await fs.readdir(assetsDir);
        for (const file of files) {
          if (file.endsWith(".js")) {
            const content = await fs.readFile(path.join(assetsDir, file), "utf8");
            const classRegex = /class\s*=\s*['"]([^'"]+)['"]/g;
            let match;
            while (match = classRegex.exec(content)) {
              match[1].split(/\s+/).forEach((cls) => {
                const normalized = normalizeArbitraryClass(cls);
                if (isUnoClass(normalized))
                  unoClassSet.add(normalized);
              });
            }
          }
        }
      } catch (e) {
      }
      const unoClassesArr = Array.from(unoClassSet);
      const uno = createGenerator({ presets: [presetUno, presetAttributify, presetIcons] });
      const { css } = await uno.generate(unoClassesArr.join(" "));
      const fsPath = path.resolve(__vite_injected_original_dirname, "../example/dist-example/unocss-generated.css");
      try {
        await fs.mkdir(path.dirname(fsPath), { recursive: true });
        await fs.writeFile(fsPath, css, "utf8");
        console.log("[vite-plugin-unocss-css] CSS written to", fsPath);
      } catch (e) {
        console.error("[vite-plugin-unocss-css] Failed to write CSS:", e);
      }
      let out = root.toString();
      out = out.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, "");
      out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="unocss-generated.css" /></head>');
      return out;
    }
    // Добавьте остальные хуки аналогично, если нужно
  };
}

// ../dist/index.mjs
function unocssCSSPlugin(options) {
  return UnoCSSPlugin(options);
}

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    unocssCSSPlugin()
  ],
  build: {
    outDir: "dist-example"
  },
  css: {
    modules: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiLi4vc3JjL3BsdWdpbi50cyIsICIuLi9zcmMvY3NzLXByb2Nlc3Nvci50cyIsICIuLi9zcmMvdXRpbHMudHMiLCAiLi4vc3JjL3Z1ZS1wcm9jZXNzb3IudHMiLCAiLi4vc3JjL2h0bWwtcHJvY2Vzc29yLnRzIiwgIi4uL3NyYy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9tbnQvYy9Vc2Vycy9leHVxZXIvUHJvamVjdHMvdml0ZS1wbHVnaW4tdW5vY3NzLWNzcy9leGFtcGxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L2MvVXNlcnMvZXh1cWVyL1Byb2plY3RzL3ZpdGUtcGx1Z2luLXVub2Nzcy1jc3MvZXhhbXBsZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2MvVXNlcnMvZXh1cWVyL1Byb2plY3RzL3ZpdGUtcGx1Z2luLXVub2Nzcy1jc3MvZXhhbXBsZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCB1bm9jc3NDU1NQbHVnaW4gZnJvbSAnLi4vZGlzdC9pbmRleC5tanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHVub2Nzc0NTU1BsdWdpbigpLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogJ2Rpc3QtZXhhbXBsZSdcclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgbW9kdWxlczogZmFsc2VcclxuICB9XHJcbn0pOyAiLCAiaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCB0eXBlIHsgT3V0cHV0QXNzZXQgfSBmcm9tICdyb2xsdXAnO1xuaW1wb3J0IHsgcHJvY2Vzc0FsbFNvdXJjZXMsIHByb2Nlc3NWdWVGaWxlLCBwcm9jZXNzSHRtbEFuZENzc1N0cmluZ3MgfSBmcm9tICcuL2Z1bGwtcHJvY2Vzc29yJztcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcyc7XG5pbXBvcnQgeyBzeW5jIGFzIGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICdjaGVlcmlvJztcbmltcG9ydCB7IENTU1Byb2Nlc3NvciB9IGZyb20gJy4vY3NzLXByb2Nlc3Nvcic7XG5pbXBvcnQgeyBWdWVQcm9jZXNzb3IgfSBmcm9tICcuL3Z1ZS1wcm9jZXNzb3InO1xuaW1wb3J0IHsgSFRNTFByb2Nlc3NvciB9IGZyb20gJy4vaHRtbC1wcm9jZXNzb3InO1xuaW1wb3J0IHsgY3JlYXRlR2VuZXJhdG9yIH0gZnJvbSAnQHVub2Nzcy9jb3JlJztcbmltcG9ydCBwcmVzZXRVbm8gZnJvbSAnQHVub2Nzcy9wcmVzZXQtdW5vJztcbmltcG9ydCBwcmVzZXRBdHRyaWJ1dGlmeSBmcm9tICdAdW5vY3NzL3ByZXNldC1hdHRyaWJ1dGlmeSc7XG5pbXBvcnQgcHJlc2V0SWNvbnMgZnJvbSAnQHVub2Nzcy9wcmVzZXQtaWNvbnMnO1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VIdG1sIH0gZnJvbSAnbm9kZS1odG1sLXBhcnNlcic7XG5cbmludGVyZmFjZSBQbHVnaW5PcHRpb25zIHtcbiAgcHJlc2V0cz86IGFueVtdO1xuICB0aGVtZT86IGFueTtcbiAgc2hvcnRjdXRzPzogYW55O1xuICBydWxlcz86IGFueVtdO1xuICBkZXY/OiBib29sZWFuO1xufVxuXG4vLyBcdTA0MTJcdTA0NDFcdTA0M0ZcdTA0M0VcdTA0M0NcdTA0M0VcdTA0MzNcdTA0MzBcdTA0NDJcdTA0MzVcdTA0M0JcdTA0NENcdTA0M0RcdTA0MzBcdTA0NEYgXHUwNDQ0XHUwNDQzXHUwNDNEXHUwNDNBXHUwNDQ2XHUwNDM4XHUwNDRGIFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0NDFcdTA0MzFcdTA0M0VcdTA0NDBcdTA0MzAgdW5vLVx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQzRVx1MDQzMiBcdTA0MzhcdTA0MzcgSFRNTFxuZnVuY3Rpb24gZXh0cmFjdFVub0NsYXNzZXNGcm9tSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGNsYXNzU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IGNsYXNzUmVnZXggPSAvY2xhc3NcXHMqPVxccypbXCInXShbXlwiJ10rKVtcIiddL2c7XG4gIGxldCBtYXRjaDtcbiAgd2hpbGUgKChtYXRjaCA9IGNsYXNzUmVnZXguZXhlYyhodG1sKSkpIHtcbiAgICBtYXRjaFsxXS5zcGxpdCgvXFxzKy8pLmZvckVhY2goY2xzID0+IGNsYXNzU2V0LmFkZChjbHMpKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShjbGFzc1NldCk7XG59XG5cbi8vIFx1MDQxMlx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQzQ1x1MDQzRVx1MDQzM1x1MDQzMFx1MDQ0Mlx1MDQzNVx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzMFx1MDQ0RiBcdTA0NDRcdTA0NDNcdTA0M0RcdTA0M0FcdTA0NDZcdTA0MzhcdTA0NEYgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQ0MVx1MDQzMVx1MDQzRVx1MDQ0MFx1MDQzMCB1bm8tXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDNFXHUwNDMyIFx1MDQzOFx1MDQzNyBKU1xuZnVuY3Rpb24gZXh0cmFjdFVub0NsYXNzZXNGcm9tSnMoanM6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY2xhc3NTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLy8gXHUwNDFGXHUwNDQwXHUwNDM4XHUwNDNDXHUwNDM4XHUwNDQyXHUwNDM4XHUwNDMyXHUwNDNEXHUwNDMwXHUwNDRGIFx1MDQ0MFx1MDQzNVx1MDQzM1x1MDQ0M1x1MDQzQlx1MDQ0Rlx1MDQ0MFx1MDQzQVx1MDQzMCBcdTA0MzRcdTA0M0JcdTA0NEYgdW5vLVx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQzRVx1MDQzMiAoXHUwNDNDXHUwNDNFXHUwNDM2XHUwNDNEXHUwNDNFIFx1MDQzNFx1MDQzRVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzMFx1MDQ0Mlx1MDQ0QylcbiAgY29uc3QgdW5vUmVnZXggPSAvWydcIl0oW1xcdy06XFxbXFxdI1xcLy4lXSspWydcIl0vZztcbiAgbGV0IG1hdGNoO1xuICB3aGlsZSAoKG1hdGNoID0gdW5vUmVnZXguZXhlYyhqcykpKSB7XG4gICAgaWYgKFxuICAgICAgL14oYmctfHRleHQtfG0tfHAtfHctfGgtfGNvbG9yLXxmb250LXxyb3VuZGVkLXxpdGVtcy18anVzdGlmeS18ZmxleHxib3JkZXItfHNoYWRvd3xvcGFjaXR5fHotfGdhcC18Z3JpZC18Y29sLXxyb3ctfG9yZGVyLXxzZWxmLXxjb250ZW50LXxsZWFkaW5nLXx0cmFja2luZy18YWxpZ24tfG9iamVjdC18b3ZlcmZsb3ctfGN1cnNvci18c2VsZWN0LXxwb2ludGVyLWV2ZW50cy18dHJhbnNpdGlvbnxkdXJhdGlvbnxlYXNlfGRlbGF5fGFuaW1hdGV8YXNwZWN0LXx0b3B8cmlnaHR8Ym90dG9tfGxlZnR8dmlzaWJsZXxmbG9hdHxjbGVhcnxyZXNpemV8bGlzdHxhcHBlYXJhbmNlfG91dGxpbmV8ZmlsdGVyfGJhY2tkcm9wfGJsZW5kfGJveHxjb250ZW50fHdyaXRpbmd8d2hpdGVzcGFjZXxicmVha3x1bmRlcmxpbmV8ZGVjb3JhdGlvbnxpbmRlbnR8dGFifGNhcmV0fHN0cm9rZXxmaWxsfHNjYWxlfHJvdGF0ZXx0cmFuc2xhdGV8c2tldykvLnRlc3QoXG4gICAgICAgIG1hdGNoWzFdXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjbGFzc1NldC5hZGQobWF0Y2hbMV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShjbGFzc1NldCk7XG59XG5cbmZ1bmN0aW9uIGlzQXNzZXQoZmlsZTogdW5rbm93bik6IGZpbGUgaXMgT3V0cHV0QXNzZXQge1xuICByZXR1cm4gISFmaWxlICYmIHR5cGVvZiBmaWxlID09PSAnb2JqZWN0JyAmJiAoZmlsZSBhcyBhbnkpLnR5cGUgPT09ICdhc3NldCc7XG59XG5cbi8vIFx1MDQxMlx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQzQ1x1MDQzRVx1MDQzM1x1MDQzMFx1MDQ0Mlx1MDQzNVx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzMFx1MDQ0RiBcdTA0NDRcdTA0NDNcdTA0M0RcdTA0M0FcdTA0NDZcdTA0MzhcdTA0NEYgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQzRlx1MDQ0MFx1MDQzNVx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQzRVx1MDQzMlx1MDQzMFx1MDQzRFx1MDQzOFx1MDQ0RiBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0M0VcdTA0MzIgXHUwNDQxIFx1MDQ0N1x1MDQzOFx1MDQ0MVx1MDQzQlx1MDQzRVx1MDQzMlx1MDQ0Qlx1MDQzQ1x1MDQzOCBcdTA0NDFcdTA0NDNcdTA0NDRcdTA0NDRcdTA0MzhcdTA0M0FcdTA0NDFcdTA0MzBcdTA0M0NcdTA0MzggXHUwNDMyIGFyYml0cmFyeSB2YWx1ZXMgVW5vQ1NTXG5mdW5jdGlvbiBub3JtYWxpemVBcmJpdHJhcnlDbGFzcyhjbHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFx1MDQxRlx1MDQ0MFx1MDQzNVx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQ0M1x1MDQzNVx1MDQzQyB3LTE1MHB4IC0+IHctWzE1MHB4XSwgcm91bmRlZC04cHggLT4gcm91bmRlZC1bOHB4XSwgXHUwNDM4IFx1MDQ0Mi5cdTA0M0YuXG4gIC8vIFx1MDQxRlx1MDQzRVx1MDQzNFx1MDQzNFx1MDQzNVx1MDQ0MFx1MDQzNlx1MDQzQVx1MDQzMCBweCwgcmVtLCBlbSwgJSwgXHUwNDM4IFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzRSBcdTA0NDdcdTA0MzhcdTA0NDFcdTA0M0JcdTA0MzBcbiAgcmV0dXJuIGNscy5yZXBsYWNlKFxuICAgIC9eKHd8aHxtfHB8cm91bmRlZHx0ZXh0fGdhcHx0b3B8bGVmdHxyaWdodHxib3R0b218enxib3JkZXJ8aW5zZXR8bWluLXd8bWluLWh8bWF4LXd8bWF4LWgpLShcXC0/XFxkKyg/OnB4fHJlbXxlbXwlKT8pLyxcbiAgICAoXywgcHJlZml4LCB2YWx1ZSkgPT4gYCR7cHJlZml4fS1bJHt2YWx1ZX1dYFxuICApO1xufVxuXG5mdW5jdGlvbiBpc1Vub0NsYXNzKGNsczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1MDQxRlx1MDQ0MFx1MDQzOFx1MDQzQ1x1MDQzOFx1MDQ0Mlx1MDQzOFx1MDQzMlx1MDQzRFx1MDQzMFx1MDQ0RiBcdTA0M0ZcdTA0NDBcdTA0M0VcdTA0MzJcdTA0MzVcdTA0NDBcdTA0M0FcdTA0MzA6IHVuby1cdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDEgXHUwNDQxXHUwNDNFXHUwNDM0XHUwNDM1XHUwNDQwXHUwNDM2XHUwNDM4XHUwNDQyIFx1MDQzNFx1MDQzNVx1MDQ0NFx1MDQzOFx1MDQ0MSBcdTA0MzggXHUwNDNEXHUwNDM1IFx1MDQ0Rlx1MDQzMlx1MDQzQlx1MDQ0Rlx1MDQzNVx1MDQ0Mlx1MDQ0MVx1MDQ0RiBCRU0vXHUwNDNBXHUwNDMwXHUwNDQxXHUwNDQyXHUwNDNFXHUwNDNDXHUwNDNEXHUwNDRCXHUwNDNDXG4gIC8vIFx1MDQxQ1x1MDQzRVx1MDQzNlx1MDQzRFx1MDQzRSBcdTA0MzRcdTA0M0VcdTA0NDBcdTA0MzBcdTA0MzFcdTA0M0VcdTA0NDJcdTA0MzBcdTA0NDJcdTA0NEMgXHUwNDNGXHUwNDNFXHUwNDM0IFx1MDQzMlx1MDQzMFx1MDQ0OFx1MDQzOCBcdTA0M0ZcdTA0NDBcdTA0MzBcdTA0MzJcdTA0MzhcdTA0M0JcdTA0MzBcbiAgcmV0dXJuIC8tfFxcWy4qXFxdLy50ZXN0KGNscykgJiYgIS9eW19hLXpBLVowLTldKyhfX3wtLSkvLnRlc3QoY2xzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFVub0NTU1BsdWdpbihvcHRpb25zOiBQbHVnaW5PcHRpb25zID0ge30pOiBQbHVnaW4ge1xuICAvLyBcdTA0MUZcdTA0M0JcdTA0MzBcdTA0MzNcdTA0MzhcdTA0M0QgXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQ0Mlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzQVx1MDQzRSBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDMxXHUwNDNFXHUwNDQwXHUwNDNBXHUwNDM4ICh2aXRlIGJ1aWxkKVxuICBjb25zdCBiYXNlOiBQbHVnaW4gPSB7XG4gICAgbmFtZTogJ3ZpdGUtcGx1Z2luLXVub2Nzcy1jc3MnLFxuICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgIGFwcGx5OiAnYnVpbGQnLFxuICB9O1xuXG4gIGNvbnN0IGNsYXNzTWFwcGluZ0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgY3NzUHJvY2Vzc29yID0gbmV3IENTU1Byb2Nlc3NvcihudWxsIGFzIGFueSk7IC8vIFVub0dlbmVyYXRvciBcdTA0MzFcdTA0NDNcdTA0MzRcdTA0MzVcdTA0NDIgXHUwNDNGXHUwNDNFXHUwNDM3XHUwNDM2XHUwNDM1XG4gIGNvbnN0IHZ1ZVByb2Nlc3NvciA9IG5ldyBWdWVQcm9jZXNzb3IoKTtcbiAgY29uc3QgaHRtbFByb2Nlc3NvciA9IG5ldyBIVE1MUHJvY2Vzc29yKCk7XG5cbiAgbGV0IHVub0Nzc0h0bWwgPSAnJztcbiAgbGV0IHVub0Nzc1JhdyA9ICcnO1xuXG4gIHJldHVybiB7XG4gICAgLi4uYmFzZSxcbiAgICBhc3luYyB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgIC8vIFx1MDQxRFx1MDQzNSBcdTA0NDJcdTA0NDBcdTA0M0VcdTA0MzNcdTA0MzBcdTA0NDJcdTA0NEMgbm9kZV9tb2R1bGVzIFx1MDQzOCBcdTA0MzJcdTA0MzhcdTA0NDBcdTA0NDJcdTA0NDNcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0NEJcdTA0MzUgXHUwNDQ0XHUwNDMwXHUwNDM5XHUwNDNCXHUwNDRCXG4gICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpIHx8IGlkLnN0YXJ0c1dpdGgoJ1xcMCcpKSByZXR1cm4gbnVsbDtcblxuICAgICAgaWYgKGlkLmVuZHNXaXRoKCcuY3NzJykpIHtcbiAgICAgICAgYXdhaXQgY3NzUHJvY2Vzc29yLnByb2Nlc3MoY29kZSwgaWQsIGNsYXNzTWFwcGluZ0NhY2hlKTtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgLy8gXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQ0Mlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzQVx1MDQzRSBcdTA0MzhcdTA0NDFcdTA0NDVcdTA0M0VcdTA0MzRcdTA0M0RcdTA0NEJcdTA0MzUgLnZ1ZS1cdTA0NDRcdTA0MzBcdTA0MzlcdTA0M0JcdTA0NEIgXHUwNDQxIDx0ZW1wbGF0ZT5cbiAgICAgIGlmIChpZC5lbmRzV2l0aCgnLnZ1ZScpICYmIGNvZGUuaW5jbHVkZXMoJzx0ZW1wbGF0ZScpKSB7XG4gICAgICAgIGxldCBwcm9jZXNzZWQgPSBhd2FpdCB2dWVQcm9jZXNzb3IucHJvY2Vzcyhjb2RlLCBpZCwgY2xhc3NNYXBwaW5nQ2FjaGUpO1xuICAgICAgICAvLyBcdTA0MTdcdTA0MzBcdTA0M0NcdTA0MzVcdTA0M0RcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDNBXHUwNDMwXHUwNDQxXHUwNDQyXHUwNDNFXHUwNDNDXHUwNDNEXHUwNDRCXHUwNDM1IFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QiBcdTA0M0RcdTA0MzAgdW5vLVx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QiBcdTA0NDJcdTA0M0VcdTA0M0JcdTA0NENcdTA0M0FcdTA0M0UgXHUwNDMyXHUwNDNEXHUwNDQzXHUwNDQyXHUwNDQwXHUwNDM4IDx0ZW1wbGF0ZT4uLi48L3RlbXBsYXRlPiBcdTA0NDdcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzcgXHUwNDNGXHUwNDMwXHUwNDQwXHUwNDQxXHUwNDM1XHUwNDQwXG4gICAgICAgIHByb2Nlc3NlZCA9IHByb2Nlc3NlZC5yZXBsYWNlKC8oPHRlbXBsYXRlW14+XSo+KShbXFxzXFxTXSo/KSg8XFwvdGVtcGxhdGU+KS8sIChmdWxsOiBzdHJpbmcsIG9wZW46IHN0cmluZywgdGVtcGxhdGVDb250ZW50OiBzdHJpbmcsIGNsb3NlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAvLyBcdTA0MUZcdTA0MzBcdTA0NDBcdTA0NDFcdTA0MzhcdTA0M0MgXHUwNDQyXHUwNDNFXHUwNDNCXHUwNDRDXHUwNDNBXHUwNDNFIFx1MDQ0MVx1MDQzRVx1MDQzNFx1MDQzNVx1MDQ0MFx1MDQzNlx1MDQzOFx1MDQzQ1x1MDQzRVx1MDQzNSBcdTA0NDhcdTA0MzBcdTA0MzFcdTA0M0JcdTA0M0VcdTA0M0RcdTA0MzAsIFx1MDQzMVx1MDQzNVx1MDQzNyA8aHRtbD48aGVhZD48Ym9keT5cbiAgICAgICAgICBjb25zdCByb290ID0gcGFyc2VIdG1sKGA8cm9vdD4ke3RlbXBsYXRlQ29udGVudH08L3Jvb3Q+YCk7XG4gICAgICAgICAgcm9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3NdJykuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnID0gZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpITtcbiAgICAgICAgICAgIGNvbnN0IHVubyA9IG9yaWcuc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgICAubWFwKChjbHM6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHBlZCA9IGNsYXNzTWFwcGluZ0NhY2hlLmdldChjbHMpIHx8IGNscztcbiAgICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplQXJiaXRyYXJ5Q2xhc3MobWFwcGVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNVbm9DbGFzcyhub3JtYWxpemVkKSA/IG5vcm1hbGl6ZWQgOiAnJztcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgICAuam9pbignICcpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIHVubyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gXHUwNDEyXHUwNDNFXHUwNDM3XHUwNDMyXHUwNDQwXHUwNDMwXHUwNDQ5XHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQ0Mlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzQVx1MDQzRSBcdTA0MzJcdTA0M0RcdTA0NDNcdTA0NDJcdTA0NDBcdTA0MzVcdTA0M0RcdTA0M0RcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzggPHJvb3Q+Li4uPC9yb290PlxuICAgICAgICAgIGNvbnN0IGZpcnN0ID0gcm9vdC5maXJzdENoaWxkO1xuICAgICAgICAgIGlmIChmaXJzdCAmJiAnaW5uZXJIVE1MJyBpbiBmaXJzdCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW4gKyAoZmlyc3QgYXMgYW55KS5pbm5lckhUTUwgKyBjbG9zZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9wZW4gKyB0ZW1wbGF0ZUNvbnRlbnQgKyBjbG9zZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvY2Vzc2VkO1xuICAgICAgfVxuICAgICAgaWYgKGlkLmVuZHNXaXRoKCcuaHRtbCcpKSB7XG4gICAgICAgIGNvbnN0IHJvb3QgPSBwYXJzZUh0bWwoY29kZSk7XG4gICAgICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzXScpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGNvbnN0IG9yaWcgPSBlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykhO1xuICAgICAgICAgIGNvbnN0IHVubyA9IG9yaWcuc3BsaXQoL1xccysvKS5tYXAoKGNsczogc3RyaW5nKSA9PiBjbGFzc01hcHBpbmdDYWNoZS5nZXQoY2xzKSB8fCBjbHMpLmpvaW4oJyAnKTtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdW5vKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByb290LnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICAvLyBcdTA0MjJcdTA0M0VcdTA0M0JcdTA0NENcdTA0M0FcdTA0M0UganMvdHMgXHUwNDM4XHUwNDQxXHUwNDQ1XHUwNDNFXHUwNDM0XHUwNDNEXHUwNDM4XHUwNDNBXHUwNDM4IFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQzNVx1MDQzQVx1MDQ0Mlx1MDQzMFxuICAgICAgaWYgKChpZC5lbmRzV2l0aCgnLmpzJykgfHwgaWQuZW5kc1dpdGgoJy50cycpKSAmJiAoaWQuaW5jbHVkZXMoJy9zcmMvJykgfHwgaWQuaW5jbHVkZXMoJy9leGFtcGxlLycpKSkge1xuICAgICAgICBsZXQgcHJvY2Vzc2VkID0gYXdhaXQgaHRtbFByb2Nlc3Nvci5wcm9jZXNzKGNvZGUsIGlkLCBjbGFzc01hcHBpbmdDYWNoZSk7XG4gICAgICAgIHByb2Nlc3NlZCA9IHByb2Nlc3NlZC5yZXBsYWNlKC9jbGFzc1xccyo9XFxzKltcIiddKFteXCInXSspW1wiJ10vZywgKGZ1bGwsIGNsYXNzU3RyKSA9PiB7XG4gICAgICAgICAgY29uc3QgdW5vQ2xhc3NlcyA9IGNsYXNzU3RyLnNwbGl0KC9cXHMrLykubWFwKChjbHM6IHN0cmluZykgPT4gY2xhc3NNYXBwaW5nQ2FjaGUuZ2V0KGNscykgfHwgY2xzKS5qb2luKCcgJyk7XG4gICAgICAgICAgcmV0dXJuIGBjbGFzcz1cXFwiJHt1bm9DbGFzc2VzfVxcXCJgO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3NlZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgYXN5bmMgZ2VuZXJhdGVCdW5kbGUoX29wdGlvbnM6IGFueSwgYnVuZGxlOiBhbnkpIHtcbiAgICAgIC8vIFVub0NTUyBDU1MgZ2VuZXJhdGlvbiBpcyBub3cgaGFuZGxlZCBpbiB0cmFuc2Zvcm1JbmRleEh0bWxcbiAgICB9LFxuICAgIGFzeW5jIHRyYW5zZm9ybUluZGV4SHRtbChodG1sOiBzdHJpbmcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbdml0ZS1wbHVnaW4tdW5vY3NzLWNzc10gdHJhbnNmb3JtSW5kZXhIdG1sIGNhbGxlZCcpO1xuICAgICAgLy8gXHUwNDE3XHUwNDMwXHUwNDNDXHUwNDM1XHUwNDNEXHUwNDRGXHUwNDM1XHUwNDNDIFx1MDQzQVx1MDQzMFx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzQ1x1MDQzRFx1MDQ0Qlx1MDQzNSBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0NEIgXHUwNDNEXHUwNDMwIHVuby1cdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0NEJcbiAgICAgIGNvbnN0IHJvb3QgPSBwYXJzZUh0bWwoaHRtbCk7XG4gICAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tjbGFzc10nKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3Qgb3JpZyA9IGVsLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSE7XG4gICAgICAgIGNvbnN0IHVubyA9IG9yaWcuc3BsaXQoL1xccysvKVxuICAgICAgICAgIC5tYXAoKGNsczogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXBwZWQgPSBjbGFzc01hcHBpbmdDYWNoZS5nZXQoY2xzKSB8fCBjbHM7XG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplQXJiaXRyYXJ5Q2xhc3MobWFwcGVkKTtcbiAgICAgICAgICAgIHJldHVybiBpc1Vub0NsYXNzKG5vcm1hbGl6ZWQpID8gbm9ybWFsaXplZCA6ICcnO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgIC5qb2luKCcgJyk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB1bm8pO1xuICAgICAgfSk7XG4gICAgICAvLyBcdTA0MjFcdTA0M0VcdTA0MzFcdTA0MzhcdTA0NDBcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDMyXHUwNDQxXHUwNDM1IFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QiBcdTA0MzhcdTA0MzcgSFRNTFxuICAgICAgY29uc3QgdW5vQ2xhc3NTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzXScpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykhLnNwbGl0KC9cXHMrLykuZm9yRWFjaChjbHMgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBcmJpdHJhcnlDbGFzcyhjbHMpO1xuICAgICAgICAgIGlmIChpc1Vub0NsYXNzKG5vcm1hbGl6ZWQpKSB1bm9DbGFzc1NldC5hZGQobm9ybWFsaXplZCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICAvLyBcdTA0MTRcdTA0M0VcdTA0M0ZcdTA0M0VcdTA0M0JcdTA0M0RcdTA0MzhcdTA0NDJcdTA0MzVcdTA0M0JcdTA0NENcdTA0M0RcdTA0M0UgXHUwNDQxXHUwNDNFXHUwNDMxXHUwNDM4XHUwNDQwXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QiBcdTA0MzhcdTA0MzcgXHUwNDMyXHUwNDQxXHUwNDM1XHUwNDQ1IEpTLVx1MDQ0NFx1MDQzMFx1MDQzOVx1MDQzQlx1MDQzRVx1MDQzMiBcdTA0MzIgYXNzZXRzXG4gICAgICBjb25zdCBhc3NldHNEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vZXhhbXBsZS9kaXN0LWV4YW1wbGUvYXNzZXRzJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGZzLnJlYWRkaXIoYXNzZXRzRGlyKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgaWYgKGZpbGUuZW5kc1dpdGgoJy5qcycpKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgZnMucmVhZEZpbGUocGF0aC5qb2luKGFzc2V0c0RpciwgZmlsZSksICd1dGY4Jyk7XG4gICAgICAgICAgICBjb25zdCBjbGFzc1JlZ2V4ID0gL2NsYXNzXFxzKj1cXHMqWydcIl0oW14nXCJdKylbJ1wiXS9nO1xuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgd2hpbGUgKChtYXRjaCA9IGNsYXNzUmVnZXguZXhlYyhjb250ZW50KSkpIHtcbiAgICAgICAgICAgICAgbWF0Y2hbMV0uc3BsaXQoL1xccysvKS5mb3JFYWNoKGNscyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFyYml0cmFyeUNsYXNzKGNscyk7XG4gICAgICAgICAgICAgICAgaWYgKGlzVW5vQ2xhc3Mobm9ybWFsaXplZCkpIHVub0NsYXNzU2V0LmFkZChub3JtYWxpemVkKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlnbm9yZSBpZiBhc3NldHMgZGlyIGRvZXMgbm90IGV4aXN0IHlldFxuICAgICAgfVxuICAgICAgY29uc3QgdW5vQ2xhc3Nlc0FyciA9IEFycmF5LmZyb20odW5vQ2xhc3NTZXQpO1xuICAgICAgY29uc3QgdW5vID0gY3JlYXRlR2VuZXJhdG9yKHsgcHJlc2V0czogW3ByZXNldFVubywgcHJlc2V0QXR0cmlidXRpZnksIHByZXNldEljb25zXSB9KTtcbiAgICAgIGNvbnN0IHsgY3NzIH0gPSBhd2FpdCB1bm8uZ2VuZXJhdGUodW5vQ2xhc3Nlc0Fyci5qb2luKCcgJykpO1xuICAgICAgLy8gXHUwNDIxXHUwNDNFXHUwNDQ1XHUwNDQwXHUwNDMwXHUwNDNEXHUwNDRGXHUwNDM1XHUwNDNDIENTUyBcdTA0MzIgZXhhbXBsZS9kaXN0LWV4YW1wbGUvdW5vY3NzLWdlbmVyYXRlZC5jc3NcbiAgICAgIGNvbnN0IGZzUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9leGFtcGxlL2Rpc3QtZXhhbXBsZS91bm9jc3MtZ2VuZXJhdGVkLmNzcycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZnMubWtkaXIocGF0aC5kaXJuYW1lKGZzUGF0aCksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICBhd2FpdCBmcy53cml0ZUZpbGUoZnNQYXRoLCBjc3MsICd1dGY4Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbdml0ZS1wbHVnaW4tdW5vY3NzLWNzc10gQ1NTIHdyaXR0ZW4gdG8nLCBmc1BhdGgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdbdml0ZS1wbHVnaW4tdW5vY3NzLWNzc10gRmFpbGVkIHRvIHdyaXRlIENTUzonLCBlKTtcbiAgICAgIH1cbiAgICAgIC8vIFx1MDQxMlx1MDQzRVx1MDQzN1x1MDQzMlx1MDQ0MFx1MDQzMFx1MDQ0OVx1MDQzMFx1MDQzNVx1MDQzQyBIVE1MIFx1MDQ0MSBcdTA0M0ZcdTA0NDBcdTA0MzBcdTA0MzJcdTA0MzhcdTA0M0JcdTA0NENcdTA0M0RcdTA0M0VcdTA0MzkgXHUwNDQxXHUwNDQxXHUwNDRCXHUwNDNCXHUwNDNBXHUwNDNFXHUwNDM5XG4gICAgICBsZXQgb3V0ID0gcm9vdC50b1N0cmluZygpO1xuICAgICAgb3V0ID0gb3V0LnJlcGxhY2UoLzxsaW5rW14+XSpyZWw9W1wiJ11zdHlsZXNoZWV0W1wiJ11bXj5dKj4vZ2ksICcnKTtcbiAgICAgIG91dCA9IG91dC5yZXBsYWNlKC88XFwvaGVhZD4vaSwgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwidW5vY3NzLWdlbmVyYXRlZC5jc3NcIiAvPjwvaGVhZD4nKTtcbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcbiAgICAvLyBcdTA0MTRcdTA0M0VcdTA0MzFcdTA0MzBcdTA0MzJcdTA0NENcdTA0NDJcdTA0MzUgXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDRCXHUwNDM1IFx1MDQ0NVx1MDQ0M1x1MDQzQVx1MDQzOCBcdTA0MzBcdTA0M0RcdTA0MzBcdTA0M0JcdTA0M0VcdTA0MzNcdTA0MzhcdTA0NDdcdTA0M0RcdTA0M0UsIFx1MDQzNVx1MDQ0MVx1MDQzQlx1MDQzOCBcdTA0M0RcdTA0NDNcdTA0MzZcdTA0M0RcdTA0M0VcbiAgfTtcbn0gIiwgImltcG9ydCB7IHBhcnNlLCB3YWxrIH0gZnJvbSAnY3NzLXRyZWUnO1xyXG5pbXBvcnQgdHlwZSB7IFVub0dlbmVyYXRvciB9IGZyb20gJ0B1bm9jc3MvY29yZSc7XHJcbmltcG9ydCB7IENTU1V0aWxzIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ1NTUHJvY2Vzc29yIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVubzogVW5vR2VuZXJhdG9yKSB7fVxyXG5cclxuICBhc3luYyBwcm9jZXNzKGNvZGU6IHN0cmluZywgaWQ6IHN0cmluZywgY2xhc3NNYXBwaW5nQ2FjaGU6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc29sZS5sb2coYFtjc3MtcHJvY2Vzc29yXSBQcm9jZXNzaW5nIENTUyBmaWxlOiAke2lkfWApO1xyXG4gICAgICBcclxuICAgICAgLy8gXHUwNDEyXHUwNDQxXHUwNDM1XHUwNDMzXHUwNDM0XHUwNDMwIFx1MDQzOFx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzN1x1MDQ0M1x1MDQzNVx1MDQzQyBmYWxsYmFjayBcdTA0M0ZcdTA0MzBcdTA0NDBcdTA0NDFcdTA0MzhcdTA0M0RcdTA0MzMsIFx1MDQ0Mlx1MDQzMFx1MDQzQSBcdTA0M0FcdTA0MzBcdTA0M0EgXHUwNDNFXHUwNDNEIFx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzMFx1MDQzNVx1MDQ0MiBcdTA0M0JcdTA0NDNcdTA0NDdcdTA0NDhcdTA0MzVcclxuICAgICAgYXdhaXQgdGhpcy5mYWxsYmFja0V4dHJhY3RDbGFzc2VzKGNvZGUsIGNsYXNzTWFwcGluZ0NhY2hlKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUubG9nKGBbY3NzLXByb2Nlc3Nvcl0gRm91bmQgJHtjbGFzc01hcHBpbmdDYWNoZS5zaXplfSBjbGFzc2VzIGluICR7aWR9YCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTA0MTIgZGV2IFx1MDQ0MFx1MDQzNVx1MDQzNlx1MDQzOFx1MDQzQ1x1MDQzNSBcdTA0MzJcdTA0M0VcdTA0MzdcdTA0MzJcdTA0NDBcdTA0MzBcdTA0NDlcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDNGXHUwNDQzXHUwNDQxXHUwNDQyXHUwNDNFXHUwNDM5IENTUywgXHUwNDQyXHUwNDMwXHUwNDNBIFx1MDQzQVx1MDQzMFx1MDQzQSBcdTA0MzJcdTA0NDFcdTA0MzUgXHUwNDQxXHUwNDQyXHUwNDM4XHUwNDNCXHUwNDM4IFx1MDQzMVx1MDQ0M1x1MDQzNFx1MDQ0M1x1MDQ0MiBcdTA0NDFcdTA0MzNcdTA0MzVcdTA0M0RcdTA0MzVcdTA0NDBcdTA0MzhcdTA0NDBcdTA0M0VcdTA0MzJcdTA0MzBcdTA0M0RcdTA0NEIgVW5vQ1NTXHJcbiAgICAgIC8vIFx1MDQxMiBcdTA0M0VcdTA0MzFcdTA0NEJcdTA0NDdcdTA0M0RcdTA0M0VcdTA0M0MgXHUwNDQwXHUwNDM1XHUwNDM2XHUwNDM4XHUwNDNDXHUwNDM1IFx1MDQzMlx1MDQzRVx1MDQzN1x1MDQzMlx1MDQ0MFx1MDQzMFx1MDQ0OVx1MDQzMFx1MDQzNVx1MDQzQyBcdTA0MzhcdTA0NDFcdTA0NDVcdTA0M0VcdTA0MzRcdTA0M0RcdTA0NEJcdTA0MzkgQ1NTXHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgQ1NTOicsIGVycm9yKTtcclxuICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGV4dHJhY3RDbGFzc2VzRnJvbUNTUyhhc3Q6IGFueSwgY2xhc3NNYXBwaW5nQ2FjaGU6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnNvbGUubG9nKGBbY3NzLXByb2Nlc3Nvcl0gU3RhcnRpbmcgdG8gZXh0cmFjdCBjbGFzc2VzIGZyb20gQ1NTIEFTVGApO1xyXG4gICAgXHJcbiAgICB3YWxrKGFzdCwge1xyXG4gICAgICB2aXNpdDogJ1J1bGUnLFxyXG4gICAgICBlbnRlcjogYXN5bmMgKG5vZGU6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdSdWxlJykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coYFtjc3MtcHJvY2Vzc29yXSBQcm9jZXNzaW5nIHJ1bGU6YCwgbm9kZSk7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnByb2Nlc3NSdWxlKG5vZGUsIGNsYXNzTWFwcGluZ0NhY2hlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzUnVsZShydWxlOiBhbnksIGNsYXNzTWFwcGluZ0NhY2hlOiBNYXA8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBDU1NVdGlscy5leHRyYWN0U2VsZWN0b3JzKHJ1bGUucHJlbHVkZSk7XHJcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gQ1NTVXRpbHMuZXh0cmFjdFByb3BlcnRpZXMocnVsZS5ibG9jayk7XHJcblxyXG4gICAgY29uc29sZS5sb2coYFtjc3MtcHJvY2Vzc29yXSBGb3VuZCBzZWxlY3RvcnM6YCwgc2VsZWN0b3JzKTtcclxuICAgIGNvbnNvbGUubG9nKGBbY3NzLXByb2Nlc3Nvcl0gRm91bmQgcHJvcGVydGllczpgLCBwcm9wZXJ0aWVzLmxlbmd0aCk7XHJcblxyXG4gICAgaWYgKCFzZWxlY3RvcnMubGVuZ3RoIHx8ICFwcm9wZXJ0aWVzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcclxuICAgICAgY29uc3QgY2xhc3NOYW1lID0gQ1NTVXRpbHMuZXh0cmFjdENsYXNzTmFtZShzZWxlY3Rvcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBbY3NzLXByb2Nlc3Nvcl0gRXh0cmFjdGVkIGNsYXNzTmFtZTpgLCBjbGFzc05hbWUpO1xyXG4gICAgICBcclxuICAgICAgaWYgKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIGNvbnN0IHVub0NsYXNzZXMgPSBhd2FpdCB0aGlzLmNvbnZlcnRQcm9wZXJ0aWVzVG9Vbm9DbGFzc2VzKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbY3NzLXByb2Nlc3Nvcl0gQ29udmVydGVkIHRvIHVubyBjbGFzc2VzOmAsIHVub0NsYXNzZXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh1bm9DbGFzc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGNsYXNzTWFwcGluZ0NhY2hlLnNldChjbGFzc05hbWUsIHVub0NsYXNzZXMuam9pbignICcpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBbY3NzLXByb2Nlc3Nvcl0gTWFwcGVkICR7Y2xhc3NOYW1lfSAtPiAke3Vub0NsYXNzZXMuam9pbignICcpfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBjb252ZXJ0UHJvcGVydGllc1RvVW5vQ2xhc3Nlcyhwcm9wZXJ0aWVzOiBhbnlbXSk6IFByb21pc2U8c3RyaW5nW10+IHtcclxuICAgIGNvbnN0IHVub0NsYXNzZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcHJvcGVydGllcykge1xyXG4gICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5wcm9wZXJ0eTtcclxuICAgICAgY29uc3QgcHJvcGVydHlWYWx1ZSA9IENTU1V0aWxzLnByb3BlcnR5VmFsdWVUb1N0cmluZyhwcm9wZXJ0eS52YWx1ZSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCB1bm9DbGFzc0FyciA9IENTU1V0aWxzLmNvbnZlcnRQcm9wZXJ0eVRvVW5vQ2xhc3MocHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgaWYgKHVub0NsYXNzQXJyICYmIHVub0NsYXNzQXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB1bm9DbGFzc2VzLnB1c2goLi4udW5vQ2xhc3NBcnIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB1bm9DbGFzc2VzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBmYWxsYmFja0V4dHJhY3RDbGFzc2VzKGNzczogc3RyaW5nLCBjbGFzc01hcHBpbmdDYWNoZTogTWFwPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gXHUwNDEyXHUwNDQxXHUwNDM1XHUwNDMzXHUwNDM0XHUwNDMwIFx1MDQzOFx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzN1x1MDQ0M1x1MDQzNVx1MDQzQyBSZWdFeHAgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQzOFx1MDQzN1x1MDQzMlx1MDQzQlx1MDQzNVx1MDQ0N1x1MDQzNVx1MDQzRFx1MDQzOFx1MDQ0RiBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0M0VcdTA0MzJcclxuICAgIGF3YWl0IHRoaXMucmVnZXhFeHRyYWN0Q2xhc3Nlcyhjc3MsIGNsYXNzTWFwcGluZ0NhY2hlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgcmVnZXhFeHRyYWN0Q2xhc3Nlcyhjc3M6IHN0cmluZywgY2xhc3NNYXBwaW5nQ2FjaGU6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vIFx1MDQxRlx1MDQ0MFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzOSBcdTA0M0ZcdTA0MzBcdTA0NDBcdTA0NDFcdTA0MzhcdTA0M0RcdTA0MzMgQ1NTIFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0MzhcdTA0MzdcdTA0MzJcdTA0M0JcdTA0MzVcdTA0NDdcdTA0MzVcdTA0M0RcdTA0MzhcdTA0NEYgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDNFXHUwNDMyXHJcbiAgICBjb25zdCBjbGFzc1JlZ2V4ID0gL1xcLihbYS16QS1aMC05Xy1dKylcXHMqXFx7KFtefV0rKVxcfS9nO1xyXG4gICAgbGV0IG1hdGNoO1xyXG4gICAgXHJcbiAgICB3aGlsZSAoKG1hdGNoID0gY2xhc3NSZWdleC5leGVjKGNzcykpICE9PSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IG1hdGNoWzFdO1xyXG4gICAgICBjb25zdCBwcm9wZXJ0aWVzID0gbWF0Y2hbMl07XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTA0MUZcdTA0NDBcdTA0M0VcdTA0M0ZcdTA0NDNcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzVcdTA0M0Mgc2NvcGVkIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QlxyXG4gICAgICBpZiAoY2xhc3NOYW1lLmluY2x1ZGVzKCdkYXRhLXYtJykpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHUwNDFBXHUwNDNFXHUwNDNEXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDQyXHUwNDM4XHUwNDQwXHUwNDQzXHUwNDM1XHUwNDNDIFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzOVx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzMCBcdTA0MzIgVW5vQ1NTIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QlxyXG4gICAgICBjb25zdCB1bm9DbGFzc2VzID0gYXdhaXQgdGhpcy5jb252ZXJ0UHJvcGVydGllc1N0cmluZ1RvVW5vQ2xhc3Nlcyhwcm9wZXJ0aWVzKTtcclxuICAgICAgaWYgKHVub0NsYXNzZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNsYXNzTWFwcGluZ0NhY2hlLnNldChjbGFzc05hbWUsIHVub0NsYXNzZXMuam9pbignICcpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW2Nzcy1wcm9jZXNzb3JdIE1hcHBlZCAke2NsYXNzTmFtZX0gLT4gJHt1bm9DbGFzc2VzLmpvaW4oJyAnKX1gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBjb252ZXJ0UHJvcGVydGllc1N0cmluZ1RvVW5vQ2xhc3Nlcyhwcm9wZXJ0aWVzOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XHJcbiAgICBjb25zdCB1bm9DbGFzc2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICAvLyBcdTA0MUZcdTA0MzBcdTA0NDBcdTA0NDFcdTA0MzhcdTA0M0MgQ1NTIFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzOVx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzMFxyXG4gICAgY29uc3QgcHJvcGVydHlSZWdleCA9IC8oW146XSspOlxccyooW147XSspOy9nO1xyXG4gICAgbGV0IG1hdGNoO1xyXG4gICAgXHJcbiAgICB3aGlsZSAoKG1hdGNoID0gcHJvcGVydHlSZWdleC5leGVjKHByb3BlcnRpZXMpKSAhPT0gbnVsbCkge1xyXG4gICAgICBjb25zdCBwcm9wZXJ0eSA9IG1hdGNoWzFdLnRyaW0oKTtcclxuICAgICAgY29uc3QgdmFsdWUgPSBtYXRjaFsyXS50cmltKCk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCB1bm9DbGFzc0FyciA9IENTU1V0aWxzLmNvbnZlcnRQcm9wZXJ0eVRvVW5vQ2xhc3MocHJvcGVydHksIHZhbHVlKTtcclxuICAgICAgaWYgKHVub0NsYXNzQXJyICYmIHVub0NsYXNzQXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB1bm9DbGFzc2VzLnB1c2goLi4udW5vQ2xhc3NBcnIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB1bm9DbGFzc2VzO1xyXG4gIH1cclxufSAiLCAiLy8gXHUwNDFFXHUwNDMxXHUwNDQ5XHUwNDM4XHUwNDM1IFx1MDQ0M1x1MDQ0Mlx1MDQzOFx1MDQzQlx1MDQzOFx1MDQ0Mlx1MDQ0QiBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDNBXHUwNDM4IENTUyBcdTA0MzggVW5vQ1NTXG5cbmV4cG9ydCBpbnRlcmZhY2UgVW5vQ1NTTWFwcGluZyB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cblxuLy8gXHUwNDE1XHUwNDM0XHUwNDM4XHUwNDNEXHUwNDRCXHUwNDM5IFx1MDQzQ1x1MDQzMFx1MDQzRlx1MDQzRlx1MDQzOFx1MDQzRFx1MDQzMyBVbm9DU1MgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDM5XHUwNDQxXHUwNDQyXHUwNDMyXG5leHBvcnQgY29uc3QgVU5PX1BST1BFUlRZX01BUDogVW5vQ1NTTWFwcGluZyA9IHtcbiAgLy8gXHUwNDI2XHUwNDMyXHUwNDM1XHUwNDQyXHUwNDNFXHUwNDMyXHUwNDRCXHUwNDM1XG4gICdiYWNrZ3JvdW5kLWNvbG9yJzogJ2JnLWNvbG9yJyxcbiAgJ2NvbG9yJzogJ2NvbG9yJyxcbiAgJ2JvcmRlci1jb2xvcic6ICdib3JkZXInLFxuICAnb3V0bGluZS1jb2xvcic6ICdvdXRsaW5lJyxcbiAgJ3RleHQtZGVjb3JhdGlvbi1jb2xvcic6ICdkZWNvcmF0aW9uJyxcbiAgJ2NvbHVtbi1ydWxlLWNvbG9yJzogJ2NvbHVtbi1ydWxlJyxcbiAgJ2NhcmV0LWNvbG9yJzogJ2NhcmV0JyxcbiAgJ2ZpbGwnOiAnZmlsbCcsXG4gICdzdHJva2UnOiAnc3Ryb2tlJyxcbiAgJ2FjY2VudC1jb2xvcic6ICdhY2NlbnQnLFxuICAnYm9yZGVyLXRvcC1jb2xvcic6ICdib3JkZXItdCcsXG4gICdib3JkZXItcmlnaHQtY29sb3InOiAnYm9yZGVyLXInLFxuICAnYm9yZGVyLWJvdHRvbS1jb2xvcic6ICdib3JkZXItYicsXG4gICdib3JkZXItbGVmdC1jb2xvcic6ICdib3JkZXItbCcsXG4gIC8vIFx1MDQyMFx1MDQzMFx1MDQzN1x1MDQzQ1x1MDQzNVx1MDQ0MFx1MDQ0QlxuICAnd2lkdGgnOiAndycsXG4gICdtaW4td2lkdGgnOiAnbWluLXcnLFxuICAnbWF4LXdpZHRoJzogJ21heC13JyxcbiAgJ2hlaWdodCc6ICdoJyxcbiAgJ21pbi1oZWlnaHQnOiAnbWluLWgnLFxuICAnbWF4LWhlaWdodCc6ICdtYXgtaCcsXG4gIC8vIFx1MDQxRVx1MDQ0Mlx1MDQ0MVx1MDQ0Mlx1MDQ0M1x1MDQzRlx1MDQ0QlxuICAnbWFyZ2luJzogJ20nLFxuICAnbWFyZ2luLXRvcCc6ICdtdCcsXG4gICdtYXJnaW4tcmlnaHQnOiAnbXInLFxuICAnbWFyZ2luLWJvdHRvbSc6ICdtYicsXG4gICdtYXJnaW4tbGVmdCc6ICdtbCcsXG4gICdwYWRkaW5nJzogJ3AnLFxuICAncGFkZGluZy10b3AnOiAncHQnLFxuICAncGFkZGluZy1yaWdodCc6ICdwcicsXG4gICdwYWRkaW5nLWJvdHRvbSc6ICdwYicsXG4gICdwYWRkaW5nLWxlZnQnOiAncGwnLFxuICAvLyBGbGV4L0dyaWRcbiAgJ2Rpc3BsYXknOiAnJywgLy8gaGFuZGxlZCBzZXBhcmF0ZWx5XG4gICdmbGV4LWRpcmVjdGlvbic6ICdmbGV4JyxcbiAgJ2ZsZXgtd3JhcCc6ICdmbGV4JyxcbiAgJ2ZsZXgtZ3Jvdyc6ICdncm93JyxcbiAgJ2ZsZXgtc2hyaW5rJzogJ3NocmluaycsXG4gICdmbGV4LWJhc2lzJzogJ2Jhc2lzJyxcbiAgJ2p1c3RpZnktY29udGVudCc6ICdqdXN0aWZ5JyxcbiAgJ2FsaWduLWl0ZW1zJzogJ2l0ZW1zJyxcbiAgJ2FsaWduLXNlbGYnOiAnc2VsZicsXG4gICdhbGlnbi1jb250ZW50JzogJ2NvbnRlbnQnLFxuICAnb3JkZXInOiAnb3JkZXInLFxuICAnZ2FwJzogJ2dhcCcsXG4gICdyb3ctZ2FwJzogJ3Jvdy1nYXAnLFxuICAnY29sdW1uLWdhcCc6ICdjb2wtZ2FwJyxcbiAgLy8gR3JpZFxuICAnZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zJzogJ2dyaWQtY29scycsXG4gICdncmlkLXRlbXBsYXRlLXJvd3MnOiAnZ3JpZC1yb3dzJyxcbiAgJ2dyaWQtY29sdW1uJzogJ2NvbCcsXG4gICdncmlkLXJvdyc6ICdyb3cnLFxuICAnZ3JpZC1hdXRvLWZsb3cnOiAnZ3JpZC1mbG93JyxcbiAgLy8gQm9yZGVyXG4gICdib3JkZXItcmFkaXVzJzogJ3JvdW5kZWQnLFxuICAnYm9yZGVyLXdpZHRoJzogJ2JvcmRlcicsXG4gICdib3JkZXItc3R5bGUnOiAnYm9yZGVyJyxcbiAgLy8gXHUwNDIyXHUwNDM1XHUwNDNBXHUwNDQxXHUwNDQyXG4gICdmb250LXNpemUnOiAndGV4dCcsXG4gICdmb250LXdlaWdodCc6ICdmb250JyxcbiAgJ2ZvbnQtZmFtaWx5JzogJ2ZvbnQnLFxuICAnbGluZS1oZWlnaHQnOiAnbGVhZGluZycsXG4gICdsZXR0ZXItc3BhY2luZyc6ICd0cmFja2luZycsXG4gICd0ZXh0LWFsaWduJzogJ3RleHQnLFxuICAndGV4dC10cmFuc2Zvcm0nOiAndXBwZXJjYXNlJyxcbiAgJ3ZlcnRpY2FsLWFsaWduJzogJ2FsaWduJyxcbiAgLy8gXHUwNDFGXHUwNDQwXHUwNDNFXHUwNDQ3XHUwNDM1XHUwNDM1XG4gICdvcGFjaXR5JzogJ29wYWNpdHknLFxuICAnYm94LXNoYWRvdyc6ICdzaGFkb3cnLFxuICAnei1pbmRleCc6ICd6JyxcbiAgJ292ZXJmbG93JzogJ292ZXJmbG93JyxcbiAgJ292ZXJmbG93LXgnOiAnb3ZlcmZsb3cteCcsXG4gICdvdmVyZmxvdy15JzogJ292ZXJmbG93LXknLFxuICAnb2JqZWN0LWZpdCc6ICdvYmplY3QnLFxuICAnb2JqZWN0LXBvc2l0aW9uJzogJ29iamVjdCcsXG4gICdiYWNrZ3JvdW5kLWltYWdlJzogJ2JnLWltYWdlJyxcbiAgJ2JhY2tncm91bmQtcG9zaXRpb24nOiAnYmcnLFxuICAnYmFja2dyb3VuZC1zaXplJzogJ2JnJyxcbiAgJ2JhY2tncm91bmQtcmVwZWF0JzogJ2JnJyxcbiAgJ2JhY2tncm91bmQtY2xpcCc6ICdiZycsXG4gICdiYWNrZ3JvdW5kLWF0dGFjaG1lbnQnOiAnYmcnLFxuICAnY3Vyc29yJzogJ2N1cnNvcicsXG4gICd1c2VyLXNlbGVjdCc6ICdzZWxlY3QnLFxuICAncG9pbnRlci1ldmVudHMnOiAncG9pbnRlci1ldmVudHMnLFxuICAndHJhbnNpdGlvbic6ICd0cmFuc2l0aW9uJyxcbiAgJ3RyYW5zaXRpb24tcHJvcGVydHknOiAndHJhbnNpdGlvbicsXG4gICd0cmFuc2l0aW9uLWR1cmF0aW9uJzogJ2R1cmF0aW9uJyxcbiAgJ3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJzogJ2Vhc2UnLFxuICAndHJhbnNpdGlvbi1kZWxheSc6ICdkZWxheScsXG4gICdhbmltYXRpb24nOiAnYW5pbWF0ZScsXG4gICdhbmltYXRpb24tbmFtZSc6ICdhbmltYXRlJyxcbiAgJ2FuaW1hdGlvbi1kdXJhdGlvbic6ICdkdXJhdGlvbicsXG4gICdhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uJzogJ2Vhc2UnLFxuICAnYW5pbWF0aW9uLWRlbGF5JzogJ2RlbGF5JyxcbiAgJ2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQnOiAncmVwZWF0JyxcbiAgJ2FuaW1hdGlvbi1kaXJlY3Rpb24nOiAnZGlyZWN0aW9uJyxcbiAgJ2FuaW1hdGlvbi1maWxsLW1vZGUnOiAnZmlsbC1tb2RlJyxcbiAgJ2FuaW1hdGlvbi1wbGF5LXN0YXRlJzogJ3BsYXknLFxuICAnaXNvbGF0aW9uJzogJ2lzb2xhdGUnLFxuICAncG9zaXRpb24nOiAnJywgLy8gaGFuZGxlZCBzZXBhcmF0ZWx5XG4gICd0b3AnOiAndG9wJyxcbiAgJ3JpZ2h0JzogJ3JpZ2h0JyxcbiAgJ2JvdHRvbSc6ICdib3R0b20nLFxuICAnbGVmdCc6ICdsZWZ0JyxcbiAgJ3Zpc2liaWxpdHknOiAndmlzaWJsZScsXG4gICdmbG9hdCc6ICdmbG9hdCcsXG4gICdjbGVhcic6ICdjbGVhcicsXG4gICdyZXNpemUnOiAncmVzaXplJyxcbiAgJ2xpc3Qtc3R5bGUtdHlwZSc6ICdsaXN0JyxcbiAgJ2xpc3Qtc3R5bGUtcG9zaXRpb24nOiAnbGlzdCcsXG4gICdhcHBlYXJhbmNlJzogJ2FwcGVhcmFuY2UnLFxuICAnb3V0bGluZSc6ICdvdXRsaW5lJyxcbiAgJ291dGxpbmUtd2lkdGgnOiAnb3V0bGluZScsXG4gICdvdXRsaW5lLXN0eWxlJzogJ291dGxpbmUnLFxuICAnb3V0bGluZS1vZmZzZXQnOiAnb3V0bGluZS1vZmZzZXQnLFxuICAnZmlsdGVyJzogJ2ZpbHRlcicsXG4gICdiYWNrZHJvcC1maWx0ZXInOiAnYmFja2Ryb3AnLFxuICAnbWl4LWJsZW5kLW1vZGUnOiAnYmxlbmQnLFxuICAnYmFja2dyb3VuZC1ibGVuZC1tb2RlJzogJ2JnLWJsZW5kJyxcbiAgJ2JveC1zaXppbmcnOiAnYm94JyxcbiAgJ2NvbnRlbnQtdmlzaWJpbGl0eSc6ICdjb250ZW50JyxcbiAgJ2FzcGVjdC1yYXRpbyc6ICdhc3BlY3QnLFxuICAnd3JpdGluZy1tb2RlJzogJ3dyaXRpbmcnLFxuICAnd2hpdGUtc3BhY2UnOiAnd2hpdGVzcGFjZScsXG4gICd3b3JkLWJyZWFrJzogJ2JyZWFrJyxcbiAgJ292ZXJmbG93LXdyYXAnOiAnYnJlYWsnLFxuICAndGV4dC1vdmVyZmxvdyc6ICd0ZXh0LWVsbGlwc2lzJyxcbiAgJ3RleHQtZGVjb3JhdGlvbic6ICd1bmRlcmxpbmUnLFxuICAndGV4dC1kZWNvcmF0aW9uLXN0eWxlJzogJ2RlY29yYXRpb24nLFxuICAndGV4dC1kZWNvcmF0aW9uLXRoaWNrbmVzcyc6ICdkZWNvcmF0aW9uJyxcbiAgJ3RleHQtdW5kZXJsaW5lLW9mZnNldCc6ICd1bmRlcmxpbmUtb2Zmc2V0JyxcbiAgJ3RleHQtaW5kZW50JzogJ2luZGVudCcsXG4gICd0YWItc2l6ZSc6ICd0YWInLFxuICAnY2FyZXQtc2hhcGUnOiAnY2FyZXQnLFxuICAnc3Ryb2tlLXdpZHRoJzogJ3N0cm9rZScsXG4gICdzdHJva2UtZGFzaGFycmF5JzogJ3N0cm9rZScsXG4gICdzdHJva2UtZGFzaG9mZnNldCc6ICdzdHJva2UnLFxuICAnZmlsbC1vcGFjaXR5JzogJ2ZpbGwnLFxuICAnc3Ryb2tlLW9wYWNpdHknOiAnc3Ryb2tlJyxcbiAgJ2JhY2tmYWNlLXZpc2liaWxpdHknOiAnYmFja2ZhY2UnLFxuICAncGVyc3BlY3RpdmUnOiAncGVyc3BlY3RpdmUnLFxuICAncGVyc3BlY3RpdmUtb3JpZ2luJzogJ3BlcnNwZWN0aXZlJyxcbiAgJ3RyYW5zZm9ybSc6ICd0cmFuc2Zvcm0nLFxuICAndHJhbnNmb3JtLW9yaWdpbic6ICdvcmlnaW4nLFxuICAnc2NhbGUnOiAnc2NhbGUnLFxuICAncm90YXRlJzogJ3JvdGF0ZScsXG4gICd0cmFuc2xhdGUnOiAndHJhbnNsYXRlJyxcbiAgJ3NrZXcnOiAnc2tldycsXG59O1xuXG5leHBvcnQgY2xhc3MgQ1NTVXRpbHMge1xuICAvKipcbiAgICogXHUwNDFGXHUwNDQwXHUwNDM1XHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDQzXHUwNDM1XHUwNDQyIENTUyBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0MzlcdTA0NDFcdTA0NDJcdTA0MzJcdTA0M0UgXHUwNDMyIFVub0NTUyBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcbiAgICovXG4gIHN0YXRpYyBjb252ZXJ0UHJvcGVydHlUb1Vub0NsYXNzKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB8IG51bGwge1xuICAgIGNvbnN0IHRyaW1tZWRWYWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICBcbiAgICAvLyBEaXNwbGF5XG4gICAgaWYgKHByb3BlcnR5ID09PSAnZGlzcGxheScpIHtcbiAgICAgIGNvbnN0IGRpc3BsYXlNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICdmbGV4JzogJ2ZsZXgnLFxuICAgICAgICAnZ3JpZCc6ICdncmlkJyxcbiAgICAgICAgJ2Jsb2NrJzogJ2Jsb2NrJyxcbiAgICAgICAgJ2lubGluZSc6ICdpbmxpbmUnLFxuICAgICAgICAnaW5saW5lLWJsb2NrJzogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICdub25lJzogJ2hpZGRlbicsXG4gICAgICB9O1xuICAgICAgY29uc3QgdW5vQ2xhc3MgPSBkaXNwbGF5TWFwW3RyaW1tZWRWYWx1ZV07XG4gICAgICByZXR1cm4gdW5vQ2xhc3MgPyBbdW5vQ2xhc3NdIDogbnVsbDtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ3Bvc2l0aW9uJykge1xuICAgICAgY29uc3QgcG9zaXRpb25NYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICdyZWxhdGl2ZSc6ICdyZWxhdGl2ZScsXG4gICAgICAgICdhYnNvbHV0ZSc6ICdhYnNvbHV0ZScsXG4gICAgICAgICdmaXhlZCc6ICdmaXhlZCcsXG4gICAgICAgICdzdGlja3knOiAnc3RpY2t5JyxcbiAgICAgICAgJ3N0YXRpYyc6ICdzdGF0aWMnLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHVub0NsYXNzID0gcG9zaXRpb25NYXBbdHJpbW1lZFZhbHVlXTtcbiAgICAgIHJldHVybiB1bm9DbGFzcyA/IFt1bm9DbGFzc10gOiBudWxsO1xuICAgIH1cblxuICAgIC8vIGJhY2tncm91bmQtaW1hZ2VcbiAgICBpZiAocHJvcGVydHkgPT09ICdiYWNrZ3JvdW5kLWltYWdlJykge1xuICAgICAgaWYgKHRyaW1tZWRWYWx1ZS5zdGFydHNXaXRoKCd1cmwoJykpIHtcbiAgICAgICAgcmV0dXJuIFtgYmctWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIH0gZWxzZSBpZiAodHJpbW1lZFZhbHVlLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xuICAgICAgICByZXR1cm4gW2BiZy1bdXJsKCR7dHJpbW1lZFZhbHVlfSldYF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW2BiZy1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGJhY2tncm91bmQtY29sb3JcbiAgICBpZiAocHJvcGVydHkgPT09ICdiYWNrZ3JvdW5kLWNvbG9yJykge1xuICAgICAgaWYgKC9eLT9cXGQrKFxcLlxcZCspP3B4JC8udGVzdCh0cmltbWVkVmFsdWUpKSByZXR1cm4gW2BiZy1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgICAgaWYgKC9eI3xecmdifF5oc2wvLnRlc3QodHJpbW1lZFZhbHVlKSkgcmV0dXJuIFtgYmctWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIGlmICgvXlthLXpBLVpdKyQvLnRlc3QodHJpbW1lZFZhbHVlKSkgcmV0dXJuIFtgYmctWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIHJldHVybiBbYGJnLVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gY29sb3JcbiAgICBpZiAocHJvcGVydHkgPT09ICdjb2xvcicpIHtcbiAgICAgIGlmICgvXi0/XFxkKyhcXC5cXGQrKT9weCQvLnRlc3QodHJpbW1lZFZhbHVlKSkgcmV0dXJuIFtgdGV4dC1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgICAgaWYgKC9eI3xecmdifF5oc2wvLnRlc3QodHJpbW1lZFZhbHVlKSkgcmV0dXJuIFtgdGV4dC1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgICAgaWYgKC9eW2EtekEtWl0rJC8udGVzdCh0cmltbWVkVmFsdWUpKSByZXR1cm4gW2B0ZXh0LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgICByZXR1cm4gW2B0ZXh0LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gYm9yZGVyLXJhZGl1c1xuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ2JvcmRlci1yYWRpdXMnKSB7XG4gICAgICBpZiAoL14tP1xcZCsoXFwuXFxkKyk/cHgkLy50ZXN0KHRyaW1tZWRWYWx1ZSkpIHJldHVybiBbYHJvdW5kZWQtWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIGNvbnN0IHVub1JhZGl1c01hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJzRweCc6ICdyb3VuZGVkJyxcbiAgICAgICAgJzhweCc6ICdyb3VuZGVkLW1kJyxcbiAgICAgICAgJzEycHgnOiAncm91bmRlZC1sZycsXG4gICAgICAgICc5OTk5cHgnOiAncm91bmRlZC1mdWxsJyxcbiAgICAgIH07XG4gICAgICBpZiAodW5vUmFkaXVzTWFwW3RyaW1tZWRWYWx1ZV0pIHJldHVybiBbdW5vUmFkaXVzTWFwW3RyaW1tZWRWYWx1ZV1dO1xuICAgICAgcmV0dXJuIFtgcm91bmRlZC1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIH1cblxuICAgIC8vIGZvbnQtd2VpZ2h0XG4gICAgaWYgKHByb3BlcnR5ID09PSAnZm9udC13ZWlnaHQnKSB7XG4gICAgICBjb25zdCB1bm9XZWlnaHRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICdib2xkJzogJ2ZvbnQtYm9sZCcsXG4gICAgICAgICdub3JtYWwnOiAnZm9udC1ub3JtYWwnLFxuICAgICAgICAnNjAwJzogJ2ZvbnQtc2VtaWJvbGQnLFxuICAgICAgICAnNzAwJzogJ2ZvbnQtYm9sZCcsXG4gICAgICAgICc0MDAnOiAnZm9udC1ub3JtYWwnLFxuICAgICAgfTtcbiAgICAgIGlmICh1bm9XZWlnaHRNYXBbdHJpbW1lZFZhbHVlXSkgcmV0dXJuIFt1bm9XZWlnaHRNYXBbdHJpbW1lZFZhbHVlXV07XG4gICAgICByZXR1cm4gW2Bmb250LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gZm9udC1zaXplXG4gICAgaWYgKHByb3BlcnR5ID09PSAnZm9udC1zaXplJykge1xuICAgICAgaWYgKC9eLT9cXGQrKFxcLlxcZCspP3B4JC8udGVzdCh0cmltbWVkVmFsdWUpKSByZXR1cm4gW2B0ZXh0LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgICBjb25zdCB1bm9TaXplTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgICAnMTZweCc6ICd0ZXh0LWJhc2UnLFxuICAgICAgICAnMThweCc6ICd0ZXh0LWxnJyxcbiAgICAgICAgJzIwcHgnOiAndGV4dC14bCcsXG4gICAgICAgICcyNHB4JzogJ3RleHQtMnhsJyxcbiAgICAgICAgJzMycHgnOiAndGV4dC00eGwnLFxuICAgICAgICAnMTJweCc6ICd0ZXh0LXhzJyxcbiAgICAgICAgJzE0cHgnOiAndGV4dC1zbScsXG4gICAgICB9O1xuICAgICAgaWYgKHVub1NpemVNYXBbdHJpbW1lZFZhbHVlXSkgcmV0dXJuIFt1bm9TaXplTWFwW3RyaW1tZWRWYWx1ZV1dO1xuICAgICAgcmV0dXJuIFtgdGV4dC1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIH1cblxuICAgIC8vIHRleHQtYWxpZ25cbiAgICBpZiAocHJvcGVydHkgPT09ICd0ZXh0LWFsaWduJykge1xuICAgICAgY29uc3QgYWxpZ25NYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICdjZW50ZXInOiAndGV4dC1jZW50ZXInLFxuICAgICAgICAnbGVmdCc6ICd0ZXh0LWxlZnQnLFxuICAgICAgICAncmlnaHQnOiAndGV4dC1yaWdodCcsXG4gICAgICAgICdqdXN0aWZ5JzogJ3RleHQtanVzdGlmeScsXG4gICAgICAgICdzdGFydCc6ICd0ZXh0LXN0YXJ0JyxcbiAgICAgICAgJ2VuZCc6ICd0ZXh0LWVuZCdcbiAgICAgIH07XG4gICAgICByZXR1cm4gYWxpZ25NYXBbdHJpbW1lZFZhbHVlXSA/IFthbGlnbk1hcFt0cmltbWVkVmFsdWVdXSA6IFtgdGV4dC1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIH1cblxuICAgIC8vIGJvcmRlci13aWR0aFxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ2JvcmRlci13aWR0aCcpIHtcbiAgICAgIGNvbnN0IHVub0JvcmRlcldpZHRoTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgICAnMXB4JzogJ2JvcmRlcicsXG4gICAgICAgICcycHgnOiAnYm9yZGVyLTInLFxuICAgICAgICAnNHB4JzogJ2JvcmRlci00JyxcbiAgICAgICAgJzhweCc6ICdib3JkZXItOCcsXG4gICAgICB9O1xuICAgICAgaWYgKHVub0JvcmRlcldpZHRoTWFwW3RyaW1tZWRWYWx1ZV0pIHJldHVybiBbdW5vQm9yZGVyV2lkdGhNYXBbdHJpbW1lZFZhbHVlXV07XG4gICAgICByZXR1cm4gW2Bib3JkZXItWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICB9XG5cbiAgICAvLyBib3JkZXItc3R5bGVcbiAgICBpZiAocHJvcGVydHkgPT09ICdib3JkZXItc3R5bGUnKSB7XG4gICAgICBjb25zdCB1bm9Cb3JkZXJTdHlsZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJ3NvbGlkJzogJ2JvcmRlci1zb2xpZCcsXG4gICAgICAgICdkYXNoZWQnOiAnYm9yZGVyLWRhc2hlZCcsXG4gICAgICAgICdkb3R0ZWQnOiAnYm9yZGVyLWRvdHRlZCcsXG4gICAgICAgICdkb3VibGUnOiAnYm9yZGVyLWRvdWJsZScsXG4gICAgICAgICdub25lJzogJ2JvcmRlci1ub25lJyxcbiAgICAgIH07XG4gICAgICBpZiAodW5vQm9yZGVyU3R5bGVNYXBbdHJpbW1lZFZhbHVlXSkgcmV0dXJuIFt1bm9Cb3JkZXJTdHlsZU1hcFt0cmltbWVkVmFsdWVdXTtcbiAgICAgIHJldHVybiBbYGJvcmRlci1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIH1cblxuICAgIC8vIGJvcmRlci1jb2xvclxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ2JvcmRlci1jb2xvcicpIHtcbiAgICAgIGlmICgvXiN8XnJnYnxeaHNsLy50ZXN0KHRyaW1tZWRWYWx1ZSkpIHJldHVybiBbYGJvcmRlci1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgICAgaWYgKC9eW2EtekEtWl0rJC8udGVzdCh0cmltbWVkVmFsdWUpKSByZXR1cm4gW2Bib3JkZXItWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIHJldHVybiBbYGJvcmRlci1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIH1cblxuICAgIC8vIHdpZHRoL2hlaWdodFxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ3dpZHRoJykge1xuICAgICAgaWYgKC9eLT9cXGQrKFxcLlxcZCspP3B4JC8udGVzdCh0cmltbWVkVmFsdWUpKSByZXR1cm4gW2B3LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgICBjb25zdCB1bm9XaWR0aE1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJzEwMCUnOiAndy1mdWxsJyxcbiAgICAgICAgJzEwMHZ3JzogJ3ctc2NyZWVuJyxcbiAgICAgICAgJ2F1dG8nOiAndy1hdXRvJyxcbiAgICAgICAgJzEwMHB4JzogJ3ctMTAwcHgnLFxuICAgICAgICAnMjAwcHgnOiAndy0yMDBweCcsXG4gICAgICAgICcxNTBweCc6ICd3LTE1MHB4JyxcbiAgICAgIH07XG4gICAgICBpZiAodW5vV2lkdGhNYXBbdHJpbW1lZFZhbHVlXSkgcmV0dXJuIFt1bm9XaWR0aE1hcFt0cmltbWVkVmFsdWVdXTtcbiAgICAgIHJldHVybiBbYHctWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICB9XG4gICAgaWYgKHByb3BlcnR5ID09PSAnaGVpZ2h0Jykge1xuICAgICAgaWYgKC9eLT9cXGQrKFxcLlxcZCspP3B4JC8udGVzdCh0cmltbWVkVmFsdWUpKSByZXR1cm4gW2BoLVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgICBjb25zdCB1bm9IZWlnaHRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICcxMDAlJzogJ2gtZnVsbCcsXG4gICAgICAgICcxMDB2aCc6ICdoLXNjcmVlbicsXG4gICAgICAgICdhdXRvJzogJ2gtYXV0bycsXG4gICAgICAgICcxMDBweCc6ICdoLTEwMHB4JyxcbiAgICAgICAgJzIwMHB4JzogJ2gtMjAwcHgnLFxuICAgICAgICAnMTUwcHgnOiAnaC0xNTBweCcsXG4gICAgICB9O1xuICAgICAgaWYgKHVub0hlaWdodE1hcFt0cmltbWVkVmFsdWVdKSByZXR1cm4gW3Vub0hlaWdodE1hcFt0cmltbWVkVmFsdWVdXTtcbiAgICAgIHJldHVybiBbYGgtWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICB9XG5cbiAgICAvLyBtYXJnaW4vcGFkZGluZyAoXHUwNDQ4XHUwNDNFXHUwNDQwXHUwNDQyXHUwNDNBXHUwNDMwXHUwNDQyXHUwNDRCKVxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ21hcmdpbicgfHwgcHJvcGVydHkgPT09ICdwYWRkaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Nob3J0aGFuZFByb3BlcnR5KHByb3BlcnR5LCB0cmltbWVkVmFsdWUpO1xuICAgIH1cbiAgICBpZiAocHJvcGVydHkgPT09ICdtYXJnaW4tdG9wJykgcmV0dXJuIFtgbXQtWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICBpZiAocHJvcGVydHkgPT09ICdtYXJnaW4tcmlnaHQnKSByZXR1cm4gW2Btci1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ21hcmdpbi1ib3R0b20nKSByZXR1cm4gW2BtYi1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ21hcmdpbi1sZWZ0JykgcmV0dXJuIFtgbWwtWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICBpZiAocHJvcGVydHkgPT09ICdwYWRkaW5nLXRvcCcpIHJldHVybiBbYHB0LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgaWYgKHByb3BlcnR5ID09PSAncGFkZGluZy1yaWdodCcpIHJldHVybiBbYHByLVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgaWYgKHByb3BlcnR5ID09PSAncGFkZGluZy1ib3R0b20nKSByZXR1cm4gW2BwYi1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ3BhZGRpbmctbGVmdCcpIHJldHVybiBbYHBsLVske3RyaW1tZWRWYWx1ZX1dYF07XG5cbiAgICAvLyBib3JkZXIgKFx1MDQ0OFx1MDQzRVx1MDQ0MFx1MDQ0Mlx1MDQzQVx1MDQzMFx1MDQ0MilcbiAgICBpZiAocHJvcGVydHkgPT09ICdib3JkZXInKSB7XG4gICAgICAvLyBcdTA0MUVcdTA0MzZcdTA0MzhcdTA0MzRcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDQ0XHUwNDNFXHUwNDQwXHUwNDNDXHUwNDMwXHUwNDQyOiAnMnB4IHNvbGlkICMzMzMnIFx1MDQzOFx1MDQzQlx1MDQzOCBcdTA0M0ZcdTA0M0VcdTA0MzRcdTA0M0VcdTA0MzFcdTA0M0RcdTA0M0VcdTA0MzVcbiAgICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZFZhbHVlLnNwbGl0KC9cXHMrLyk7XG4gICAgICBjb25zdCB1bm9DbGFzc2VzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAgIGlmIChbXCJzb2xpZFwiLFwiZGFzaGVkXCIsXCJkb3R0ZWRcIixcImRvdWJsZVwiLFwibm9uZVwiXS5pbmNsdWRlcyhwYXJ0KSkge1xuICAgICAgICAgIHVub0NsYXNzZXMucHVzaChgYm9yZGVyLSR7cGFydH1gKTtcbiAgICAgICAgfSBlbHNlIGlmICgvXlxcZCsocHh8ZW18cmVtKT8kLy50ZXN0KHBhcnQpKSB7XG4gICAgICAgICAgY29uc3QgdW5vQm9yZGVyV2lkdGhNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICAgICAnMXB4JzogJ2JvcmRlcicsXG4gICAgICAgICAgICAnMnB4JzogJ2JvcmRlci0yJyxcbiAgICAgICAgICAgICc0cHgnOiAnYm9yZGVyLTQnLFxuICAgICAgICAgICAgJzhweCc6ICdib3JkZXItOCcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICB1bm9DbGFzc2VzLnB1c2godW5vQm9yZGVyV2lkdGhNYXBbcGFydF0gfHwgYGJvcmRlci1bJHtwYXJ0fV1gKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJ0LnN0YXJ0c1dpdGgoJyMnKSB8fCBwYXJ0LnN0YXJ0c1dpdGgoJ3JnYicpIHx8IHBhcnQuc3RhcnRzV2l0aCgnaHNsJykpIHtcbiAgICAgICAgICB1bm9DbGFzc2VzLnB1c2goYGJvcmRlci1bJHtwYXJ0fV1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVub0NsYXNzZXMubGVuZ3RoID4gMCA/IHVub0NsYXNzZXMgOiBudWxsO1xuICAgIH1cblxuICAgIC8vIGJveC1zaGFkb3dcbiAgICBpZiAocHJvcGVydHkgPT09ICdib3gtc2hhZG93Jykge1xuICAgICAgcmV0dXJuIFtgc2hhZG93LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gb3BhY2l0eVxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ29wYWNpdHknKSB7XG4gICAgICByZXR1cm4gW2BvcGFjaXR5LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gei1pbmRleFxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ3otaW5kZXgnKSB7XG4gICAgICByZXR1cm4gW2B6LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gb3ZlcmZsb3dcbiAgICBpZiAocHJvcGVydHkgPT09ICdvdmVyZmxvdycpIHtcbiAgICAgIHJldHVybiBbYG92ZXJmbG93LVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gdGV4dC1kZWNvcmF0aW9uXG4gICAgaWYgKHByb3BlcnR5ID09PSAndGV4dC1kZWNvcmF0aW9uJykge1xuICAgICAgcmV0dXJuIFtgdGV4dC1kZWNvcmF0aW9uLVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gZmFsbGJhY2tcbiAgICByZXR1cm4gW2BbJHtwcm9wZXJ0eX06JHt0cmltbWVkVmFsdWV9XWBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFx1MDQxRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzMFx1MDQ0Mlx1MDQ0Qlx1MDQzMlx1MDQzMFx1MDQzNVx1MDQ0MiBcdTA0NDFcdTA0M0VcdTA0M0FcdTA0NDBcdTA0MzBcdTA0NDlcdTA0NTFcdTA0M0RcdTA0M0RcdTA0NEJcdTA0MzUgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDM5XHUwNDQxXHUwNDQyXHUwNDMyXHUwNDMwIG1hcmdpbi9wYWRkaW5nXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBwcm9jZXNzU2hvcnRoYW5kUHJvcGVydHkocHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KC9cXHMrLyk7XG4gICAgY29uc3QgdW5vQ2xhc3Nlczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBwcmVmaXggPSBwcm9wZXJ0eVswXTsgLy8gJ20nIFx1MDQzNFx1MDQzQlx1MDQ0RiBtYXJnaW4sICdwJyBcdTA0MzRcdTA0M0JcdTA0NEYgcGFkZGluZ1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0KHZhbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBgWyR7dmFsfV1gO1xuICAgIH1cblxuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9LSR7Zm9ybWF0KHBhcnRzWzBdKX1gKTtcbiAgICB9IGVsc2UgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGAke3ByZWZpeH15LSR7Zm9ybWF0KHBhcnRzWzBdKX1gKTtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9eC0ke2Zvcm1hdChwYXJ0c1sxXSl9YCk7XG4gICAgfSBlbHNlIGlmIChwYXJ0cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9dC0ke2Zvcm1hdChwYXJ0c1swXSl9YCk7XG4gICAgICB1bm9DbGFzc2VzLnB1c2goYCR7cHJlZml4fXgtJHtmb3JtYXQocGFydHNbMV0pfWApO1xuICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGAke3ByZWZpeH1iLSR7Zm9ybWF0KHBhcnRzWzJdKX1gKTtcbiAgICB9IGVsc2UgaWYgKHBhcnRzLmxlbmd0aCA9PT0gNCkge1xuICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGAke3ByZWZpeH10LSR7Zm9ybWF0KHBhcnRzWzBdKX1gKTtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9ci0ke2Zvcm1hdChwYXJ0c1sxXSl9YCk7XG4gICAgICB1bm9DbGFzc2VzLnB1c2goYCR7cHJlZml4fWItJHtmb3JtYXQocGFydHNbMl0pfWApO1xuICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGAke3ByZWZpeH1sLSR7Zm9ybWF0KHBhcnRzWzNdKX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5vQ2xhc3NlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBcdTA0MUZcdTA0NDBcdTA0MzVcdTA0M0VcdTA0MzFcdTA0NDBcdTA0MzBcdTA0MzdcdTA0NDNcdTA0MzVcdTA0NDIgQ1NTIEFTVCBcdTA0MzdcdTA0M0RcdTA0MzBcdTA0NDdcdTA0MzVcdTA0M0RcdTA0MzhcdTA0MzUgXHUwNDMyIFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzRVx1MDQzQVx1MDQ0M1xuICAgKi9cbiAgc3RhdGljIHByb3BlcnR5VmFsdWVUb1N0cmluZyh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgICBpZiAodmFsdWUudHlwZSA9PT0gJ1ZhbHVlJyAmJiB2YWx1ZS5jaGlsZHJlbikge1xuICAgICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgXG4gICAgICAvLyBcdTA0MUVcdTA0MzFcdTA0NDBcdTA0MzBcdTA0MzFcdTA0MzBcdTA0NDJcdTA0NEJcdTA0MzJcdTA0MzBcdTA0MzVcdTA0M0MgTGlzdCBcdTA0M0VcdTA0MzFcdTA0NEFcdTA0MzVcdTA0M0FcdTA0NDIgXHUwNDM4XHUwNDM3IGNzcy10cmVlXG4gICAgICBsZXQgY3VycmVudCA9IHZhbHVlLmNoaWxkcmVuLmhlYWQ7XG4gICAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGN1cnJlbnQuZGF0YTtcbiAgICAgICAgbGV0IGNoaWxkVmFsdWUgPSAnJztcbiAgICAgICAgXG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSAnUmF3Jykge1xuICAgICAgICAgIGNoaWxkVmFsdWUgPSBjaGlsZC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC50eXBlID09PSAnU3RyaW5nJykge1xuICAgICAgICAgIGNoaWxkVmFsdWUgPSBgXCIke2NoaWxkLnZhbHVlfVwiYDtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC50eXBlID09PSAnTnVtYmVyJykge1xuICAgICAgICAgIGNoaWxkVmFsdWUgPSBjaGlsZC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC50eXBlID09PSAnRGltZW5zaW9uJykge1xuICAgICAgICAgIGNoaWxkVmFsdWUgPSBjaGlsZC52YWx1ZSArIGNoaWxkLnVuaXQ7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQudHlwZSA9PT0gJ0hhc2gnKSB7XG4gICAgICAgICAgY2hpbGRWYWx1ZSA9ICcjJyArIGNoaWxkLnZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnR5cGUgPT09ICdGdW5jdGlvbicpIHtcbiAgICAgICAgICAvLyBcdTA0MUVcdTA0MzFcdTA0NDBcdTA0MzBcdTA0MzFcdTA0M0VcdTA0NDJcdTA0M0FcdTA0MzAgXHUwNDQ0XHUwNDQzXHUwNDNEXHUwNDNBXHUwNDQ2XHUwNDM4XHUwNDM5IFx1MDQ0Mlx1MDQzOFx1MDQzRlx1MDQzMCB1cmwoKSwgcmdiKCksIGhzbCgpXG4gICAgICAgICAgbGV0IGZ1bmNTdHIgPSBjaGlsZC5uYW1lICsgJygnO1xuICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbikge1xuICAgICAgICAgICAgbGV0IGZ1bmNDdXJyZW50ID0gY2hpbGQuY2hpbGRyZW4uaGVhZDtcbiAgICAgICAgICAgIHdoaWxlIChmdW5jQ3VycmVudCkge1xuICAgICAgICAgICAgICBjb25zdCBmdW5jQ2hpbGQgPSBmdW5jQ3VycmVudC5kYXRhO1xuICAgICAgICAgICAgICBpZiAoZnVuY0NoaWxkLnR5cGUgPT09ICdTdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZnVuY1N0ciArPSBgXCIke2Z1bmNDaGlsZC52YWx1ZX1cImA7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY0NoaWxkLnR5cGUgPT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICAgICAgZnVuY1N0ciArPSBmdW5jQ2hpbGQudmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY0NoaWxkLnR5cGUgPT09ICdEaW1lbnNpb24nKSB7XG4gICAgICAgICAgICAgICAgZnVuY1N0ciArPSBmdW5jQ2hpbGQudmFsdWUgKyBmdW5jQ2hpbGQudW5pdDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChmdW5jQ2hpbGQudHlwZSA9PT0gJ0hhc2gnKSB7XG4gICAgICAgICAgICAgICAgZnVuY1N0ciArPSAnIycgKyBmdW5jQ2hpbGQudmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY0NoaWxkLnR5cGUgPT09ICdSYXcnKSB7XG4gICAgICAgICAgICAgICAgZnVuY1N0ciArPSBmdW5jQ2hpbGQudmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY0NoaWxkLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgICAgIGZ1bmNTdHIgKz0gZnVuY0NoaWxkLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZnVuY0N1cnJlbnQgPSBmdW5jQ3VycmVudC5uZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmdW5jU3RyICs9ICcpJztcbiAgICAgICAgICBjaGlsZFZhbHVlID0gZnVuY1N0cjtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC50eXBlID09PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICBjaGlsZFZhbHVlID0gY2hpbGQubmFtZTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC52YWx1ZSkge1xuICAgICAgICAgIGNoaWxkVmFsdWUgPSBjaGlsZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGNoaWxkVmFsdWUpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChjaGlsZFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBcdTA0MThcdTA0MzdcdTA0MzJcdTA0M0JcdTA0MzVcdTA0M0FcdTA0MzBcdTA0MzVcdTA0NDIgXHUwNDM4XHUwNDNDXHUwNDRGIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQzMCBcdTA0MzhcdTA0MzcgQ1NTIFx1MDQ0MVx1MDQzNVx1MDQzQlx1MDQzNVx1MDQzQVx1MDQ0Mlx1MDQzRVx1MDQ0MFx1MDQzMFxuICAgKi9cbiAgc3RhdGljIGV4dHJhY3RDbGFzc05hbWUoc2VsZWN0b3I6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IGNsYXNzTWF0Y2ggPSBzZWxlY3Rvci5tYXRjaCgvXFwuKFthLXpBLVowLTlfLV0rKS8pO1xuICAgIHJldHVybiBjbGFzc01hdGNoID8gY2xhc3NNYXRjaFsxXSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogXHUwNDE4XHUwNDM3XHUwNDMyXHUwNDNCXHUwNDM1XHUwNDNBXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQ0MVx1MDQzNVx1MDQzQlx1MDQzNVx1MDQzQVx1MDQ0Mlx1MDQzRVx1MDQ0MFx1MDQ0QiBcdTA0MzhcdTA0MzcgQ1NTIEFTVFxuICAgKi9cbiAgc3RhdGljIGV4dHJhY3RTZWxlY3RvcnMocHJlbHVkZTogYW55KTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHNlbGVjdG9yczogc3RyaW5nW10gPSBbXTtcbiAgICBcbiAgICBpZiAocHJlbHVkZT8uY2hpbGRyZW4pIHtcbiAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2YgcHJlbHVkZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAoc2VsZWN0b3IudHlwZSA9PT0gJ1NlbGVjdG9yJykge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdG9yVGV4dCA9IHRoaXMuc2VsZWN0b3JUb1N0cmluZyhzZWxlY3Rvcik7XG4gICAgICAgICAgc2VsZWN0b3JzLnB1c2goc2VsZWN0b3JUZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3RvcnM7XG4gIH1cblxuICAvKipcbiAgICogXHUwNDFGXHUwNDQwXHUwNDM1XHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDQzXHUwNDM1XHUwNDQyIENTUyBBU1QgXHUwNDQxXHUwNDM1XHUwNDNCXHUwNDM1XHUwNDNBXHUwNDQyXHUwNDNFXHUwNDQwIFx1MDQzMiBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0M0VcdTA0M0FcdTA0NDNcbiAgICovXG4gIHN0YXRpYyBzZWxlY3RvclRvU3RyaW5nKHNlbGVjdG9yOiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCByZXN1bHQgPSAnJztcbiAgICBcbiAgICBpZiAoc2VsZWN0b3IuY2hpbGRyZW4pIHtcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygc2VsZWN0b3IuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdDbGFzc1NlbGVjdG9yJykge1xuICAgICAgICAgIHJlc3VsdCArPSAnLicgKyBjaGlsZC5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnR5cGUgPT09ICdJZFNlbGVjdG9yJykge1xuICAgICAgICAgIHJlc3VsdCArPSAnIycgKyBjaGlsZC5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnR5cGUgPT09ICdFbGVtZW50U2VsZWN0b3InKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IGNoaWxkLm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQudHlwZSA9PT0gJ0NvbWJpbmF0b3InKSB7XG4gICAgICAgICAgcmVzdWx0ICs9ICcgJyArIGNoaWxkLm5hbWUgKyAnICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0LnRyaW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBcdTA0MThcdTA0MzdcdTA0MzJcdTA0M0JcdTA0MzVcdTA0M0FcdTA0MzBcdTA0MzVcdTA0NDIgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDM5XHUwNDQxXHUwNDQyXHUwNDMyXHUwNDMwIFx1MDQzOFx1MDQzNyBDU1MgQVNUIFx1MDQzMVx1MDQzQlx1MDQzRVx1MDQzQVx1MDQzMFxuICAgKi9cbiAgc3RhdGljIGV4dHJhY3RQcm9wZXJ0aWVzKGJsb2NrOiBhbnkpOiBhbnlbXSB7XG4gICAgY29uc3QgcHJvcGVydGllczogYW55W10gPSBbXTtcbiAgICBcbiAgICBpZiAoYmxvY2s/LmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGJsb2NrLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSAnRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9XG59ICIsICJpbXBvcnQgeyBwYXJzZSB9IGZyb20gJ25vZGUtaHRtbC1wYXJzZXInO1xyXG5pbXBvcnQgeyBwYXJzZSBhcyBwYXJzZUNTUywgd2FsayB9IGZyb20gJ2Nzcy10cmVlJztcclxuaW1wb3J0IHsgQ1NTVXRpbHMgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBWdWVQcm9jZXNzb3Ige1xyXG4gIGFzeW5jIHByb2Nlc3MoY29kZTogc3RyaW5nLCBpZDogc3RyaW5nLCBjbGFzc01hcHBpbmdDYWNoZTogTWFwPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zb2xlLmxvZyhgW3Z1ZS1wcm9jZXNzb3JdIFByb2Nlc3NpbmcgVnVlIGZpbGU6ICR7aWR9YCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gQ29kZSBsZW5ndGg6ICR7Y29kZS5sZW5ndGh9YCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gQ29kZSBwcmV2aWV3OiAke2NvZGUuc3Vic3RyaW5nKDAsIDIwMCl9Li4uYCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTA0MjBcdTA0MzBcdTA0MzdcdTA0MzFcdTA0MzhcdTA0NDBcdTA0MzBcdTA0MzVcdTA0M0MgVnVlIFx1MDQ0NFx1MDQzMFx1MDQzOVx1MDQzQiBcdTA0M0RcdTA0MzAgXHUwNDQxXHUwNDM1XHUwNDNBXHUwNDQ2XHUwNDM4XHUwNDM4XHJcbiAgICAgIGNvbnN0IHRlbXBsYXRlTWF0Y2ggPSBjb2RlLm1hdGNoKC88dGVtcGxhdGVbXj5dKj4oW1xcc1xcU10qPyk8XFwvdGVtcGxhdGU+Lyk7XHJcbiAgICAgIGNvbnN0IHN0eWxlTWF0Y2hlcyA9IGNvZGUubWF0Y2goLzxzdHlsZVtePl0qPihbXFxzXFxTXSo/KTxcXC9zdHlsZT4vZyk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zb2xlLmxvZyhgW3Z1ZS1wcm9jZXNzb3JdIEZvdW5kICR7c3R5bGVNYXRjaGVzPy5sZW5ndGggfHwgMH0gc3R5bGUgYmxvY2tzYCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gVGVtcGxhdGUgZm91bmQ6ICR7ISF0ZW1wbGF0ZU1hdGNofWApO1xyXG4gICAgICBcclxuICAgICAgaWYgKHN0eWxlTWF0Y2hlcykge1xyXG4gICAgICAgIHN0eWxlTWF0Y2hlcy5mb3JFYWNoKChtYXRjaCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gU3R5bGUgYmxvY2sgJHtpbmRleH06ICR7bWF0Y2guc3Vic3RyaW5nKDAsIDEwMCl9Li4uYCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGxldCBwcm9jZXNzZWRDb2RlID0gY29kZTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1MDQxRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzMFx1MDQ0Mlx1MDQ0Qlx1MDQzMlx1MDQzMFx1MDQzNVx1MDQzQyB0ZW1wbGF0ZVxyXG4gICAgICBpZiAodGVtcGxhdGVNYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlQ29udGVudCA9IHRlbXBsYXRlTWF0Y2hbMV07XHJcbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkVGVtcGxhdGUgPSBhd2FpdCB0aGlzLnByb2Nlc3NUZW1wbGF0ZSh0ZW1wbGF0ZUNvbnRlbnQsIGNsYXNzTWFwcGluZ0NhY2hlKTtcclxuICAgICAgICBwcm9jZXNzZWRDb2RlID0gcHJvY2Vzc2VkQ29kZS5yZXBsYWNlKHRlbXBsYXRlTWF0Y2hbMF0sIFxyXG4gICAgICAgICAgdGVtcGxhdGVNYXRjaFswXS5yZXBsYWNlKHRlbXBsYXRlQ29udGVudCwgcHJvY2Vzc2VkVGVtcGxhdGUpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQ0MVx1MDQ0Mlx1MDQzOFx1MDQzQlx1MDQzOFxyXG4gICAgICBpZiAoc3R5bGVNYXRjaGVzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBzdHlsZU1hdGNoIG9mIHN0eWxlTWF0Y2hlcykge1xyXG4gICAgICAgICAgY29uc3Qgc3R5bGVDb250ZW50ID0gc3R5bGVNYXRjaC5tYXRjaCgvPHN0eWxlW14+XSo+KFtcXHNcXFNdKj8pPFxcL3N0eWxlPi8pPy5bMV07XHJcbiAgICAgICAgICBpZiAoc3R5bGVDb250ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gUHJvY2Vzc2luZyBzdHlsZSBibG9jazpgLCBzdHlsZUNvbnRlbnQuc3Vic3RyaW5nKDAsIDEwMCkgKyAnLi4uJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBcdTA0MThcdTA0MzdcdTA0MzJcdTA0M0JcdTA0MzVcdTA0M0FcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCIFx1MDQzOFx1MDQzNyBcdTA0NDFcdTA0NDJcdTA0MzhcdTA0M0JcdTA0MzVcdTA0MzkgXHUwNDM4IFx1MDQzNFx1MDQzRVx1MDQzMVx1MDQzMFx1MDQzMlx1MDQzQlx1MDQ0Rlx1MDQzNVx1MDQzQyBcdTA0MzIgXHUwNDNBXHUwNDREXHUwNDQ4XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZXh0cmFjdENsYXNzZXNGcm9tU3R5bGVzKHN0eWxlQ29udGVudCwgY2xhc3NNYXBwaW5nQ2FjaGUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gXHUwNDIzXHUwNDM0XHUwNDMwXHUwNDNCXHUwNDRGXHUwNDM1XHUwNDNDIHNjb3BlZCBcdTA0MzBcdTA0NDJcdTA0NDBcdTA0MzhcdTA0MzFcdTA0NDNcdTA0NDJcclxuICAgICAgICAgICAgY29uc3QgcHJvY2Vzc2VkU3R5bGVNYXRjaCA9IHN0eWxlTWF0Y2gucmVwbGFjZSgvc2NvcGVkL2csICcnKTtcclxuICAgICAgICAgICAgcHJvY2Vzc2VkQ29kZSA9IHByb2Nlc3NlZENvZGUucmVwbGFjZShzdHlsZU1hdGNoLCBwcm9jZXNzZWRTdHlsZU1hdGNoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gQ2FjaGUgc2l6ZSBhZnRlciBwcm9jZXNzaW5nOiAke2NsYXNzTWFwcGluZ0NhY2hlLnNpemV9YCk7XHJcbiAgICAgIHJldHVybiBwcm9jZXNzZWRDb2RlO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBWdWUgZmlsZTonLCBlcnJvcik7XHJcbiAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzVGVtcGxhdGUodGVtcGxhdGU6IHN0cmluZywgY2xhc3NNYXBwaW5nQ2FjaGU6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgcm9vdCA9IHBhcnNlKHRlbXBsYXRlKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1MDQxRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzMFx1MDQ0Mlx1MDQ0Qlx1MDQzMlx1MDQzMFx1MDQzNVx1MDQzQyBcdTA0MzJcdTA0NDFcdTA0MzUgXHUwNDREXHUwNDNCXHUwNDM1XHUwNDNDXHUwNDM1XHUwNDNEXHUwNDQyXHUwNDRCIFx1MDQ0MSBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0MzBcdTA0M0NcdTA0MzhcclxuICAgICAgY29uc3QgZWxlbWVudHMgPSByb290LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGNvbnN0IGNsYXNzQXR0ciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xyXG4gICAgICAgIGlmIChjbGFzc0F0dHIpIHtcclxuICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjbGFzc0F0dHIuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbik7XHJcbiAgICAgICAgICBjb25zdCBwcm9jZXNzZWRDbGFzc2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChjb25zdCBjbGFzc05hbWUgb2YgY2xhc3Nlcykge1xyXG4gICAgICAgICAgICBpZiAoIWNsYXNzTmFtZS5zdGFydHNXaXRoKCdkYXRhLXYtJykpIHtcclxuICAgICAgICAgICAgICBjb25zdCB1bm9DbGFzc2VzID0gY2xhc3NNYXBwaW5nQ2FjaGUuZ2V0KGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgaWYgKHVub0NsYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZENsYXNzZXMucHVzaCguLi51bm9DbGFzc2VzLnNwbGl0KCcgJykpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdTA0MUJcdTA0M0VcdTA0MzNcdTA0MzhcdTA0NDBcdTA0NDNcdTA0MzVcdTA0M0MgXHUwNDNGXHUwNDQwXHUwNDM1XHUwNDM0XHUwNDQzXHUwNDNGXHUwNDQwXHUwNDM1XHUwNDM2XHUwNDM0XHUwNDM1XHUwNDNEXHUwNDM4XHUwNDM1IFx1MDQzOCBcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzBcdTA0MzJcdTA0M0JcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxIFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0M0VcdTA0NDJcdTA0M0JcdTA0MzBcdTA0MzRcdTA0M0FcdTA0MzhcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgW3Z1ZS1wcm9jZXNzb3JdIFx1MDQxQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MSAnJHtjbGFzc05hbWV9JyBcdTA0M0RcdTA0MzUgXHUwNDNEXHUwNDMwXHUwNDM5XHUwNDM0XHUwNDM1XHUwNDNEIFx1MDQzMiBcdTA0M0NcdTA0MzBcdTA0M0ZcdTA0M0ZcdTA0MzhcdTA0M0RcdTA0MzNcdTA0MzUhYCk7XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRDbGFzc2VzLnB1c2goY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChwcm9jZXNzZWRDbGFzc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgcHJvY2Vzc2VkQ2xhc3Nlcy5qb2luKCcgJykpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1MDQyM1x1MDQzNFx1MDQzMFx1MDQzQlx1MDQ0Rlx1MDQzNVx1MDQzQyBkYXRhLXYgXHUwNDMwXHUwNDQyXHUwNDQwXHUwNDM4XHUwNDMxXHUwNDQzXHUwNDQyXHUwNDRCXHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlcztcclxuICAgICAgICBjb25zdCBkYXRhVkF0dHJzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICBpZiAoYXR0ci5zdGFydHNXaXRoKCdkYXRhLXYtJykpIHtcclxuICAgICAgICAgICAgZGF0YVZBdHRycy5wdXNoKGF0dHIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgZGF0YVZBdHRycykge1xyXG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gcm9vdC50b1N0cmluZygpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcGFyc2luZyBWdWUgdGVtcGxhdGU6JywgZXJyb3IpO1xyXG4gICAgICByZXR1cm4gdGVtcGxhdGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGV4dHJhY3RDbGFzc2VzRnJvbVN0eWxlcyhzdHlsZXM6IHN0cmluZywgY2xhc3NNYXBwaW5nQ2FjaGU6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFx1MDQxRlx1MDQzMFx1MDQ0MFx1MDQ0MVx1MDQzOFx1MDQzQyBDU1MgXHUwNDQxIFx1MDQzRlx1MDQzRVx1MDQzQ1x1MDQzRVx1MDQ0OVx1MDQ0Q1x1MDQ0RSBjc3MtdHJlZSBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDMxXHUwNDNFXHUwNDNCXHUwNDM1XHUwNDM1IFx1MDQ0Mlx1MDQzRVx1MDQ0N1x1MDQzRFx1MDQzRVx1MDQzM1x1MDQzRSBcdTA0MzhcdTA0MzdcdTA0MzJcdTA0M0JcdTA0MzVcdTA0NDdcdTA0MzVcdTA0M0RcdTA0MzhcdTA0NEYgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDNFXHUwNDMyXHJcbiAgICAgIGNvbnN0IGFzdCA9IHBhcnNlQ1NTKHN0eWxlcyk7XHJcbiAgICAgIFxyXG4gICAgICB3YWxrKGFzdCwge1xyXG4gICAgICAgIHZpc2l0OiAnUnVsZScsXHJcbiAgICAgICAgZW50ZXI6IGFzeW5jIChub2RlOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdSdWxlJykge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnByb2Nlc3NDU1NSdWxlKG5vZGUsIGNsYXNzTWFwcGluZ0NhY2hlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZXh0cmFjdGluZyBjbGFzc2VzIGZyb20gc3R5bGVzOicsIGVycm9yKTtcclxuICAgICAgLy8gRmFsbGJhY2sgXHUwNDNBIFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzQ1x1MDQ0MyBcdTA0M0ZcdTA0MzBcdTA0NDBcdTA0NDFcdTA0MzhcdTA0M0RcdTA0MzNcdTA0NDNcclxuICAgICAgYXdhaXQgdGhpcy5mYWxsYmFja0V4dHJhY3RDbGFzc2VzKHN0eWxlcywgY2xhc3NNYXBwaW5nQ2FjaGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzQ1NTUnVsZShydWxlOiBhbnksIGNsYXNzTWFwcGluZ0NhY2hlOiBNYXA8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBDU1NVdGlscy5leHRyYWN0U2VsZWN0b3JzKHJ1bGUucHJlbHVkZSk7XHJcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gQ1NTVXRpbHMuZXh0cmFjdFByb3BlcnRpZXMocnVsZS5ibG9jayk7XHJcblxyXG4gICAgaWYgKCFzZWxlY3RvcnMubGVuZ3RoIHx8ICFwcm9wZXJ0aWVzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcclxuICAgICAgY29uc3QgY2xhc3NOYW1lID0gQ1NTVXRpbHMuZXh0cmFjdENsYXNzTmFtZShzZWxlY3Rvcik7XHJcbiAgICAgIGlmIChjbGFzc05hbWUpIHtcclxuICAgICAgICAvLyBcdTA0MUZcdTA0NDBcdTA0M0VcdTA0M0ZcdTA0NDNcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzVcdTA0M0Mgc2NvcGVkIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QlxyXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5jbHVkZXMoJ2RhdGEtdi0nKSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHVub0NsYXNzZXMgPSBhd2FpdCB0aGlzLmNvbnZlcnRQcm9wZXJ0aWVzVG9Vbm9DbGFzc2VzKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIGlmICh1bm9DbGFzc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGNsYXNzTWFwcGluZ0NhY2hlLnNldChjbGFzc05hbWUsIHVub0NsYXNzZXMuam9pbignICcpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gTWFwcGVkICR7Y2xhc3NOYW1lfSAtPiAke3Vub0NsYXNzZXMuam9pbignICcpfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBjb252ZXJ0UHJvcGVydGllc1RvVW5vQ2xhc3Nlcyhwcm9wZXJ0aWVzOiBhbnlbXSk6IFByb21pc2U8c3RyaW5nW10+IHtcclxuICAgIGNvbnN0IHVub0NsYXNzZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcHJvcGVydGllcykge1xyXG4gICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5wcm9wZXJ0eTtcclxuICAgICAgY29uc3QgcHJvcGVydHlWYWx1ZSA9IENTU1V0aWxzLnByb3BlcnR5VmFsdWVUb1N0cmluZyhwcm9wZXJ0eS52YWx1ZSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCB1bm9DbGFzc0FyciA9IENTU1V0aWxzLmNvbnZlcnRQcm9wZXJ0eVRvVW5vQ2xhc3MocHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgaWYgKHVub0NsYXNzQXJyICYmIHVub0NsYXNzQXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB1bm9DbGFzc2VzLnB1c2goLi4udW5vQ2xhc3NBcnIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB1bm9DbGFzc2VzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBmYWxsYmFja0V4dHJhY3RDbGFzc2VzKHN0eWxlczogc3RyaW5nLCBjbGFzc01hcHBpbmdDYWNoZTogTWFwPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gXHUwNDFGXHUwNDQwXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDNFXHUwNDM5IFx1MDQzRlx1MDQzMFx1MDQ0MFx1MDQ0MVx1MDQzOFx1MDQzRFx1MDQzMyBDU1MgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQzOFx1MDQzN1x1MDQzMlx1MDQzQlx1MDQzNVx1MDQ0N1x1MDQzNVx1MDQzRFx1MDQzOFx1MDQ0RiBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0M0VcdTA0MzJcclxuICAgIGNvbnN0IGNsYXNzUmVnZXggPSAvXFwuKFthLXpBLVowLTlfLV0rKVxccypcXHsoW159XSspXFx9L2c7XHJcbiAgICBsZXQgbWF0Y2g7XHJcbiAgICBcclxuICAgIHdoaWxlICgobWF0Y2ggPSBjbGFzc1JlZ2V4LmV4ZWMoc3R5bGVzKSkgIT09IG51bGwpIHtcclxuICAgICAgY29uc3QgY2xhc3NOYW1lID0gbWF0Y2hbMV07XHJcbiAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBtYXRjaFsyXTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1MDQxRlx1MDQ0MFx1MDQzRVx1MDQzRlx1MDQ0M1x1MDQ0MVx1MDQzQVx1MDQzMFx1MDQzNVx1MDQzQyBzY29wZWQgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCXHJcbiAgICAgIGlmIChjbGFzc05hbWUuaW5jbHVkZXMoJ2RhdGEtdi0nKSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTA0MUFcdTA0M0VcdTA0M0RcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDJcdTA0MzhcdTA0NDBcdTA0NDNcdTA0MzVcdTA0M0MgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDM5XHUwNDQxXHUwNDQyXHUwNDMyXHUwNDMwIFx1MDQzMiBVbm9DU1MgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCXHJcbiAgICAgIGNvbnN0IHVub0NsYXNzZXMgPSBhd2FpdCB0aGlzLmNvbnZlcnRQcm9wZXJ0aWVzU3RyaW5nVG9Vbm9DbGFzc2VzKHByb3BlcnRpZXMpO1xyXG4gICAgICBpZiAodW5vQ2xhc3Nlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY2xhc3NNYXBwaW5nQ2FjaGUuc2V0KGNsYXNzTmFtZSwgdW5vQ2xhc3Nlcy5qb2luKCcgJykpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbdnVlLXByb2Nlc3Nvcl0gTWFwcGVkICR7Y2xhc3NOYW1lfSAtPiAke3Vub0NsYXNzZXMuam9pbignICcpfWApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGNvbnZlcnRQcm9wZXJ0aWVzU3RyaW5nVG9Vbm9DbGFzc2VzKHByb3BlcnRpZXM6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcclxuICAgIGNvbnN0IHVub0NsYXNzZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIC8vIFx1MDQxRlx1MDQzMFx1MDQ0MFx1MDQ0MVx1MDQzOFx1MDQzQyBDU1MgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDM5XHUwNDQxXHUwNDQyXHUwNDMyXHUwNDMwXHJcbiAgICBjb25zdCBwcm9wZXJ0eVJlZ2V4ID0gLyhbXjpdKyk6XFxzKihbXjtdKyk7L2c7XHJcbiAgICBsZXQgbWF0Y2g7XHJcbiAgICBcclxuICAgIHdoaWxlICgobWF0Y2ggPSBwcm9wZXJ0eVJlZ2V4LmV4ZWMocHJvcGVydGllcykpICE9PSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0gbWF0Y2hbMV0udHJpbSgpO1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IG1hdGNoWzJdLnRyaW0oKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHVub0NsYXNzQXJyID0gQ1NTVXRpbHMuY29udmVydFByb3BlcnR5VG9Vbm9DbGFzcyhwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gICAgICBpZiAodW5vQ2xhc3NBcnIgJiYgdW5vQ2xhc3NBcnIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHVub0NsYXNzZXMucHVzaCguLi51bm9DbGFzc0Fycik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHVub0NsYXNzZXM7XHJcbiAgfVxyXG59ICIsICJpbXBvcnQgeyBwYXJzZSB9IGZyb20gJ25vZGUtaHRtbC1wYXJzZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhUTUxQcm9jZXNzb3Ige1xyXG4gIGFzeW5jIHByb2Nlc3MoY29kZTogc3RyaW5nLCBpZDogc3RyaW5nLCBjbGFzc01hcHBpbmdDYWNoZTogTWFwPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBcdTA0MTVcdTA0NDFcdTA0M0JcdTA0MzggXHUwNDREXHUwNDQyXHUwNDNFIEhUTUwgXHUwNDQ0XHUwNDMwXHUwNDM5XHUwNDNCLCBcdTA0M0VcdTA0MzFcdTA0NDBcdTA0MzBcdTA0MzFcdTA0MzBcdTA0NDJcdTA0NEJcdTA0MzJcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDM1XHUwNDMzXHUwNDNFIFx1MDQzRFx1MDQzMFx1MDQzRlx1MDQ0MFx1MDQ0Rlx1MDQzQ1x1MDQ0M1x1MDQ0RVxyXG4gICAgICBpZiAoaWQuZW5kc1dpdGgoJy5odG1sJykpIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm9jZXNzSFRNTChjb2RlLCBjbGFzc01hcHBpbmdDYWNoZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1MDQxOFx1MDQ0OVx1MDQzNVx1MDQzQyBIVE1MIFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzRVx1MDQzQVx1MDQzOCBcdTA0MzIgSlMvVFMgXHUwNDNBXHUwNDNFXHUwNDM0XHUwNDM1XHJcbiAgICAgIGNvbnN0IGh0bWxNYXRjaGVzID0gY29kZS5tYXRjaCgvYChbXmBdKjxbXmBdKj5bXmBdKilgL2cpIHx8IFtdO1xyXG4gICAgICBcclxuICAgICAgbGV0IHByb2Nlc3NlZENvZGUgPSBjb2RlO1xyXG4gICAgICBcclxuICAgICAgZm9yIChjb25zdCBodG1sTWF0Y2ggb2YgaHRtbE1hdGNoZXMpIHtcclxuICAgICAgICBjb25zdCBodG1sQ29udGVudCA9IGh0bWxNYXRjaC5zbGljZSgxLCAtMSk7IC8vIFx1MDQyM1x1MDQzMVx1MDQzOFx1MDQ0MFx1MDQzMFx1MDQzNVx1MDQzQyBiYWNrdGlja3NcclxuICAgICAgICBjb25zdCBwcm9jZXNzZWRIVE1MID0gYXdhaXQgdGhpcy5wcm9jZXNzSFRNTChodG1sQ29udGVudCwgY2xhc3NNYXBwaW5nQ2FjaGUpO1xyXG4gICAgICAgIHByb2Nlc3NlZENvZGUgPSBwcm9jZXNzZWRDb2RlLnJlcGxhY2UoaHRtbE1hdGNoLCBgXFxgJHtwcm9jZXNzZWRIVE1MfVxcYGApO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTA0MjJcdTA0MzBcdTA0M0FcdTA0MzZcdTA0MzUgXHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzRVx1MDQzMVx1MDQ0Qlx1MDQ0N1x1MDQzRFx1MDQ0Qlx1MDQzNSBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0M0VcdTA0M0FcdTA0MzggXHUwNDQxIEhUTUxcclxuICAgICAgY29uc3Qgc3RyaW5nTWF0Y2hlcyA9IGNvZGUubWF0Y2goL1wiKFteXCJdKjxbXlwiXSo+W15cIl0qKVwiL2cpIHx8IFtdO1xyXG4gICAgICBcclxuICAgICAgZm9yIChjb25zdCBzdHJpbmdNYXRjaCBvZiBzdHJpbmdNYXRjaGVzKSB7XHJcbiAgICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSBzdHJpbmdNYXRjaC5zbGljZSgxLCAtMSk7IC8vIFx1MDQyM1x1MDQzMVx1MDQzOFx1MDQ0MFx1MDQzMFx1MDQzNVx1MDQzQyBcdTA0M0FcdTA0MzBcdTA0MzJcdTA0NEJcdTA0NDdcdTA0M0FcdTA0MzhcclxuICAgICAgICBjb25zdCBwcm9jZXNzZWRIVE1MID0gYXdhaXQgdGhpcy5wcm9jZXNzSFRNTChodG1sQ29udGVudCwgY2xhc3NNYXBwaW5nQ2FjaGUpO1xyXG4gICAgICAgIHByb2Nlc3NlZENvZGUgPSBwcm9jZXNzZWRDb2RlLnJlcGxhY2Uoc3RyaW5nTWF0Y2gsIGBcIiR7cHJvY2Vzc2VkSFRNTH1cImApO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gcHJvY2Vzc2VkQ29kZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgSFRNTCBpbiBKUy9UUyBmaWxlOicsIGVycm9yKTtcclxuICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NIVE1MKGh0bWw6IHN0cmluZywgY2xhc3NNYXBwaW5nQ2FjaGU6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwpO1xyXG4gICAgICBcclxuICAgICAgLy8gXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNSBcdTA0NERcdTA0M0JcdTA0MzVcdTA0M0NcdTA0MzVcdTA0M0RcdTA0NDJcdTA0NEIgXHUwNDQxIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQzMFx1MDQzQ1x1MDQzOFxyXG4gICAgICBjb25zdCBlbGVtZW50cyA9IHJvb3QucXVlcnlTZWxlY3RvckFsbCgnKicpO1xyXG4gICAgICBcclxuICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgICAgY29uc3QgY2xhc3NBdHRyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcbiAgICAgICAgaWYgKGNsYXNzQXR0cikge1xyXG4gICAgICAgICAgY29uc3QgY2xhc3NlcyA9IGNsYXNzQXR0ci5zcGxpdCgnICcpLmZpbHRlcihCb29sZWFuKTtcclxuICAgICAgICAgIGNvbnN0IHByb2Nlc3NlZENsYXNzZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGZvciAoY29uc3QgY2xhc3NOYW1lIG9mIGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgdW5vQ2xhc3NlcyA9IGNsYXNzTWFwcGluZ0NhY2hlLmdldChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBpZiAodW5vQ2xhc3Nlcykge1xyXG4gICAgICAgICAgICAgIHByb2Nlc3NlZENsYXNzZXMucHVzaCguLi51bm9DbGFzc2VzLnNwbGl0KCcgJykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHByb2Nlc3NlZENsYXNzZXMucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmIChwcm9jZXNzZWRDbGFzc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgcHJvY2Vzc2VkQ2xhc3Nlcy5qb2luKCcgJykpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHJvb3QudG9TdHJpbmcoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHBhcnNpbmcgSFRNTDonLCBlcnJvcik7XHJcbiAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQ1NTTGluayhodG1sOiBzdHJpbmcsIGNzc0ZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwpO1xyXG4gICAgICBjb25zdCBoZWFkID0gcm9vdC5xdWVyeVNlbGVjdG9yKCdoZWFkJyk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoaGVhZCkge1xyXG4gICAgICAgIC8vIFx1MDQyM1x1MDQzNFx1MDQzMFx1MDQzQlx1MDQ0Rlx1MDQzNVx1MDQzQyBcdTA0NDFcdTA0NDFcdTA0NEJcdTA0M0JcdTA0M0FcdTA0MzggXHUwNDNEXHUwNDMwIFx1MDQzOFx1MDQ0MVx1MDQ0NVx1MDQzRVx1MDQzNFx1MDQzRFx1MDQ0Qlx1MDQzNSBDU1MgXHUwNDQ0XHUwNDMwXHUwNDM5XHUwNDNCXHUwNDRCXHJcbiAgICAgICAgY29uc3QgY3NzTGlua3MgPSBoZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbGluayBvZiBjc3NMaW5rcykge1xyXG4gICAgICAgICAgY29uc3QgaHJlZiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcbiAgICAgICAgICBpZiAoaHJlZiAmJiAoaHJlZi5pbmNsdWRlcygnLmNzcycpIHx8IGhyZWYuaW5jbHVkZXMoJ3N0eWxlLmNzcycpKSkge1xyXG4gICAgICAgICAgICBsaW5rLnJlbW92ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTA0MUZcdTA0NDBcdTA0M0VcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NEZcdTA0MzVcdTA0M0MsIFx1MDQzNVx1MDQ0MVx1MDQ0Mlx1MDQ0QyBcdTA0M0JcdTA0MzggXHUwNDQzXHUwNDM2XHUwNDM1IFx1MDQ0MVx1MDQ0MVx1MDQ0Qlx1MDQzQlx1MDQzQVx1MDQzMCBcdTA0M0RcdTA0MzAgXHUwNDREXHUwNDQyXHUwNDNFXHUwNDQyIENTUyBcdTA0NDRcdTA0MzBcdTA0MzlcdTA0M0JcclxuICAgICAgICBjb25zdCBleGlzdGluZ0xpbmsgPSBoZWFkLnF1ZXJ5U2VsZWN0b3IoYGxpbmtbaHJlZj1cIiR7Y3NzRmlsZU5hbWV9XCJdYCk7XHJcbiAgICAgICAgaWYgKCFleGlzdGluZ0xpbmspIHtcclxuICAgICAgICAgIGNvbnN0IGxpbmtFbGVtZW50ID0gcGFyc2UoYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJHtjc3NGaWxlTmFtZX1cIj5gKTtcclxuICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGlua0VsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHJvb3QudG9TdHJpbmcoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFkZGluZyBDU1MgbGluazonLCBlcnJvcik7XHJcbiAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG4gIH1cclxufSAiLCAiaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgVW5vQ1NTUGx1Z2luIH0gZnJvbSAnLi9wbHVnaW4nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdW5vY3NzQ1NTUGx1Z2luKG9wdGlvbnM/OiB7XHJcbiAgcHJlc2V0cz86IGFueVtdO1xyXG4gIHRoZW1lPzogYW55O1xyXG4gIHNob3J0Y3V0cz86IGFueTtcclxuICBydWxlcz86IGFueVtdO1xyXG59KTogUGx1Z2luIHtcclxuICByZXR1cm4gVW5vQ1NTUGx1Z2luKG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgeyBVbm9DU1NQbHVnaW4gfTsgIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVyxTQUFTLG9CQUFvQjtBQUNoWSxPQUFPLFNBQVM7OztBQ0VhLE9BQUEsUUFBQTtBQUU3QixPQUFPLFVBQVU7OztBQ0xzQixTQUFBLFlBQUE7OztBQytKakMsSUFBTyxXQUFQLE1BQWU7Ozs7RUFJbkIsT0FBTywwQkFBMEIsVUFBa0IsT0FBYTtBQUM5RCxVQUFNLGVBQWUsTUFBTSxLQUFJO0FBRy9CLFFBQUksYUFBYSxXQUFXO0FBQzFCLFlBQU0sYUFBcUM7UUFDekMsUUFBUTtRQUNSLFFBQVE7UUFDUixTQUFTO1FBQ1QsVUFBVTtRQUNWLGdCQUFnQjtRQUNoQixRQUFROztBQUVWLFlBQU0sV0FBVyxXQUFXLFlBQVk7QUFDeEMsYUFBTyxXQUFXLENBQUMsUUFBUSxJQUFJO0lBQ2pDO0FBR0EsUUFBSSxhQUFhLFlBQVk7QUFDM0IsWUFBTSxjQUFzQztRQUMxQyxZQUFZO1FBQ1osWUFBWTtRQUNaLFNBQVM7UUFDVCxVQUFVO1FBQ1YsVUFBVTs7QUFFWixZQUFNLFdBQVcsWUFBWSxZQUFZO0FBQ3pDLGFBQU8sV0FBVyxDQUFDLFFBQVEsSUFBSTtJQUNqQztBQUdBLFFBQUksYUFBYSxvQkFBb0I7QUFDbkMsVUFBSSxhQUFhLFdBQVcsTUFBTSxHQUFHO0FBQ25DLGVBQU8sQ0FBQyxPQUFPLFlBQVksR0FBRztNQUNoQyxXQUFXLGFBQWEsV0FBVyxNQUFNLEdBQUc7QUFDMUMsZUFBTyxDQUFDLFdBQVcsWUFBWSxJQUFJO01BQ3JDLE9BQU87QUFDTCxlQUFPLENBQUMsT0FBTyxZQUFZLEdBQUc7TUFDaEM7SUFDRjtBQUdBLFFBQUksYUFBYSxvQkFBb0I7QUFDbkMsVUFBSSxvQkFBb0IsS0FBSyxZQUFZO0FBQUcsZUFBTyxDQUFDLE9BQU8sWUFBWSxHQUFHO0FBQzFFLFVBQUksZUFBZSxLQUFLLFlBQVk7QUFBRyxlQUFPLENBQUMsT0FB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VUFBSTtBQUNGLGNBQU0sUUFBUSxNQUFNLEdBQUcsUUFBUSxTQUFTO0FBQ3hDLG1CQUFXLFFBQVEsT0FBTztBQUN4QixjQUFJLEtBQUssU0FBUyxLQUFLLEdBQUc7QUFDeEIsa0JBQU0sVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLEtBQUssV0FBVyxJQUFJLEdBQUcsTUFBTTtBQUNwRSxrQkFBTSxhQUFhO0FBQ25CLGdCQUFJO0FBQ0osbUJBQVEsUUFBUSxXQUFXLEtBQUssT0FBTyxHQUFJO0FBQ3pDLG9CQUFNLENBQUMsRUFBRSxNQUFNLEtBQUssRUFBRSxRQUFRLFNBQU07QUFDbEMsc0JBQU0sYUFBYSx3QkFBd0IsR0FBRztBQUM5QyxvQkFBSSxXQUFXLFVBQVU7QUFBRyw4QkFBWSxJQUFJLFVBQVU7Y0FDeEQsQ0FBQztZQUNIO1VBQ0Y7UUFDRjtNQUNGLFNBQVMsR0FBRztNQUVaO0FBQ0EsWUFBTSxnQkFBZ0IsTUFBTSxLQUFLLFdBQVc7QUFDNUMsWUFBTSxNQUFNLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxXQUFXLG1CQUFtQixXQUFXLEVBQUMsQ0FBRTtBQUNwRixZQUFNLEVBQUUsSUFBRyxJQUFLLE1BQU0sSUFBSSxTQUFTLGNBQWMsS0FBSyxHQUFHLENBQUM7QUFFMUQsWUFBTSxTQUFTLEtBQUssUUFBUSxrQ0FBVyw4Q0FBOEM7QUFDckYsVUFBSTtBQUNGLGNBQU0sR0FBRyxNQUFNLEtBQUssUUFBUSxNQUFNLEdBQUcsRUFBRSxXQUFXLEtBQUksQ0FBRTtBQUN4RCxjQUFNLEdBQUcsVUFBVSxRQUFRLEtBQUssTUFBTTtBQUN0QyxnQkFBUSxJQUFJLDJDQUEyQyxNQUFNO01BQy9ELFNBQVMsR0FBRztBQUNWLGdCQUFRLE1BQU0saURBQWlELENBQUM7TUFDbEU7QUFFQSxVQUFJLE1BQU0sS0FBSyxTQUFRO0FBQ3ZCLFlBQU0sSUFBSSxRQUFRLDRDQUE0QyxFQUFFO0FBQ2hFLFlBQU0sSUFBSSxRQUFRLGFBQWEsOERBQThEO0FBQzdGLGFBQU87SUFDVDs7O0FBR0o7OztBS3BOYyxTQUFQLGdCQUFpQyxTQUt2QztBQUNDLFNBQU8sYUFBYSxPQUFPO0FBQzdCOzs7QU5OQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixnQkFBZ0I7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxFQUNYO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsid2FsayIsICJ3YWxrIiwgInBhcnNlIiwgInBhcnNlIiwgInVubyJdCn0K
