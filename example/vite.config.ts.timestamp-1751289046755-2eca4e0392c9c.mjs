// vite.config.ts
import { defineConfig } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/example/node_modules/vite/dist/node/index.js";
import vue from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/example/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// ../dist/full-processor.js
import postcss from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/postcss/lib/postcss.mjs";
import * as cheerio from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/cheerio/dist/esm/index.js";
import { parse as parseVue } from "file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";

// ../dist/utils.js
var UNO_PROPERTY_MAP = {
  // Цветовые
  "background-color": "bg-color",
  "color": "color",
  "border-color": "border",
  "outline-color": "outline",
  "text-decoration-color": "decoration",
  "column-rule-color": "column-rule",
  "caret-color": "caret",
  "fill": "fill",
  "stroke": "stroke",
  "accent-color": "accent",
  "border-top-color": "border-t",
  "border-right-color": "border-r",
  "border-bottom-color": "border-b",
  "border-left-color": "border-l",
  // Размеры
  "width": "w",
  "min-width": "min-w",
  "max-width": "max-w",
  "height": "h",
  "min-height": "min-h",
  "max-height": "max-h",
  // Отступы
  "margin": "m",
  "margin-top": "mt",
  "margin-right": "mr",
  "margin-bottom": "mb",
  "margin-left": "ml",
  "padding": "p",
  "padding-top": "pt",
  "padding-right": "pr",
  "padding-bottom": "pb",
  "padding-left": "pl",
  // Flex/Grid
  "display": "",
  // handled separately
  "flex-direction": "flex",
  "flex-wrap": "flex",
  "flex-grow": "grow",
  "flex-shrink": "shrink",
  "flex-basis": "basis",
  "justify-content": "justify",
  "align-items": "items",
  "align-self": "self",
  "align-content": "content",
  "order": "order",
  "gap": "gap",
  "row-gap": "row-gap",
  "column-gap": "col-gap",
  // Grid
  "grid-template-columns": "grid-cols",
  "grid-template-rows": "grid-rows",
  "grid-column": "col",
  "grid-row": "row",
  "grid-auto-flow": "grid-flow",
  // Border
  "border-radius": "rounded",
  "border-width": "border",
  "border-style": "border",
  // Текст
  "font-size": "text",
  "font-weight": "font",
  "font-family": "font",
  "line-height": "leading",
  "letter-spacing": "tracking",
  "text-align": "text",
  "text-transform": "uppercase",
  "vertical-align": "align",
  // Прочее
  "opacity": "opacity",
  "box-shadow": "shadow",
  "z-index": "z",
  "overflow": "overflow",
  "overflow-x": "overflow-x",
  "overflow-y": "overflow-y",
  "object-fit": "object",
  "object-position": "object",
  "background-image": "bg-image",
  "background-position": "bg",
  "background-size": "bg",
  "background-repeat": "bg",
  "background-clip": "bg",
  "background-attachment": "bg",
  "cursor": "cursor",
  "user-select": "select",
  "pointer-events": "pointer-events",
  "transition": "transition",
  "transition-property": "transition",
  "transition-duration": "duration",
  "transition-timing-function": "ease",
  "transition-delay": "delay",
  "animation": "animate",
  "animation-name": "animate",
  "animation-duration": "duration",
  "animation-timing-function": "ease",
  "animation-delay": "delay",
  "animation-iteration-count": "repeat",
  "animation-direction": "direction",
  "animation-fill-mode": "fill-mode",
  "animation-play-state": "play",
  "isolation": "isolate",
  "position": "",
  // handled separately
  "top": "top",
  "right": "right",
  "bottom": "bottom",
  "left": "left",
  "visibility": "visible",
  "float": "float",
  "clear": "clear",
  "resize": "resize",
  "list-style-type": "list",
  "list-style-position": "list",
  "appearance": "appearance",
  "outline": "outline",
  "outline-width": "outline",
  "outline-style": "outline",
  "outline-offset": "outline-offset",
  "filter": "filter",
  "backdrop-filter": "backdrop",
  "mix-blend-mode": "blend",
  "background-blend-mode": "bg-blend",
  "box-sizing": "box",
  "content-visibility": "content",
  "aspect-ratio": "aspect",
  "writing-mode": "writing",
  "white-space": "whitespace",
  "word-break": "break",
  "overflow-wrap": "break",
  "text-overflow": "text-ellipsis",
  "text-decoration": "underline",
  "text-decoration-style": "decoration",
  "text-decoration-thickness": "decoration",
  "text-underline-offset": "underline-offset",
  "text-indent": "indent",
  "tab-size": "tab",
  "caret-shape": "caret",
  "stroke-width": "stroke",
  "stroke-dasharray": "stroke",
  "stroke-dashoffset": "stroke",
  "fill-opacity": "fill",
  "stroke-opacity": "stroke",
  "backface-visibility": "backface",
  "perspective": "perspective",
  "perspective-origin": "perspective",
  "transform": "transform",
  "transform-origin": "origin",
  "scale": "scale",
  "rotate": "rotate",
  "translate": "translate",
  "skew": "skew"
};
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
        return [`bg-image-[${trimmedValue}]`];
      } else if (trimmedValue.startsWith("http")) {
        return [`bg-image-[url(${trimmedValue})]`];
      } else {
        return [`bg-image-[${trimmedValue}]`];
      }
    }
    if (property === "background-color") {
      if (trimmedValue.startsWith("#")) {
        return [`bg-color-[${trimmedValue}]`];
      }
      if (trimmedValue.startsWith("rgb") || trimmedValue.startsWith("hsl")) {
        return [`bg-color-[${trimmedValue}]`];
      }
      const namedColors = {
        "red": "red-500",
        "green": "green-500",
        "blue": "blue-500",
        "black": "black",
        "white": "white",
        "gray": "gray-500",
        "yellow": "yellow-500",
        "orange": "orange-500",
        "purple": "purple-500",
        "pink": "pink-500"
      };
      const colorClass = namedColors[trimmedValue];
      if (colorClass) {
        return [`bg-${colorClass}`];
      }
      return [`bg-color-[${trimmedValue}]`];
    }
    if (property === "color") {
      if (trimmedValue.startsWith("#")) {
        return [`color-[${trimmedValue}]`];
      }
      if (trimmedValue.startsWith("rgb") || trimmedValue.startsWith("hsl")) {
        return [`color-[${trimmedValue}]`];
      }
      const namedColors = {
        "red": "red-500",
        "green": "green-500",
        "blue": "blue-500",
        "black": "black",
        "white": "white",
        "gray": "gray-500",
        "yellow": "yellow-500",
        "orange": "orange-500",
        "purple": "purple-500",
        "pink": "pink-500"
      };
      const colorClass = namedColors[trimmedValue];
      if (colorClass) {
        return [`color-${colorClass}`];
      }
      return [`color-[${trimmedValue}]`];
    }
    if (property === "margin" || property === "padding") {
      return this.processShorthandProperty(property, trimmedValue);
    }
    if (property === "border") {
      return this.processBorderShorthand(trimmedValue);
    }
    if (property === "background") {
      return this.processBackgroundShorthand(trimmedValue);
    }
    const unoPrefix = UNO_PROPERTY_MAP[property];
    if (unoPrefix) {
      if (unoPrefix === "")
        return null;
      return [`${unoPrefix}-${trimmedValue}`];
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
      if (/^-?\d+(px|rem|em|%)$/.test(val))
        return val;
      if (/^-?\d+$/.test(val))
        return val;
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
   * Обрабатывает сокращённое свойство border
   */
  static processBorderShorthand(value) {
    const parts = value.split(/\s+/);
    const unoClasses = [];
    for (const part of parts) {
      if (/^\d+px$/.test(part)) {
        unoClasses.push(`border-${part.replace("px", "")}`);
      } else if (["solid", "dashed", "dotted", "double", "none"].includes(part)) {
        unoClasses.push(`border-${part}`);
      } else if (part.startsWith("#")) {
        unoClasses.push(`border-[${part}]`);
      } else if (part.startsWith("rgb") || part.startsWith("hsl")) {
        unoClasses.push(`border-[${part}]`);
      }
    }
    return unoClasses;
  }
  /**
   * Обрабатывает сокращённое свойство background
   */
  static processBackgroundShorthand(value) {
    const unoClasses = [];
    const parts = value.split(/\s+/);
    for (const part of parts) {
      if (part.startsWith("url(")) {
        unoClasses.push(`bg-[${part}]`);
      } else if (part.startsWith("#") || part.startsWith("rgb") || part.startsWith("hsl")) {
        unoClasses.push(`bg-[${part}]`);
      } else if (["no-repeat", "repeat", "repeat-x", "repeat-y"].includes(part)) {
        unoClasses.push(`bg-${part.replace("-", "")}`);
      } else if (["center", "top", "bottom", "left", "right"].includes(part)) {
        unoClasses.push(`bg-${part}`);
      }
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

// ../dist/full-processor.js
async function processHtmlAndCssStrings(htmlRaw, cssRaw) {
  const root = postcss.parse(cssRaw);
  const classMap = {};
  root.walkRules((rule) => {
    const classNames = Array.from(rule.selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
    if (classNames.length === 0)
      return;
    const unoClasses = [];
    rule.walkDecls((decl) => {
      const uno2 = CSSUtils.convertPropertyToUnoClass(decl.prop, decl.value);
      if (uno2)
        unoClasses.push(...uno2);
    });
    for (const className of classNames) {
      if (!classMap[className])
        classMap[className] = [];
      classMap[className].push(...unoClasses);
    }
  });
  const $ = cheerio.load(htmlRaw);
  const usedClasses = /* @__PURE__ */ new Set();
  $("[class]").each((_, el) => {
    const orig = $(el).attr("class");
    orig.split(/\s+/).forEach((cls) => usedClasses.add(cls));
    const uno2 = orig.split(/\s+/).flatMap((cls) => classMap[cls] || cls);
    $(el).attr("class", uno2.join(" "));
  });
  const htmlOut = $.html();
  const { createGenerator } = await import("file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/core/dist/index.mjs");
  const { default: presetUno } = await import("file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/preset-uno/dist/index.mjs");
  const { default: presetAttributify } = await import("file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/preset-attributify/dist/index.mjs");
  const { default: presetIcons } = await import("file:///mnt/c/Users/exuqer/Projects/vite-plugin-unocss-css/node_modules/@unocss/preset-icons/dist/index.mjs");
  const uno = createGenerator({ presets: [presetUno, presetAttributify, presetIcons] });
  const allUnoClasses = [
    ...Object.values(classMap).flat(),
    ...Array.from(usedClasses).filter((cls) => !(cls in classMap))
  ];
  const { css } = await uno.generate(allUnoClasses.join(" "));
  return { html: htmlOut, css };
}

// ../dist/plugin.js
function isAsset(file) {
  return !!file && typeof file === "object" && file.type === "asset";
}
function UnoCSSPlugin(options = {}) {
  const base = {
    name: "vite-plugin-unocss-css",
    enforce: "post",
    apply: "build"
  };
  let unoCssHtml = "";
  let unoCssRaw = "";
  return {
    ...base,
    async generateBundle(_options, bundle) {
      let htmlAsset = null;
      let cssAsset = null;
      let htmlFileName = "";
      for (const [fileName, file] of Object.entries(bundle)) {
        if (isAsset(file) && fileName.endsWith(".html")) {
          htmlAsset = file;
          htmlFileName = fileName;
        }
        if (isAsset(file) && fileName.endsWith(".css") && fileName !== "unocss-generated.css") {
          cssAsset = file;
        }
      }
      if (htmlAsset && cssAsset) {
        const htmlRaw = htmlAsset.source?.toString() || "";
        const cssRaw = cssAsset.source?.toString() || "";
        const { html, css } = await processHtmlAndCssStrings(htmlRaw, cssRaw);
        unoCssHtml = html;
        unoCssRaw = css;
        bundle["unocss-generated.css"] = {
          type: "asset",
          fileName: "unocss-generated.css",
          source: css
        };
        if (htmlFileName && bundle[htmlFileName]) {
          bundle[htmlFileName].source = html;
        }
        for (const fileName of Object.keys(bundle)) {
          if (fileName.endsWith(".css") && fileName !== "unocss-generated.css") {
            delete bundle[fileName];
          }
        }
      }
    },
    async transformIndexHtml(html) {
      if (unoCssHtml)
        return unoCssHtml;
      return html;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiLi4vc3JjL2Z1bGwtcHJvY2Vzc29yLnRzIiwgIi4uL3NyYy91dGlscy50cyIsICIuLi9zcmMvcGx1Z2luLnRzIiwgIi4uL3NyYy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9tbnQvYy9Vc2Vycy9leHVxZXIvUHJvamVjdHMvdml0ZS1wbHVnaW4tdW5vY3NzLWNzcy9leGFtcGxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L2MvVXNlcnMvZXh1cWVyL1Byb2plY3RzL3ZpdGUtcGx1Z2luLXVub2Nzcy1jc3MvZXhhbXBsZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2MvVXNlcnMvZXh1cWVyL1Byb2plY3RzL3ZpdGUtcGx1Z2luLXVub2Nzcy1jc3MvZXhhbXBsZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCB1bm9jc3NDU1NQbHVnaW4gZnJvbSAnLi4vZGlzdC9pbmRleC5tanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHVub2Nzc0NTU1BsdWdpbigpLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogJ2Rpc3QtZXhhbXBsZSdcclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgbW9kdWxlczogZmFsc2VcclxuICB9XHJcbn0pOyAiLCAiaW1wb3J0IHBvc3Rjc3MgZnJvbSAncG9zdGNzcyc7XHJcbmltcG9ydCAqIGFzIGNoZWVyaW8gZnJvbSAnY2hlZXJpbyc7XHJcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBwYXJzZSBhcyBwYXJzZVZ1ZSB9IGZyb20gJ0B2dWUvY29tcGlsZXItc2ZjJztcclxuaW1wb3J0IHsgQ1NTVXRpbHMgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbi8vIFx1MDQxRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzQVx1MDQzMCAudnVlLVx1MDQ0NFx1MDQzMFx1MDQzOVx1MDQzQlx1MDQzMDogXHUwNDMyXHUwNDNFXHUwNDM3XHUwNDMyXHUwNDQwXHUwNDMwXHUwNDQ5XHUwNDMwXHUwNDM1XHUwNDQyIHsgaHRtbCwgdW5vQ2xhc3NlcyB9XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9jZXNzVnVlRmlsZSh2dWVQYXRoOiBzdHJpbmcpIHtcclxuICBjb25zdCBzcmMgPSBhd2FpdCBmcy5yZWFkRmlsZSh2dWVQYXRoLCAndXRmLTgnKTtcclxuICBjb25zdCB7IGRlc2NyaXB0b3IgfSA9IHBhcnNlVnVlKHNyYyk7XHJcbiAgY29uc3QgdGVtcGxhdGUgPSBkZXNjcmlwdG9yLnRlbXBsYXRlPy5jb250ZW50IHx8ICcnO1xyXG4gIGNvbnN0IHN0eWxlcyA9IGRlc2NyaXB0b3Iuc3R5bGVzLm1hcCgoczogYW55KSA9PiBzLmNvbnRlbnQpLmpvaW4oJ1xcbicpO1xyXG5cclxuICAvLyAxLiBcdTA0MUZcdTA0MzBcdTA0NDBcdTA0NDFcdTA0MzhcdTA0M0MgXHUwNDQxXHUwNDQyXHUwNDM4XHUwNDNCXHUwNDM4LCBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0M0VcdTA0MzhcdTA0M0MgXHUwNDNDXHUwNDMwXHUwNDNGXHUwNDNGXHUwNDM4XHUwNDNEXHUwNDMzIFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0MzJcdTA0NDFcdTA0MzVcdTA0NDUgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDNFXHUwNDMyIFx1MDQzOFx1MDQzNyBcdTA0MzJcdTA0NDFcdTA0MzVcdTA0NDUgXHUwNDQxXHUwNDM1XHUwNDNCXHUwNDM1XHUwNDNBXHUwNDQyXHUwNDNFXHUwNDQwXHUwNDNFXHUwNDMyXHJcbiAgY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2Uoc3R5bGVzKTtcclxuICBjb25zdCBjbGFzc01hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge307XHJcbiAgcm9vdC53YWxrUnVsZXMoKHJ1bGU6IGFueSkgPT4ge1xyXG4gICAgLy8gXHUwNDE4XHUwNDM3XHUwNDMyXHUwNDNCXHUwNDM1XHUwNDNBXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNSBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0NEIgXHUwNDM4XHUwNDM3IFx1MDQ0MVx1MDQzNVx1MDQzQlx1MDQzNVx1MDQzQVx1MDQ0Mlx1MDQzRVx1MDQ0MFx1MDQzMCAoXHUwNDMyXHUwNDNBXHUwNDNCXHUwNDRFXHUwNDQ3XHUwNDMwXHUwNDRGIFx1MDQ0MVx1MDQzQlx1MDQzRVx1MDQzNlx1MDQzRFx1MDQ0Qlx1MDQzNSlcclxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBBcnJheS5mcm9tKHJ1bGUuc2VsZWN0b3IubWF0Y2hBbGwoL1xcLihbYS16QS1aMC05Xy1dKykvZykpLm1hcCgobTogYW55KSA9PiBtWzFdKTtcclxuICAgIGlmIChjbGFzc05hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgY29uc3QgdW5vQ2xhc3Nlczogc3RyaW5nW10gPSBbXTtcclxuICAgIHJ1bGUud2Fsa0RlY2xzKChkZWNsOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdW5vID0gQ1NTVXRpbHMuY29udmVydFByb3BlcnR5VG9Vbm9DbGFzcyhkZWNsLnByb3AsIGRlY2wudmFsdWUpO1xyXG4gICAgICBpZiAodW5vKSB1bm9DbGFzc2VzLnB1c2goLi4udW5vKTtcclxuICAgIH0pO1xyXG4gICAgZm9yIChjb25zdCBjbGFzc05hbWUgb2YgY2xhc3NOYW1lcykge1xyXG4gICAgICBpZiAoIWNsYXNzTWFwW2NsYXNzTmFtZV0pIGNsYXNzTWFwW2NsYXNzTmFtZV0gPSBbXTtcclxuICAgICAgY2xhc3NNYXBbY2xhc3NOYW1lXS5wdXNoKC4uLnVub0NsYXNzZXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyAyLiBcdTA0MTdcdTA0MzBcdTA0M0NcdTA0MzVcdTA0M0RcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCIFx1MDQzMiBcdTA0NDhcdTA0MzBcdTA0MzFcdTA0M0JcdTA0M0VcdTA0M0RcdTA0MzVcclxuICBjb25zdCAkID0gY2hlZXJpby5sb2FkKHRlbXBsYXRlLCB7IHhtbE1vZGU6IGZhbHNlIH0pO1xyXG4gICQoJ1tjbGFzc10nKS5lYWNoKChfOiBhbnksIGVsOiBhbnkpID0+IHtcclxuICAgIGNvbnN0IG9yaWcgPSAkKGVsKS5hdHRyKCdjbGFzcycpITtcclxuICAgIGNvbnN0IHVubyA9IG9yaWcuc3BsaXQoL1xccysvKS5mbGF0TWFwKChjbHM6IHN0cmluZykgPT4gY2xhc3NNYXBbY2xzXSB8fCBjbHMpO1xyXG4gICAgJChlbCkuYXR0cignY2xhc3MnLCB1bm8uam9pbignICcpKTtcclxuICB9KTtcclxuICAvLyBcdTA0MjNcdTA0MzRcdTA0MzBcdTA0M0JcdTA0NEZcdTA0MzVcdTA0M0Mgc2NvcGVkLVx1MDQzMFx1MDQ0Mlx1MDQ0MFx1MDQzOFx1MDQzMVx1MDQ0M1x1MDQ0Mlx1MDQ0QlxyXG4gICQoJyonKS5lYWNoKChfOiBhbnksIGVsOiBhbnkpID0+IHtcclxuICAgIC8vIEB0cy1pZ25vcmU6IGF0dHJpYnMgXHUwNDM1XHUwNDQxXHUwNDQyXHUwNDRDIFx1MDQ0Mlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzQVx1MDQzRSBcdTA0NDMgXHUwNDQyXHUwNDM1XHUwNDMzXHUwNDNFXHUwNDMyXHJcbiAgICBpZiAoZWwudHlwZSA9PT0gJ3RhZycgJiYgZWwuYXR0cmlicykge1xyXG4gICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgT2JqZWN0LmtleXMoZWwuYXR0cmlicykpIHtcclxuICAgICAgICBpZiAoYXR0ci5zdGFydHNXaXRoKCdkYXRhLXYtJykpICQoZWwpLnJlbW92ZUF0dHIoYXR0cik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBjb25zdCBodG1sT3V0ID0gJC5odG1sKCk7XHJcbiAgY29uc3QgdW5vQ2xhc3NlcyA9IE9iamVjdC52YWx1ZXMoY2xhc3NNYXApLmZsYXQoKTtcclxuICByZXR1cm4geyBodG1sOiBodG1sT3V0LCB1bm9DbGFzc2VzIH07XHJcbn1cclxuXHJcbi8vIFx1MDQxRVx1MDQ0MVx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzRFx1MDQzMFx1MDQ0RiBcdTA0NDRcdTA0NDNcdTA0M0RcdTA0M0FcdTA0NDZcdTA0MzhcdTA0NEY6IHByb2Nlc3NBbGxTb3VyY2VzIChIVE1MK0NTUylcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NBbGxTb3VyY2VzKHsgaHRtbFBhdGgsIGNzc1BhdGggfTogeyBodG1sUGF0aDogc3RyaW5nLCBjc3NQYXRoOiBzdHJpbmcgfSkge1xyXG4gIC8vIDEuIFx1MDQyN1x1MDQzOFx1MDQ0Mlx1MDQzMFx1MDQzNVx1MDQzQyBcdTA0MzhcdTA0NDFcdTA0NDVcdTA0M0VcdTA0MzRcdTA0M0RcdTA0NEJcdTA0MzUgXHUwNDQ0XHUwNDMwXHUwNDM5XHUwNDNCXHUwNDRCXHJcbiAgY29uc3QgaHRtbFJhdyA9IGF3YWl0IGZzLnJlYWRGaWxlKGh0bWxQYXRoLCAndXRmLTgnKTtcclxuICBjb25zdCBjc3NSYXcgPSBhd2FpdCBmcy5yZWFkRmlsZShjc3NQYXRoLCAndXRmLTgnKTtcclxuXHJcbiAgLy8gMi4gXHUwNDFGXHUwNDMwXHUwNDQwXHUwNDQxXHUwNDM4XHUwNDNDIENTUywgXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDNFXHUwNDM4XHUwNDNDIFx1MDQzQ1x1MDQzMFx1MDQzRlx1MDQzRlx1MDQzOFx1MDQzRFx1MDQzMyBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDMyXHUwNDQxXHUwNDM1XHUwNDQ1IFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQzRVx1MDQzMiBcdTA0MzhcdTA0MzcgXHUwNDMyXHUwNDQxXHUwNDM1XHUwNDQ1IFx1MDQ0MVx1MDQzNVx1MDQzQlx1MDQzNVx1MDQzQVx1MDQ0Mlx1MDQzRVx1MDQ0MFx1MDQzRVx1MDQzMlxyXG4gIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKGNzc1Jhdyk7XHJcbiAgY29uc3QgY2xhc3NNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiA9IHt9O1xyXG4gIHJvb3Qud2Fsa1J1bGVzKChydWxlOiBhbnkpID0+IHtcclxuICAgIC8vIFx1MDQxOFx1MDQzN1x1MDQzMlx1MDQzQlx1MDQzNVx1MDQzQVx1MDQzMFx1MDQzNVx1MDQzQyBcdTA0MzJcdTA0NDFcdTA0MzUgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCIFx1MDQzOFx1MDQzNyBcdTA0NDFcdTA0MzVcdTA0M0JcdTA0MzVcdTA0M0FcdTA0NDJcdTA0M0VcdTA0NDBcdTA0MzAgKFx1MDQzMlx1MDQzQVx1MDQzQlx1MDQ0RVx1MDQ0N1x1MDQzMFx1MDQ0RiBcdTA0NDFcdTA0M0JcdTA0M0VcdTA0MzZcdTA0M0RcdTA0NEJcdTA0MzUpXHJcbiAgICBjb25zdCBjbGFzc05hbWVzID0gQXJyYXkuZnJvbShydWxlLnNlbGVjdG9yLm1hdGNoQWxsKC9cXC4oW2EtekEtWjAtOV8tXSspL2cpKS5tYXAoKG06IGFueSkgPT4gbVsxXSk7XHJcbiAgICBpZiAoY2xhc3NOYW1lcy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgIGNvbnN0IHVub0NsYXNzZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBydWxlLndhbGtEZWNscygoZGVjbDogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHVubyA9IENTU1V0aWxzLmNvbnZlcnRQcm9wZXJ0eVRvVW5vQ2xhc3MoZGVjbC5wcm9wLCBkZWNsLnZhbHVlKTtcclxuICAgICAgaWYgKHVubykgdW5vQ2xhc3Nlcy5wdXNoKC4uLnVubyk7XHJcbiAgICB9KTtcclxuICAgIGZvciAoY29uc3QgY2xhc3NOYW1lIG9mIGNsYXNzTmFtZXMpIHtcclxuICAgICAgaWYgKCFjbGFzc01hcFtjbGFzc05hbWVdKSBjbGFzc01hcFtjbGFzc05hbWVdID0gW107XHJcbiAgICAgIGNsYXNzTWFwW2NsYXNzTmFtZV0ucHVzaCguLi51bm9DbGFzc2VzKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gMy4gXHUwNDE3XHUwNDMwXHUwNDNDXHUwNDM1XHUwNDNEXHUwNDRGXHUwNDM1XHUwNDNDIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QiBcdTA0MzIgSFRNTFxyXG4gIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoaHRtbFJhdyk7XHJcbiAgLy8gXHUwNDIxXHUwNDNFXHUwNDMxXHUwNDM4XHUwNDQwXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNSBcdTA0NDBcdTA0MzVcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0M0UgXHUwNDM4XHUwNDQxXHUwNDNGXHUwNDNFXHUwNDNCXHUwNDRDXHUwNDM3XHUwNDQzXHUwNDM1XHUwNDNDXHUwNDRCXHUwNDM1IFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQ0QlxyXG4gIGNvbnN0IHVzZWRDbGFzc2VzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcbiAgJCgnW2NsYXNzXScpLmVhY2goKF86IGFueSwgZWw6IGFueSkgPT4ge1xyXG4gICAgY29uc3Qgb3JpZyA9ICQoZWwpLmF0dHIoJ2NsYXNzJykhO1xyXG4gICAgb3JpZy5zcGxpdCgvXFxzKy8pLmZvckVhY2goKGNsczogc3RyaW5nKSA9PiB1c2VkQ2xhc3Nlcy5hZGQoY2xzKSk7XHJcbiAgICBjb25zdCB1bm8gPSBvcmlnLnNwbGl0KC9cXHMrLykuZmxhdE1hcCgoY2xzOiBzdHJpbmcpID0+IGNsYXNzTWFwW2Nsc10gfHwgY2xzKTtcclxuICAgICQoZWwpLmF0dHIoJ2NsYXNzJywgdW5vLmpvaW4oJyAnKSk7XHJcbiAgfSk7XHJcbiAgY29uc3QgaHRtbE91dCA9ICQuaHRtbCgpO1xyXG5cclxuICAvLyA0LiBcdTA0MTNcdTA0MzVcdTA0M0RcdTA0MzVcdTA0NDBcdTA0MzhcdTA0NDBcdTA0NDNcdTA0MzVcdTA0M0MgXHUwNDQ0XHUwNDM4XHUwNDNEXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDRCXHUwNDM5IENTUyBcdTA0NDdcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzcgVW5vQ1NTIChcdTA0MzhcdTA0M0NcdTA0M0ZcdTA0M0VcdTA0NDBcdTA0NDJcdTA0NEIgXHUwNDMyXHUwNDNEXHUwNDQzXHUwNDQyXHUwNDQwXHUwNDM4IFx1MDQ0NFx1MDQ0M1x1MDQzRFx1MDQzQVx1MDQ0Nlx1MDQzOFx1MDQzOCwgXHUwNDQxIGFueSBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDNFXHUwNDMyXHUwNDNDXHUwNDM1XHUwNDQxXHUwNDQyXHUwNDM4XHUwNDNDXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDM4KVxyXG4gIGNvbnN0IHsgY3JlYXRlR2VuZXJhdG9yIH0gPSBhd2FpdCBpbXBvcnQoJ0B1bm9jc3MvY29yZScpO1xyXG4gIGNvbnN0IHsgZGVmYXVsdDogcHJlc2V0VW5vIH0gPSBhd2FpdCBpbXBvcnQoJ0B1bm9jc3MvcHJlc2V0LXVubycpO1xyXG4gIGNvbnN0IHsgZGVmYXVsdDogcHJlc2V0QXR0cmlidXRpZnkgfSA9IGF3YWl0IGltcG9ydCgnQHVub2Nzcy9wcmVzZXQtYXR0cmlidXRpZnknKTtcclxuICBjb25zdCB7IGRlZmF1bHQ6IHByZXNldEljb25zIH0gPSBhd2FpdCBpbXBvcnQoJ0B1bm9jc3MvcHJlc2V0LWljb25zJyk7XHJcbiAgY29uc3QgdW5vID0gKGNyZWF0ZUdlbmVyYXRvciBhcyBhbnkpKHsgcHJlc2V0czogW3ByZXNldFVubywgcHJlc2V0QXR0cmlidXRpZnksIHByZXNldEljb25zXSB9KTtcclxuICAvLyBcdTA0MjFcdTA0M0VcdTA0MzFcdTA0MzhcdTA0NDBcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDMyXHUwNDQxXHUwNDM1IHVuby1cdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0NEIsIFx1MDQzQVx1MDQzRVx1MDQ0Mlx1MDQzRVx1MDQ0MFx1MDQ0Qlx1MDQzNSBcdTA0NDBcdTA0MzVcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0M0UgXHUwNDM4XHUwNDQxXHUwNDNGXHUwNDNFXHUwNDNCXHUwNDRDXHUwNDM3XHUwNDQzXHUwNDRFXHUwNDQyXHUwNDQxXHUwNDRGLCBcdTA0MzJcdTA0M0FcdTA0M0JcdTA0NEVcdTA0NDdcdTA0MzBcdTA0NEYgXHUwNDQzXHUwNDNEXHUwNDMwXHUwNDQwXHUwNDNEXHUwNDRCXHUwNDM1XHJcbiAgY29uc3QgYWxsVW5vQ2xhc3NlcyA9IFtcclxuICAgIC4uLk9iamVjdC52YWx1ZXMoY2xhc3NNYXApLmZsYXQoKSxcclxuICAgIC4uLkFycmF5LmZyb20odXNlZENsYXNzZXMpLmZpbHRlcihjbHMgPT4gIShjbHMgaW4gY2xhc3NNYXApKSxcclxuICBdO1xyXG4gIGNvbnN0IHsgY3NzIH0gPSBhd2FpdCAodW5vIGFzIGFueSkuZ2VuZXJhdGUoYWxsVW5vQ2xhc3Nlcy5qb2luKCcgJykpO1xyXG5cclxuICByZXR1cm4geyBodG1sOiBodG1sT3V0LCBjc3MgfTtcclxufVxyXG5cclxuLy8gXHUwNDFEXHUwNDNFXHUwNDMyXHUwNDMwXHUwNDRGIFx1MDQ0NFx1MDQ0M1x1MDQzRFx1MDQzQVx1MDQ0Nlx1MDQzOFx1MDQ0RjogXHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDNBXHUwNDMwIEhUTUwtXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDNFXHUwNDNBXHUwNDM4IFx1MDQzOCBDU1MtXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDNFXHUwNDNBXHUwNDM4LCBcdTA0MzJcdTA0M0VcdTA0MzdcdTA0MzJcdTA0NDBcdTA0MzBcdTA0NDlcdTA0MzBcdTA0MzVcdTA0NDIgeyBodG1sLCBjc3MgfVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0h0bWxBbmRDc3NTdHJpbmdzKGh0bWxSYXc6IHN0cmluZywgY3NzUmF3OiBzdHJpbmcpIHtcclxuICAvLyAxLiBcdTA0MUZcdTA0MzBcdTA0NDBcdTA0NDFcdTA0MzhcdTA0M0MgQ1NTLCBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0M0VcdTA0MzhcdTA0M0MgXHUwNDNDXHUwNDMwXHUwNDNGXHUwNDNGXHUwNDM4XHUwNDNEXHUwNDMzIFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0MzJcdTA0NDFcdTA0MzVcdTA0NDUgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDNFXHUwNDMyIFx1MDQzOFx1MDQzNyBcdTA0MzJcdTA0NDFcdTA0MzVcdTA0NDUgXHUwNDQxXHUwNDM1XHUwNDNCXHUwNDM1XHUwNDNBXHUwNDQyXHUwNDNFXHUwNDQwXHUwNDNFXHUwNDMyXHJcbiAgY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoY3NzUmF3KTtcclxuICBjb25zdCBjbGFzc01hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge307XHJcbiAgcm9vdC53YWxrUnVsZXMoKHJ1bGU6IGFueSkgPT4ge1xyXG4gICAgLy8gXHUwNDE4XHUwNDM3XHUwNDMyXHUwNDNCXHUwNDM1XHUwNDNBXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNSBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0NEIgXHUwNDM4XHUwNDM3IFx1MDQ0MVx1MDQzNVx1MDQzQlx1MDQzNVx1MDQzQVx1MDQ0Mlx1MDQzRVx1MDQ0MFx1MDQzMCAoXHUwNDMyXHUwNDNBXHUwNDNCXHUwNDRFXHUwNDQ3XHUwNDMwXHUwNDRGIFx1MDQ0MVx1MDQzQlx1MDQzRVx1MDQzNlx1MDQzRFx1MDQ0Qlx1MDQzNSlcclxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBBcnJheS5mcm9tKHJ1bGUuc2VsZWN0b3IubWF0Y2hBbGwoL1xcLihbYS16QS1aMC05Xy1dKykvZykpLm1hcCgobTogYW55KSA9PiBtWzFdKTtcclxuICAgIGlmIChjbGFzc05hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgY29uc3QgdW5vQ2xhc3Nlczogc3RyaW5nW10gPSBbXTtcclxuICAgIHJ1bGUud2Fsa0RlY2xzKChkZWNsOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdW5vID0gQ1NTVXRpbHMuY29udmVydFByb3BlcnR5VG9Vbm9DbGFzcyhkZWNsLnByb3AsIGRlY2wudmFsdWUpO1xyXG4gICAgICBpZiAodW5vKSB1bm9DbGFzc2VzLnB1c2goLi4udW5vKTtcclxuICAgIH0pO1xyXG4gICAgZm9yIChjb25zdCBjbGFzc05hbWUgb2YgY2xhc3NOYW1lcykge1xyXG4gICAgICBpZiAoIWNsYXNzTWFwW2NsYXNzTmFtZV0pIGNsYXNzTWFwW2NsYXNzTmFtZV0gPSBbXTtcclxuICAgICAgY2xhc3NNYXBbY2xhc3NOYW1lXS5wdXNoKC4uLnVub0NsYXNzZXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyAyLiBcdTA0MTdcdTA0MzBcdTA0M0NcdTA0MzVcdTA0M0RcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCIFx1MDQzMiBIVE1MXHJcbiAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChodG1sUmF3KTtcclxuICAvLyBcdTA0MjFcdTA0M0VcdTA0MzFcdTA0MzhcdTA0NDBcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDMyXHUwNDQxXHUwNDM1IFx1MDQ0MFx1MDQzNVx1MDQzMFx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzRSBcdTA0MzhcdTA0NDFcdTA0M0ZcdTA0M0VcdTA0M0JcdTA0NENcdTA0MzdcdTA0NDNcdTA0MzVcdTA0M0NcdTA0NEJcdTA0MzUgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCXHJcbiAgY29uc3QgdXNlZENsYXNzZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAkKCdbY2xhc3NdJykuZWFjaCgoXzogYW55LCBlbDogYW55KSA9PiB7XHJcbiAgICBjb25zdCBvcmlnID0gJChlbCkuYXR0cignY2xhc3MnKSE7XHJcbiAgICBvcmlnLnNwbGl0KC9cXHMrLykuZm9yRWFjaCgoY2xzOiBzdHJpbmcpID0+IHVzZWRDbGFzc2VzLmFkZChjbHMpKTtcclxuICAgIGNvbnN0IHVubyA9IG9yaWcuc3BsaXQoL1xccysvKS5mbGF0TWFwKChjbHM6IHN0cmluZykgPT4gY2xhc3NNYXBbY2xzXSB8fCBjbHMpO1xyXG4gICAgJChlbCkuYXR0cignY2xhc3MnLCB1bm8uam9pbignICcpKTtcclxuICB9KTtcclxuICBjb25zdCBodG1sT3V0ID0gJC5odG1sKCk7XHJcblxyXG4gIC8vIDMuIFx1MDQxM1x1MDQzNVx1MDQzRFx1MDQzNVx1MDQ0MFx1MDQzOFx1MDQ0MFx1MDQ0M1x1MDQzNVx1MDQzQyBcdTA0NDRcdTA0MzhcdTA0M0RcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0NEJcdTA0MzkgQ1NTIFx1MDQ0N1x1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNyBVbm9DU1NcclxuICBjb25zdCB7IGNyZWF0ZUdlbmVyYXRvciB9ID0gYXdhaXQgaW1wb3J0KCdAdW5vY3NzL2NvcmUnKTtcclxuICBjb25zdCB7IGRlZmF1bHQ6IHByZXNldFVubyB9ID0gYXdhaXQgaW1wb3J0KCdAdW5vY3NzL3ByZXNldC11bm8nKTtcclxuICBjb25zdCB7IGRlZmF1bHQ6IHByZXNldEF0dHJpYnV0aWZ5IH0gPSBhd2FpdCBpbXBvcnQoJ0B1bm9jc3MvcHJlc2V0LWF0dHJpYnV0aWZ5Jyk7XHJcbiAgY29uc3QgeyBkZWZhdWx0OiBwcmVzZXRJY29ucyB9ID0gYXdhaXQgaW1wb3J0KCdAdW5vY3NzL3ByZXNldC1pY29ucycpO1xyXG4gIGNvbnN0IHVubyA9IChjcmVhdGVHZW5lcmF0b3IgYXMgYW55KSh7IHByZXNldHM6IFtwcmVzZXRVbm8sIHByZXNldEF0dHJpYnV0aWZ5LCBwcmVzZXRJY29uc10gfSk7XHJcbiAgLy8gXHUwNDIxXHUwNDNFXHUwNDMxXHUwNDM4XHUwNDQwXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNSB1bm8tXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDRCLCBcdTA0M0FcdTA0M0VcdTA0NDJcdTA0M0VcdTA0NDBcdTA0NEJcdTA0MzUgXHUwNDQwXHUwNDM1XHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDNFIFx1MDQzOFx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzN1x1MDQ0M1x1MDQ0RVx1MDQ0Mlx1MDQ0MVx1MDQ0RiwgXHUwNDMyXHUwNDNBXHUwNDNCXHUwNDRFXHUwNDQ3XHUwNDMwXHUwNDRGIFx1MDQ0M1x1MDQzRFx1MDQzMFx1MDQ0MFx1MDQzRFx1MDQ0Qlx1MDQzNVxyXG4gIGNvbnN0IGFsbFVub0NsYXNzZXMgPSBbXHJcbiAgICAuLi5PYmplY3QudmFsdWVzKGNsYXNzTWFwKS5mbGF0KCksXHJcbiAgICAuLi5BcnJheS5mcm9tKHVzZWRDbGFzc2VzKS5maWx0ZXIoY2xzID0+ICEoY2xzIGluIGNsYXNzTWFwKSksXHJcbiAgXTtcclxuICBjb25zdCB7IGNzcyB9ID0gYXdhaXQgKHVubyBhcyBhbnkpLmdlbmVyYXRlKGFsbFVub0NsYXNzZXMuam9pbignICcpKTtcclxuXHJcbiAgcmV0dXJuIHsgaHRtbDogaHRtbE91dCwgY3NzIH07XHJcbn0gIiwgIi8vIFx1MDQxRVx1MDQzMVx1MDQ0OVx1MDQzOFx1MDQzNSBcdTA0NDNcdTA0NDJcdTA0MzhcdTA0M0JcdTA0MzhcdTA0NDJcdTA0NEIgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzQVx1MDQzOCBDU1MgXHUwNDM4IFVub0NTU1xuXG5leHBvcnQgaW50ZXJmYWNlIFVub0NTU01hcHBpbmcge1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG59XG5cbi8vIFx1MDQxNVx1MDQzNFx1MDQzOFx1MDQzRFx1MDQ0Qlx1MDQzOSBcdTA0M0NcdTA0MzBcdTA0M0ZcdTA0M0ZcdTA0MzhcdTA0M0RcdTA0MzMgVW5vQ1NTIFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzOVx1MDQ0MVx1MDQ0Mlx1MDQzMlxuZXhwb3J0IGNvbnN0IFVOT19QUk9QRVJUWV9NQVA6IFVub0NTU01hcHBpbmcgPSB7XG4gIC8vIFx1MDQyNlx1MDQzMlx1MDQzNVx1MDQ0Mlx1MDQzRVx1MDQzMlx1MDQ0Qlx1MDQzNVxuICAnYmFja2dyb3VuZC1jb2xvcic6ICdiZy1jb2xvcicsXG4gICdjb2xvcic6ICdjb2xvcicsXG4gICdib3JkZXItY29sb3InOiAnYm9yZGVyJyxcbiAgJ291dGxpbmUtY29sb3InOiAnb3V0bGluZScsXG4gICd0ZXh0LWRlY29yYXRpb24tY29sb3InOiAnZGVjb3JhdGlvbicsXG4gICdjb2x1bW4tcnVsZS1jb2xvcic6ICdjb2x1bW4tcnVsZScsXG4gICdjYXJldC1jb2xvcic6ICdjYXJldCcsXG4gICdmaWxsJzogJ2ZpbGwnLFxuICAnc3Ryb2tlJzogJ3N0cm9rZScsXG4gICdhY2NlbnQtY29sb3InOiAnYWNjZW50JyxcbiAgJ2JvcmRlci10b3AtY29sb3InOiAnYm9yZGVyLXQnLFxuICAnYm9yZGVyLXJpZ2h0LWNvbG9yJzogJ2JvcmRlci1yJyxcbiAgJ2JvcmRlci1ib3R0b20tY29sb3InOiAnYm9yZGVyLWInLFxuICAnYm9yZGVyLWxlZnQtY29sb3InOiAnYm9yZGVyLWwnLFxuICAvLyBcdTA0MjBcdTA0MzBcdTA0MzdcdTA0M0NcdTA0MzVcdTA0NDBcdTA0NEJcbiAgJ3dpZHRoJzogJ3cnLFxuICAnbWluLXdpZHRoJzogJ21pbi13JyxcbiAgJ21heC13aWR0aCc6ICdtYXgtdycsXG4gICdoZWlnaHQnOiAnaCcsXG4gICdtaW4taGVpZ2h0JzogJ21pbi1oJyxcbiAgJ21heC1oZWlnaHQnOiAnbWF4LWgnLFxuICAvLyBcdTA0MUVcdTA0NDJcdTA0NDFcdTA0NDJcdTA0NDNcdTA0M0ZcdTA0NEJcbiAgJ21hcmdpbic6ICdtJyxcbiAgJ21hcmdpbi10b3AnOiAnbXQnLFxuICAnbWFyZ2luLXJpZ2h0JzogJ21yJyxcbiAgJ21hcmdpbi1ib3R0b20nOiAnbWInLFxuICAnbWFyZ2luLWxlZnQnOiAnbWwnLFxuICAncGFkZGluZyc6ICdwJyxcbiAgJ3BhZGRpbmctdG9wJzogJ3B0JyxcbiAgJ3BhZGRpbmctcmlnaHQnOiAncHInLFxuICAncGFkZGluZy1ib3R0b20nOiAncGInLFxuICAncGFkZGluZy1sZWZ0JzogJ3BsJyxcbiAgLy8gRmxleC9HcmlkXG4gICdkaXNwbGF5JzogJycsIC8vIGhhbmRsZWQgc2VwYXJhdGVseVxuICAnZmxleC1kaXJlY3Rpb24nOiAnZmxleCcsXG4gICdmbGV4LXdyYXAnOiAnZmxleCcsXG4gICdmbGV4LWdyb3cnOiAnZ3JvdycsXG4gICdmbGV4LXNocmluayc6ICdzaHJpbmsnLFxuICAnZmxleC1iYXNpcyc6ICdiYXNpcycsXG4gICdqdXN0aWZ5LWNvbnRlbnQnOiAnanVzdGlmeScsXG4gICdhbGlnbi1pdGVtcyc6ICdpdGVtcycsXG4gICdhbGlnbi1zZWxmJzogJ3NlbGYnLFxuICAnYWxpZ24tY29udGVudCc6ICdjb250ZW50JyxcbiAgJ29yZGVyJzogJ29yZGVyJyxcbiAgJ2dhcCc6ICdnYXAnLFxuICAncm93LWdhcCc6ICdyb3ctZ2FwJyxcbiAgJ2NvbHVtbi1nYXAnOiAnY29sLWdhcCcsXG4gIC8vIEdyaWRcbiAgJ2dyaWQtdGVtcGxhdGUtY29sdW1ucyc6ICdncmlkLWNvbHMnLFxuICAnZ3JpZC10ZW1wbGF0ZS1yb3dzJzogJ2dyaWQtcm93cycsXG4gICdncmlkLWNvbHVtbic6ICdjb2wnLFxuICAnZ3JpZC1yb3cnOiAncm93JyxcbiAgJ2dyaWQtYXV0by1mbG93JzogJ2dyaWQtZmxvdycsXG4gIC8vIEJvcmRlclxuICAnYm9yZGVyLXJhZGl1cyc6ICdyb3VuZGVkJyxcbiAgJ2JvcmRlci13aWR0aCc6ICdib3JkZXInLFxuICAnYm9yZGVyLXN0eWxlJzogJ2JvcmRlcicsXG4gIC8vIFx1MDQyMlx1MDQzNVx1MDQzQVx1MDQ0MVx1MDQ0MlxuICAnZm9udC1zaXplJzogJ3RleHQnLFxuICAnZm9udC13ZWlnaHQnOiAnZm9udCcsXG4gICdmb250LWZhbWlseSc6ICdmb250JyxcbiAgJ2xpbmUtaGVpZ2h0JzogJ2xlYWRpbmcnLFxuICAnbGV0dGVyLXNwYWNpbmcnOiAndHJhY2tpbmcnLFxuICAndGV4dC1hbGlnbic6ICd0ZXh0JyxcbiAgJ3RleHQtdHJhbnNmb3JtJzogJ3VwcGVyY2FzZScsXG4gICd2ZXJ0aWNhbC1hbGlnbic6ICdhbGlnbicsXG4gIC8vIFx1MDQxRlx1MDQ0MFx1MDQzRVx1MDQ0N1x1MDQzNVx1MDQzNVxuICAnb3BhY2l0eSc6ICdvcGFjaXR5JyxcbiAgJ2JveC1zaGFkb3cnOiAnc2hhZG93JyxcbiAgJ3otaW5kZXgnOiAneicsXG4gICdvdmVyZmxvdyc6ICdvdmVyZmxvdycsXG4gICdvdmVyZmxvdy14JzogJ292ZXJmbG93LXgnLFxuICAnb3ZlcmZsb3cteSc6ICdvdmVyZmxvdy15JyxcbiAgJ29iamVjdC1maXQnOiAnb2JqZWN0JyxcbiAgJ29iamVjdC1wb3NpdGlvbic6ICdvYmplY3QnLFxuICAnYmFja2dyb3VuZC1pbWFnZSc6ICdiZy1pbWFnZScsXG4gICdiYWNrZ3JvdW5kLXBvc2l0aW9uJzogJ2JnJyxcbiAgJ2JhY2tncm91bmQtc2l6ZSc6ICdiZycsXG4gICdiYWNrZ3JvdW5kLXJlcGVhdCc6ICdiZycsXG4gICdiYWNrZ3JvdW5kLWNsaXAnOiAnYmcnLFxuICAnYmFja2dyb3VuZC1hdHRhY2htZW50JzogJ2JnJyxcbiAgJ2N1cnNvcic6ICdjdXJzb3InLFxuICAndXNlci1zZWxlY3QnOiAnc2VsZWN0JyxcbiAgJ3BvaW50ZXItZXZlbnRzJzogJ3BvaW50ZXItZXZlbnRzJyxcbiAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbicsXG4gICd0cmFuc2l0aW9uLXByb3BlcnR5JzogJ3RyYW5zaXRpb24nLFxuICAndHJhbnNpdGlvbi1kdXJhdGlvbic6ICdkdXJhdGlvbicsXG4gICd0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbic6ICdlYXNlJyxcbiAgJ3RyYW5zaXRpb24tZGVsYXknOiAnZGVsYXknLFxuICAnYW5pbWF0aW9uJzogJ2FuaW1hdGUnLFxuICAnYW5pbWF0aW9uLW5hbWUnOiAnYW5pbWF0ZScsXG4gICdhbmltYXRpb24tZHVyYXRpb24nOiAnZHVyYXRpb24nLFxuICAnYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbic6ICdlYXNlJyxcbiAgJ2FuaW1hdGlvbi1kZWxheSc6ICdkZWxheScsXG4gICdhbmltYXRpb24taXRlcmF0aW9uLWNvdW50JzogJ3JlcGVhdCcsXG4gICdhbmltYXRpb24tZGlyZWN0aW9uJzogJ2RpcmVjdGlvbicsXG4gICdhbmltYXRpb24tZmlsbC1tb2RlJzogJ2ZpbGwtbW9kZScsXG4gICdhbmltYXRpb24tcGxheS1zdGF0ZSc6ICdwbGF5JyxcbiAgJ2lzb2xhdGlvbic6ICdpc29sYXRlJyxcbiAgJ3Bvc2l0aW9uJzogJycsIC8vIGhhbmRsZWQgc2VwYXJhdGVseVxuICAndG9wJzogJ3RvcCcsXG4gICdyaWdodCc6ICdyaWdodCcsXG4gICdib3R0b20nOiAnYm90dG9tJyxcbiAgJ2xlZnQnOiAnbGVmdCcsXG4gICd2aXNpYmlsaXR5JzogJ3Zpc2libGUnLFxuICAnZmxvYXQnOiAnZmxvYXQnLFxuICAnY2xlYXInOiAnY2xlYXInLFxuICAncmVzaXplJzogJ3Jlc2l6ZScsXG4gICdsaXN0LXN0eWxlLXR5cGUnOiAnbGlzdCcsXG4gICdsaXN0LXN0eWxlLXBvc2l0aW9uJzogJ2xpc3QnLFxuICAnYXBwZWFyYW5jZSc6ICdhcHBlYXJhbmNlJyxcbiAgJ291dGxpbmUnOiAnb3V0bGluZScsXG4gICdvdXRsaW5lLXdpZHRoJzogJ291dGxpbmUnLFxuICAnb3V0bGluZS1zdHlsZSc6ICdvdXRsaW5lJyxcbiAgJ291dGxpbmUtb2Zmc2V0JzogJ291dGxpbmUtb2Zmc2V0JyxcbiAgJ2ZpbHRlcic6ICdmaWx0ZXInLFxuICAnYmFja2Ryb3AtZmlsdGVyJzogJ2JhY2tkcm9wJyxcbiAgJ21peC1ibGVuZC1tb2RlJzogJ2JsZW5kJyxcbiAgJ2JhY2tncm91bmQtYmxlbmQtbW9kZSc6ICdiZy1ibGVuZCcsXG4gICdib3gtc2l6aW5nJzogJ2JveCcsXG4gICdjb250ZW50LXZpc2liaWxpdHknOiAnY29udGVudCcsXG4gICdhc3BlY3QtcmF0aW8nOiAnYXNwZWN0JyxcbiAgJ3dyaXRpbmctbW9kZSc6ICd3cml0aW5nJyxcbiAgJ3doaXRlLXNwYWNlJzogJ3doaXRlc3BhY2UnLFxuICAnd29yZC1icmVhayc6ICdicmVhaycsXG4gICdvdmVyZmxvdy13cmFwJzogJ2JyZWFrJyxcbiAgJ3RleHQtb3ZlcmZsb3cnOiAndGV4dC1lbGxpcHNpcycsXG4gICd0ZXh0LWRlY29yYXRpb24nOiAndW5kZXJsaW5lJyxcbiAgJ3RleHQtZGVjb3JhdGlvbi1zdHlsZSc6ICdkZWNvcmF0aW9uJyxcbiAgJ3RleHQtZGVjb3JhdGlvbi10aGlja25lc3MnOiAnZGVjb3JhdGlvbicsXG4gICd0ZXh0LXVuZGVybGluZS1vZmZzZXQnOiAndW5kZXJsaW5lLW9mZnNldCcsXG4gICd0ZXh0LWluZGVudCc6ICdpbmRlbnQnLFxuICAndGFiLXNpemUnOiAndGFiJyxcbiAgJ2NhcmV0LXNoYXBlJzogJ2NhcmV0JyxcbiAgJ3N0cm9rZS13aWR0aCc6ICdzdHJva2UnLFxuICAnc3Ryb2tlLWRhc2hhcnJheSc6ICdzdHJva2UnLFxuICAnc3Ryb2tlLWRhc2hvZmZzZXQnOiAnc3Ryb2tlJyxcbiAgJ2ZpbGwtb3BhY2l0eSc6ICdmaWxsJyxcbiAgJ3N0cm9rZS1vcGFjaXR5JzogJ3N0cm9rZScsXG4gICdiYWNrZmFjZS12aXNpYmlsaXR5JzogJ2JhY2tmYWNlJyxcbiAgJ3BlcnNwZWN0aXZlJzogJ3BlcnNwZWN0aXZlJyxcbiAgJ3BlcnNwZWN0aXZlLW9yaWdpbic6ICdwZXJzcGVjdGl2ZScsXG4gICd0cmFuc2Zvcm0nOiAndHJhbnNmb3JtJyxcbiAgJ3RyYW5zZm9ybS1vcmlnaW4nOiAnb3JpZ2luJyxcbiAgJ3NjYWxlJzogJ3NjYWxlJyxcbiAgJ3JvdGF0ZSc6ICdyb3RhdGUnLFxuICAndHJhbnNsYXRlJzogJ3RyYW5zbGF0ZScsXG4gICdza2V3JzogJ3NrZXcnLFxufTtcblxuZXhwb3J0IGNsYXNzIENTU1V0aWxzIHtcbiAgLyoqXG4gICAqIFx1MDQxRlx1MDQ0MFx1MDQzNVx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQ0M1x1MDQzNVx1MDQ0MiBDU1MgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDM5XHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFIFx1MDQzMiBVbm9DU1MgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXG4gICAqL1xuICBzdGF0aWMgY29udmVydFByb3BlcnR5VG9Vbm9DbGFzcyhwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10gfCBudWxsIHtcbiAgICBjb25zdCB0cmltbWVkVmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgXG4gICAgLy8gXHUwNDIxXHUwNDNGXHUwNDM1XHUwNDQ2XHUwNDM4XHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDMwXHUwNDRGIFx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzQVx1MDQzMCBkaXNwbGF5XG4gICAgaWYgKHByb3BlcnR5ID09PSAnZGlzcGxheScpIHtcbiAgICAgIGNvbnN0IGRpc3BsYXlNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICdmbGV4JzogJ2ZsZXgnLFxuICAgICAgICAnZ3JpZCc6ICdncmlkJyxcbiAgICAgICAgJ2Jsb2NrJzogJ2Jsb2NrJyxcbiAgICAgICAgJ2lubGluZSc6ICdpbmxpbmUnLFxuICAgICAgICAnaW5saW5lLWJsb2NrJzogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICdub25lJzogJ2hpZGRlbicsXG4gICAgICB9O1xuICAgICAgY29uc3QgdW5vQ2xhc3MgPSBkaXNwbGF5TWFwW3RyaW1tZWRWYWx1ZV07XG4gICAgICByZXR1cm4gdW5vQ2xhc3MgPyBbdW5vQ2xhc3NdIDogbnVsbDtcbiAgICB9XG5cbiAgICAvLyBcdTA0MjFcdTA0M0ZcdTA0MzVcdTA0NDZcdTA0MzhcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0MzBcdTA0NEYgXHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDNBXHUwNDMwIHBvc2l0aW9uXG4gICAgaWYgKHByb3BlcnR5ID09PSAncG9zaXRpb24nKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbk1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJ3JlbGF0aXZlJzogJ3JlbGF0aXZlJyxcbiAgICAgICAgJ2Fic29sdXRlJzogJ2Fic29sdXRlJyxcbiAgICAgICAgJ2ZpeGVkJzogJ2ZpeGVkJyxcbiAgICAgICAgJ3N0aWNreSc6ICdzdGlja3knLFxuICAgICAgICAnc3RhdGljJzogJ3N0YXRpYycsXG4gICAgICB9O1xuICAgICAgY29uc3QgdW5vQ2xhc3MgPSBwb3NpdGlvbk1hcFt0cmltbWVkVmFsdWVdO1xuICAgICAgcmV0dXJuIHVub0NsYXNzID8gW3Vub0NsYXNzXSA6IG51bGw7XG4gICAgfVxuXG4gICAgLy8gXHUwNDIxXHUwNDNGXHUwNDM1XHUwNDQ2XHUwNDM4XHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDMwXHUwNDRGIFx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzQVx1MDQzMCBiYWNrZ3JvdW5kLWltYWdlXG4gICAgaWYgKHByb3BlcnR5ID09PSAnYmFja2dyb3VuZC1pbWFnZScpIHtcbiAgICAgIGlmICh0cmltbWVkVmFsdWUuc3RhcnRzV2l0aCgndXJsKCcpKSB7XG4gICAgICAgIHJldHVybiBbYGJnLWltYWdlLVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgICB9IGVsc2UgaWYgKHRyaW1tZWRWYWx1ZS5zdGFydHNXaXRoKCdodHRwJykpIHtcbiAgICAgICAgcmV0dXJuIFtgYmctaW1hZ2UtW3VybCgke3RyaW1tZWRWYWx1ZX0pXWBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtgYmctaW1hZ2UtWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBcdTA0MjFcdTA0M0ZcdTA0MzVcdTA0NDZcdTA0MzhcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0MzBcdTA0NEYgXHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDNBXHUwNDMwIFx1MDQ0Nlx1MDQzMlx1MDQzNVx1MDQ0Mlx1MDQzRVx1MDQzMlx1MDQ0Qlx1MDQ0NSBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0MzlcdTA0NDFcdTA0NDJcdTA0MzIgXHUwNDQxXHUwNDNFXHUwNDMzXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDNEXHUwNDNFIFx1MDQzNFx1MDQzRVx1MDQzQVx1MDQ0M1x1MDQzQ1x1MDQzNVx1MDQzRFx1MDQ0Mlx1MDQzMFx1MDQ0Nlx1MDQzOFx1MDQzOFxuICAgIGlmIChwcm9wZXJ0eSA9PT0gJ2JhY2tncm91bmQtY29sb3InKSB7XG4gICAgICBpZiAodHJpbW1lZFZhbHVlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICByZXR1cm4gW2BiZy1jb2xvci1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgICAgfVxuICAgICAgaWYgKHRyaW1tZWRWYWx1ZS5zdGFydHNXaXRoKCdyZ2InKSB8fCB0cmltbWVkVmFsdWUuc3RhcnRzV2l0aCgnaHNsJykpIHtcbiAgICAgICAgcmV0dXJuIFtgYmctY29sb3ItWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIH1cbiAgICAgIC8vIFx1MDQxNFx1MDQzQlx1MDQ0RiBcdTA0MzhcdTA0M0NcdTA0MzVcdTA0M0RcdTA0M0VcdTA0MzJcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NEJcdTA0NDUgXHUwNDQ2XHUwNDMyXHUwNDM1XHUwNDQyXHUwNDNFXHUwNDMyXG4gICAgICBjb25zdCBuYW1lZENvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJ3JlZCc6ICdyZWQtNTAwJyxcbiAgICAgICAgJ2dyZWVuJzogJ2dyZWVuLTUwMCcsXG4gICAgICAgICdibHVlJzogJ2JsdWUtNTAwJyxcbiAgICAgICAgJ2JsYWNrJzogJ2JsYWNrJyxcbiAgICAgICAgJ3doaXRlJzogJ3doaXRlJyxcbiAgICAgICAgJ2dyYXknOiAnZ3JheS01MDAnLFxuICAgICAgICAneWVsbG93JzogJ3llbGxvdy01MDAnLFxuICAgICAgICAnb3JhbmdlJzogJ29yYW5nZS01MDAnLFxuICAgICAgICAncHVycGxlJzogJ3B1cnBsZS01MDAnLFxuICAgICAgICAncGluayc6ICdwaW5rLTUwMCdcbiAgICAgIH07XG4gICAgICBjb25zdCBjb2xvckNsYXNzID0gbmFtZWRDb2xvcnNbdHJpbW1lZFZhbHVlXTtcbiAgICAgIGlmIChjb2xvckNsYXNzKSB7XG4gICAgICAgIHJldHVybiBbYGJnLSR7Y29sb3JDbGFzc31gXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbYGJnLWNvbG9yLVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnR5ID09PSAnY29sb3InKSB7XG4gICAgICBpZiAodHJpbW1lZFZhbHVlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICByZXR1cm4gW2Bjb2xvci1bJHt0cmltbWVkVmFsdWV9XWBdO1xuICAgICAgfVxuICAgICAgaWYgKHRyaW1tZWRWYWx1ZS5zdGFydHNXaXRoKCdyZ2InKSB8fCB0cmltbWVkVmFsdWUuc3RhcnRzV2l0aCgnaHNsJykpIHtcbiAgICAgICAgcmV0dXJuIFtgY29sb3ItWyR7dHJpbW1lZFZhbHVlfV1gXTtcbiAgICAgIH1cbiAgICAgIC8vIFx1MDQxNFx1MDQzQlx1MDQ0RiBcdTA0MzhcdTA0M0NcdTA0MzVcdTA0M0RcdTA0M0VcdTA0MzJcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NEJcdTA0NDUgXHUwNDQ2XHUwNDMyXHUwNDM1XHUwNDQyXHUwNDNFXHUwNDMyXG4gICAgICBjb25zdCBuYW1lZENvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJ3JlZCc6ICdyZWQtNTAwJyxcbiAgICAgICAgJ2dyZWVuJzogJ2dyZWVuLTUwMCcsXG4gICAgICAgICdibHVlJzogJ2JsdWUtNTAwJyxcbiAgICAgICAgJ2JsYWNrJzogJ2JsYWNrJyxcbiAgICAgICAgJ3doaXRlJzogJ3doaXRlJyxcbiAgICAgICAgJ2dyYXknOiAnZ3JheS01MDAnLFxuICAgICAgICAneWVsbG93JzogJ3llbGxvdy01MDAnLFxuICAgICAgICAnb3JhbmdlJzogJ29yYW5nZS01MDAnLFxuICAgICAgICAncHVycGxlJzogJ3B1cnBsZS01MDAnLFxuICAgICAgICAncGluayc6ICdwaW5rLTUwMCdcbiAgICAgIH07XG4gICAgICBjb25zdCBjb2xvckNsYXNzID0gbmFtZWRDb2xvcnNbdHJpbW1lZFZhbHVlXTtcbiAgICAgIGlmIChjb2xvckNsYXNzKSB7XG4gICAgICAgIHJldHVybiBbYGNvbG9yLSR7Y29sb3JDbGFzc31gXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbYGNvbG9yLVske3RyaW1tZWRWYWx1ZX1dYF07XG4gICAgfVxuXG4gICAgLy8gXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDNBXHUwNDMwIFx1MDQ0MVx1MDQzRVx1MDQzQVx1MDQ0MFx1MDQzMFx1MDQ0OVx1MDQ1MVx1MDQzRFx1MDQzRFx1MDQ0Qlx1MDQ0NSBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0MzlcdTA0NDFcdTA0NDJcdTA0MzJcbiAgICBpZiAocHJvcGVydHkgPT09ICdtYXJnaW4nIHx8IHByb3BlcnR5ID09PSAncGFkZGluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NTaG9ydGhhbmRQcm9wZXJ0eShwcm9wZXJ0eSwgdHJpbW1lZFZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydHkgPT09ICdib3JkZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9jZXNzQm9yZGVyU2hvcnRoYW5kKHRyaW1tZWRWYWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnR5ID09PSAnYmFja2dyb3VuZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NCYWNrZ3JvdW5kU2hvcnRoYW5kKHRyaW1tZWRWYWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gXHUwNDFFXHUwNDMxXHUwNDRCXHUwNDQ3XHUwNDNEXHUwNDRCXHUwNDM5IFx1MDQzQ1x1MDQzMFx1MDQzRlx1MDQzRlx1MDQzOFx1MDQzRFx1MDQzM1xuICAgIGNvbnN0IHVub1ByZWZpeCA9IFVOT19QUk9QRVJUWV9NQVBbcHJvcGVydHldO1xuICAgIGlmICh1bm9QcmVmaXgpIHtcbiAgICAgIGlmICh1bm9QcmVmaXggPT09ICcnKSByZXR1cm4gbnVsbDsgLy8gaGFuZGxlZCBzZXBhcmF0ZWx5XG4gICAgICByZXR1cm4gW2Ake3Vub1ByZWZpeH0tJHt0cmltbWVkVmFsdWV9YF07XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQzRFx1MDQzNVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzRFx1MDQzNFx1MDQzMFx1MDQ0MFx1MDQ0Mlx1MDQzRFx1MDQ0Qlx1MDQ0NSBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0MzlcdTA0NDFcdTA0NDJcdTA0MzJcbiAgICByZXR1cm4gW2BbJHtwcm9wZXJ0eX06JHt0cmltbWVkVmFsdWV9XWBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFx1MDQxRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzMFx1MDQ0Mlx1MDQ0Qlx1MDQzMlx1MDQzMFx1MDQzNVx1MDQ0MiBcdTA0NDFcdTA0M0VcdTA0M0FcdTA0NDBcdTA0MzBcdTA0NDlcdTA0NTFcdTA0M0RcdTA0M0RcdTA0NEJcdTA0MzUgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDM5XHUwNDQxXHUwNDQyXHUwNDMyXHUwNDMwIG1hcmdpbi9wYWRkaW5nXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBwcm9jZXNzU2hvcnRoYW5kUHJvcGVydHkocHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KC9cXHMrLyk7XG4gICAgY29uc3QgdW5vQ2xhc3Nlczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBwcmVmaXggPSBwcm9wZXJ0eVswXTsgLy8gJ20nIFx1MDQzNFx1MDQzQlx1MDQ0RiBtYXJnaW4sICdwJyBcdTA0MzRcdTA0M0JcdTA0NEYgcGFkZGluZ1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0KHZhbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIGlmICgvXi0/XFxkKyhweHxyZW18ZW18JSkkLy50ZXN0KHZhbCkpIHJldHVybiB2YWw7XG4gICAgICBpZiAoL14tP1xcZCskLy50ZXN0KHZhbCkpIHJldHVybiB2YWw7XG4gICAgICByZXR1cm4gYFske3ZhbH1dYDtcbiAgICB9XG5cbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB1bm9DbGFzc2VzLnB1c2goYCR7cHJlZml4fS0ke2Zvcm1hdChwYXJ0c1swXSl9YCk7XG4gICAgfSBlbHNlIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9eS0ke2Zvcm1hdChwYXJ0c1swXSl9YCk7XG4gICAgICB1bm9DbGFzc2VzLnB1c2goYCR7cHJlZml4fXgtJHtmb3JtYXQocGFydHNbMV0pfWApO1xuICAgIH0gZWxzZSBpZiAocGFydHMubGVuZ3RoID09PSAzKSB7XG4gICAgICB1bm9DbGFzc2VzLnB1c2goYCR7cHJlZml4fXQtJHtmb3JtYXQocGFydHNbMF0pfWApO1xuICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGAke3ByZWZpeH14LSR7Zm9ybWF0KHBhcnRzWzFdKX1gKTtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9Yi0ke2Zvcm1hdChwYXJ0c1syXSl9YCk7XG4gICAgfSBlbHNlIGlmIChwYXJ0cy5sZW5ndGggPT09IDQpIHtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9dC0ke2Zvcm1hdChwYXJ0c1swXSl9YCk7XG4gICAgICB1bm9DbGFzc2VzLnB1c2goYCR7cHJlZml4fXItJHtmb3JtYXQocGFydHNbMV0pfWApO1xuICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGAke3ByZWZpeH1iLSR7Zm9ybWF0KHBhcnRzWzJdKX1gKTtcbiAgICAgIHVub0NsYXNzZXMucHVzaChgJHtwcmVmaXh9bC0ke2Zvcm1hdChwYXJ0c1szXSl9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVub0NsYXNzZXM7XG4gIH1cblxuICAvKipcbiAgICogXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQ0MVx1MDQzRVx1MDQzQVx1MDQ0MFx1MDQzMFx1MDQ0OVx1MDQ1MVx1MDQzRFx1MDQzRFx1MDQzRVx1MDQzNSBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0MzlcdTA0NDFcdTA0NDJcdTA0MzJcdTA0M0UgYm9yZGVyXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBwcm9jZXNzQm9yZGVyU2hvcnRoYW5kKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcGFydHMgPSB2YWx1ZS5zcGxpdCgvXFxzKy8pO1xuICAgIGNvbnN0IHVub0NsYXNzZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgIGlmICgvXlxcZCtweCQvLnRlc3QocGFydCkpIHtcbiAgICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGBib3JkZXItJHtwYXJ0LnJlcGxhY2UoJ3B4JywgJycpfWApO1xuICAgICAgfSBlbHNlIGlmIChbJ3NvbGlkJywgJ2Rhc2hlZCcsICdkb3R0ZWQnLCAnZG91YmxlJywgJ25vbmUnXS5pbmNsdWRlcyhwYXJ0KSkge1xuICAgICAgICB1bm9DbGFzc2VzLnB1c2goYGJvcmRlci0ke3BhcnR9YCk7XG4gICAgICB9IGVsc2UgaWYgKHBhcnQuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICAgIHVub0NsYXNzZXMucHVzaChgYm9yZGVyLVske3BhcnR9XWApO1xuICAgICAgfSBlbHNlIGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ3JnYicpIHx8IHBhcnQuc3RhcnRzV2l0aCgnaHNsJykpIHtcbiAgICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGBib3JkZXItWyR7cGFydH1dYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVub0NsYXNzZXM7XG4gIH1cblxuICAvKipcbiAgICogXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQ0MVx1MDQzRVx1MDQzQVx1MDQ0MFx1MDQzMFx1MDQ0OVx1MDQ1MVx1MDQzRFx1MDQzRFx1MDQzRVx1MDQzNSBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0MzlcdTA0NDFcdTA0NDJcdTA0MzJcdTA0M0UgYmFja2dyb3VuZFxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcHJvY2Vzc0JhY2tncm91bmRTaG9ydGhhbmQodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB1bm9DbGFzc2VzOiBzdHJpbmdbXSA9IFtdO1xuICAgIFxuICAgIC8vIFx1MDQxRlx1MDQ0MFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQ0RiBcdTA0M0VcdTA0MzFcdTA0NDBcdTA0MzBcdTA0MzFcdTA0M0VcdTA0NDJcdTA0M0FcdTA0MzAgLSBcdTA0NDBcdTA0MzBcdTA0MzdcdTA0MzFcdTA0MzhcdTA0MzJcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDNGXHUwNDNFIFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQzMVx1MDQzNVx1MDQzQlx1MDQzMFx1MDQzQ1xuICAgIGNvbnN0IHBhcnRzID0gdmFsdWUuc3BsaXQoL1xccysvKTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgIGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ3VybCgnKSkge1xuICAgICAgICB1bm9DbGFzc2VzLnB1c2goYGJnLVske3BhcnR9XWApO1xuICAgICAgfSBlbHNlIGlmIChwYXJ0LnN0YXJ0c1dpdGgoJyMnKSB8fCBwYXJ0LnN0YXJ0c1dpdGgoJ3JnYicpIHx8IHBhcnQuc3RhcnRzV2l0aCgnaHNsJykpIHtcbiAgICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGBiZy1bJHtwYXJ0fV1gKTtcbiAgICAgIH0gZWxzZSBpZiAoWyduby1yZXBlYXQnLCAncmVwZWF0JywgJ3JlcGVhdC14JywgJ3JlcGVhdC15J10uaW5jbHVkZXMocGFydCkpIHtcbiAgICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGBiZy0ke3BhcnQucmVwbGFjZSgnLScsICcnKX1gKTtcbiAgICAgIH0gZWxzZSBpZiAoWydjZW50ZXInLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J10uaW5jbHVkZXMocGFydCkpIHtcbiAgICAgICAgdW5vQ2xhc3Nlcy5wdXNoKGBiZy0ke3BhcnR9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVub0NsYXNzZXM7XG4gIH1cblxuICAvKipcbiAgICogXHUwNDFGXHUwNDQwXHUwNDM1XHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDQzXHUwNDM1XHUwNDQyIENTUyBBU1QgXHUwNDM3XHUwNDNEXHUwNDMwXHUwNDQ3XHUwNDM1XHUwNDNEXHUwNDM4XHUwNDM1IFx1MDQzMiBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0M0VcdTA0M0FcdTA0NDNcbiAgICovXG4gIHN0YXRpYyBwcm9wZXJ0eVZhbHVlVG9TdHJpbmcodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgaWYgKHZhbHVlLnR5cGUgPT09ICdWYWx1ZScgJiYgdmFsdWUuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcbiAgICAgIFxuICAgICAgLy8gXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDNDIExpc3QgXHUwNDNFXHUwNDMxXHUwNDRBXHUwNDM1XHUwNDNBXHUwNDQyIFx1MDQzOFx1MDQzNyBjc3MtdHJlZVxuICAgICAgbGV0IGN1cnJlbnQgPSB2YWx1ZS5jaGlsZHJlbi5oZWFkO1xuICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjdXJyZW50LmRhdGE7XG4gICAgICAgIGxldCBjaGlsZFZhbHVlID0gJyc7XG4gICAgICAgIFxuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ1JhdycpIHtcbiAgICAgICAgICBjaGlsZFZhbHVlID0gY2hpbGQudmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQudHlwZSA9PT0gJ1N0cmluZycpIHtcbiAgICAgICAgICBjaGlsZFZhbHVlID0gYFwiJHtjaGlsZC52YWx1ZX1cImA7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQudHlwZSA9PT0gJ051bWJlcicpIHtcbiAgICAgICAgICBjaGlsZFZhbHVlID0gY2hpbGQudmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQudHlwZSA9PT0gJ0RpbWVuc2lvbicpIHtcbiAgICAgICAgICBjaGlsZFZhbHVlID0gY2hpbGQudmFsdWUgKyBjaGlsZC51bml0O1xuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnR5cGUgPT09ICdIYXNoJykge1xuICAgICAgICAgIGNoaWxkVmFsdWUgPSAnIycgKyBjaGlsZC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC50eXBlID09PSAnRnVuY3Rpb24nKSB7XG4gICAgICAgICAgLy8gXHUwNDFFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDNBXHUwNDMwIFx1MDQ0NFx1MDQ0M1x1MDQzRFx1MDQzQVx1MDQ0Nlx1MDQzOFx1MDQzOSBcdTA0NDJcdTA0MzhcdTA0M0ZcdTA0MzAgdXJsKCksIHJnYigpLCBoc2woKVxuICAgICAgICAgIGxldCBmdW5jU3RyID0gY2hpbGQubmFtZSArICcoJztcbiAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGxldCBmdW5jQ3VycmVudCA9IGNoaWxkLmNoaWxkcmVuLmhlYWQ7XG4gICAgICAgICAgICB3aGlsZSAoZnVuY0N1cnJlbnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgZnVuY0NoaWxkID0gZnVuY0N1cnJlbnQuZGF0YTtcbiAgICAgICAgICAgICAgaWYgKGZ1bmNDaGlsZC50eXBlID09PSAnU3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGZ1bmNTdHIgKz0gYFwiJHtmdW5jQ2hpbGQudmFsdWV9XCJgO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZ1bmNDaGlsZC50eXBlID09PSAnTnVtYmVyJykge1xuICAgICAgICAgICAgICAgIGZ1bmNTdHIgKz0gZnVuY0NoaWxkLnZhbHVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZ1bmNDaGlsZC50eXBlID09PSAnRGltZW5zaW9uJykge1xuICAgICAgICAgICAgICAgIGZ1bmNTdHIgKz0gZnVuY0NoaWxkLnZhbHVlICsgZnVuY0NoaWxkLnVuaXQ7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZnVuY0NoaWxkLnR5cGUgPT09ICdIYXNoJykge1xuICAgICAgICAgICAgICAgIGZ1bmNTdHIgKz0gJyMnICsgZnVuY0NoaWxkLnZhbHVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZ1bmNDaGlsZC50eXBlID09PSAnUmF3Jykge1xuICAgICAgICAgICAgICAgIGZ1bmNTdHIgKz0gZnVuY0NoaWxkLnZhbHVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZ1bmNDaGlsZC50eXBlID09PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICAgICAgICBmdW5jU3RyICs9IGZ1bmNDaGlsZC5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZ1bmNDdXJyZW50ID0gZnVuY0N1cnJlbnQubmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZnVuY1N0ciArPSAnKSc7XG4gICAgICAgICAgY2hpbGRWYWx1ZSA9IGZ1bmNTdHI7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQudHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgY2hpbGRWYWx1ZSA9IGNoaWxkLm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQudmFsdWUpIHtcbiAgICAgICAgICBjaGlsZFZhbHVlID0gY2hpbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjaGlsZFZhbHVlKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiByZXN1bHQuam9pbignICcpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogXHUwNDE4XHUwNDM3XHUwNDMyXHUwNDNCXHUwNDM1XHUwNDNBXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQzOFx1MDQzQ1x1MDQ0RiBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0MzAgXHUwNDM4XHUwNDM3IENTUyBcdTA0NDFcdTA0MzVcdTA0M0JcdTA0MzVcdTA0M0FcdTA0NDJcdTA0M0VcdTA0NDBcdTA0MzBcbiAgICovXG4gIHN0YXRpYyBleHRyYWN0Q2xhc3NOYW1lKHNlbGVjdG9yOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCBjbGFzc01hdGNoID0gc2VsZWN0b3IubWF0Y2goL1xcLihbYS16QS1aMC05Xy1dKykvKTtcbiAgICByZXR1cm4gY2xhc3NNYXRjaCA/IGNsYXNzTWF0Y2hbMV0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFx1MDQxOFx1MDQzN1x1MDQzMlx1MDQzQlx1MDQzNVx1MDQzQVx1MDQzMFx1MDQzNVx1MDQ0MiBcdTA0NDFcdTA0MzVcdTA0M0JcdTA0MzVcdTA0M0FcdTA0NDJcdTA0M0VcdTA0NDBcdTA0NEIgXHUwNDM4XHUwNDM3IENTUyBBU1RcbiAgICovXG4gIHN0YXRpYyBleHRyYWN0U2VsZWN0b3JzKHByZWx1ZGU6IGFueSk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBzZWxlY3RvcnM6IHN0cmluZ1tdID0gW107XG4gICAgXG4gICAgaWYgKHByZWx1ZGU/LmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHByZWx1ZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHNlbGVjdG9yLnR5cGUgPT09ICdTZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBzZWxlY3RvclRleHQgPSB0aGlzLnNlbGVjdG9yVG9TdHJpbmcoc2VsZWN0b3IpO1xuICAgICAgICAgIHNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yVGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0b3JzO1xuICB9XG5cbiAgLyoqXG4gICAqIFx1MDQxRlx1MDQ0MFx1MDQzNVx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQ0M1x1MDQzNVx1MDQ0MiBDU1MgQVNUIFx1MDQ0MVx1MDQzNVx1MDQzQlx1MDQzNVx1MDQzQVx1MDQ0Mlx1MDQzRVx1MDQ0MCBcdTA0MzIgXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDNFXHUwNDNBXHUwNDQzXG4gICAqL1xuICBzdGF0aWMgc2VsZWN0b3JUb1N0cmluZyhzZWxlY3RvcjogYW55KTogc3RyaW5nIHtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgXG4gICAgaWYgKHNlbGVjdG9yLmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHNlbGVjdG9yLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSAnQ2xhc3NTZWxlY3RvcicpIHtcbiAgICAgICAgICByZXN1bHQgKz0gJy4nICsgY2hpbGQubmFtZTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC50eXBlID09PSAnSWRTZWxlY3RvcicpIHtcbiAgICAgICAgICByZXN1bHQgKz0gJyMnICsgY2hpbGQubmFtZTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC50eXBlID09PSAnRWxlbWVudFNlbGVjdG9yJykge1xuICAgICAgICAgIHJlc3VsdCArPSBjaGlsZC5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnR5cGUgPT09ICdDb21iaW5hdG9yJykge1xuICAgICAgICAgIHJlc3VsdCArPSAnICcgKyBjaGlsZC5uYW1lICsgJyAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdC50cmltKCk7XG4gIH1cblxuICAvKipcbiAgICogXHUwNDE4XHUwNDM3XHUwNDMyXHUwNDNCXHUwNDM1XHUwNDNBXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzOVx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzMCBcdTA0MzhcdTA0MzcgQ1NTIEFTVCBcdTA0MzFcdTA0M0JcdTA0M0VcdTA0M0FcdTA0MzBcbiAgICovXG4gIHN0YXRpYyBleHRyYWN0UHJvcGVydGllcyhibG9jazogYW55KTogYW55W10ge1xuICAgIGNvbnN0IHByb3BlcnRpZXM6IGFueVtdID0gW107XG4gICAgXG4gICAgaWYgKGJsb2NrPy5jaGlsZHJlbikge1xuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBibG9jay5jaGlsZHJlbikge1xuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ0RlY2xhcmF0aW9uJykge1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcGVydGllcztcbiAgfVxufSAiLCAiaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCB0eXBlIHsgT3V0cHV0QXNzZXQgfSBmcm9tICdyb2xsdXAnO1xuaW1wb3J0IHsgcHJvY2Vzc0FsbFNvdXJjZXMsIHByb2Nlc3NWdWVGaWxlLCBwcm9jZXNzSHRtbEFuZENzc1N0cmluZ3MgfSBmcm9tICcuL2Z1bGwtcHJvY2Vzc29yJztcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcyc7XG5pbXBvcnQgeyBzeW5jIGFzIGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGxvYWQgfSBmcm9tICdjaGVlcmlvJztcblxuaW50ZXJmYWNlIFBsdWdpbk9wdGlvbnMge1xuICBwcmVzZXRzPzogYW55W107XG4gIHRoZW1lPzogYW55O1xuICBzaG9ydGN1dHM/OiBhbnk7XG4gIHJ1bGVzPzogYW55W107XG4gIGRldj86IGJvb2xlYW47XG59XG5cbi8vIFx1MDQxMlx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQzQ1x1MDQzRVx1MDQzM1x1MDQzMFx1MDQ0Mlx1MDQzNVx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzMFx1MDQ0RiBcdTA0NDRcdTA0NDNcdTA0M0RcdTA0M0FcdTA0NDZcdTA0MzhcdTA0NEYgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQ0MVx1MDQzMVx1MDQzRVx1MDQ0MFx1MDQzMCB1bm8tXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDNFXHUwNDMyIFx1MDQzOFx1MDQzNyBIVE1MXG5mdW5jdGlvbiBleHRyYWN0VW5vQ2xhc3Nlc0Zyb21IdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY2xhc3NTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgY2xhc3NSZWdleCA9IC9jbGFzc1xccyo9XFxzKltcIiddKFteXCInXSspW1wiJ10vZztcbiAgbGV0IG1hdGNoO1xuICB3aGlsZSAoKG1hdGNoID0gY2xhc3NSZWdleC5leGVjKGh0bWwpKSkge1xuICAgIG1hdGNoWzFdLnNwbGl0KC9cXHMrLykuZm9yRWFjaChjbHMgPT4gY2xhc3NTZXQuYWRkKGNscykpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGNsYXNzU2V0KTtcbn1cblxuLy8gXHUwNDEyXHUwNDQxXHUwNDNGXHUwNDNFXHUwNDNDXHUwNDNFXHUwNDMzXHUwNDMwXHUwNDQyXHUwNDM1XHUwNDNCXHUwNDRDXHUwNDNEXHUwNDMwXHUwNDRGIFx1MDQ0NFx1MDQ0M1x1MDQzRFx1MDQzQVx1MDQ0Nlx1MDQzOFx1MDQ0RiBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDMxXHUwNDNFXHUwNDQwXHUwNDMwIHVuby1cdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0NDFcdTA0M0VcdTA0MzIgXHUwNDM4XHUwNDM3IEpTXG5mdW5jdGlvbiBleHRyYWN0VW5vQ2xhc3Nlc0Zyb21Kcyhqczogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCBjbGFzc1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAvLyBcdTA0MUZcdTA0NDBcdTA0MzhcdTA0M0NcdTA0MzhcdTA0NDJcdTA0MzhcdTA0MzJcdTA0M0RcdTA0MzBcdTA0NEYgXHUwNDQwXHUwNDM1XHUwNDMzXHUwNDQzXHUwNDNCXHUwNDRGXHUwNDQwXHUwNDNBXHUwNDMwIFx1MDQzNFx1MDQzQlx1MDQ0RiB1bm8tXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDNFXHUwNDMyIChcdTA0M0NcdTA0M0VcdTA0MzZcdTA0M0RcdTA0M0UgXHUwNDM0XHUwNDNFXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDMwXHUwNDQyXHUwNDRDKVxuICBjb25zdCB1bm9SZWdleCA9IC9bJ1wiXShbXFx3LTpcXFtcXF0jXFwvLiVdKylbJ1wiXS9nO1xuICBsZXQgbWF0Y2g7XG4gIHdoaWxlICgobWF0Y2ggPSB1bm9SZWdleC5leGVjKGpzKSkpIHtcbiAgICBpZiAoXG4gICAgICAvXihiZy18dGV4dC18bS18cC18dy18aC18Y29sb3ItfGZvbnQtfHJvdW5kZWQtfGl0ZW1zLXxqdXN0aWZ5LXxmbGV4fGJvcmRlci18c2hhZG93fG9wYWNpdHl8ei18Z2FwLXxncmlkLXxjb2wtfHJvdy18b3JkZXItfHNlbGYtfGNvbnRlbnQtfGxlYWRpbmctfHRyYWNraW5nLXxhbGlnbi18b2JqZWN0LXxvdmVyZmxvdy18Y3Vyc29yLXxzZWxlY3QtfHBvaW50ZXItZXZlbnRzLXx0cmFuc2l0aW9ufGR1cmF0aW9ufGVhc2V8ZGVsYXl8YW5pbWF0ZXxhc3BlY3QtfHRvcHxyaWdodHxib3R0b218bGVmdHx2aXNpYmxlfGZsb2F0fGNsZWFyfHJlc2l6ZXxsaXN0fGFwcGVhcmFuY2V8b3V0bGluZXxmaWx0ZXJ8YmFja2Ryb3B8YmxlbmR8Ym94fGNvbnRlbnR8d3JpdGluZ3x3aGl0ZXNwYWNlfGJyZWFrfHVuZGVybGluZXxkZWNvcmF0aW9ufGluZGVudHx0YWJ8Y2FyZXR8c3Ryb2tlfGZpbGx8c2NhbGV8cm90YXRlfHRyYW5zbGF0ZXxza2V3KS8udGVzdChcbiAgICAgICAgbWF0Y2hbMV1cbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNsYXNzU2V0LmFkZChtYXRjaFsxXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGNsYXNzU2V0KTtcbn1cblxuZnVuY3Rpb24gaXNBc3NldChmaWxlOiB1bmtub3duKTogZmlsZSBpcyBPdXRwdXRBc3NldCB7XG4gIHJldHVybiAhIWZpbGUgJiYgdHlwZW9mIGZpbGUgPT09ICdvYmplY3QnICYmIChmaWxlIGFzIGFueSkudHlwZSA9PT0gJ2Fzc2V0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFVub0NTU1BsdWdpbihvcHRpb25zOiBQbHVnaW5PcHRpb25zID0ge30pOiBQbHVnaW4ge1xuICAvLyBcdTA0MUZcdTA0M0JcdTA0MzBcdTA0MzNcdTA0MzhcdTA0M0QgXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQyXHUwNDMwXHUwNDM1XHUwNDQyIFx1MDQ0Mlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzQVx1MDQzRSBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDMxXHUwNDNFXHUwNDQwXHUwNDNBXHUwNDM4ICh2aXRlIGJ1aWxkKVxuICBjb25zdCBiYXNlOiBQbHVnaW4gPSB7XG4gICAgbmFtZTogJ3ZpdGUtcGx1Z2luLXVub2Nzcy1jc3MnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICBhcHBseTogJ2J1aWxkJyxcbiAgfTtcblxuICBsZXQgdW5vQ3NzSHRtbCA9ICcnO1xuICBsZXQgdW5vQ3NzUmF3ID0gJyc7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5iYXNlLFxuICAgIGFzeW5jIGdlbmVyYXRlQnVuZGxlKF9vcHRpb25zOiBhbnksIGJ1bmRsZTogYW55KSB7XG4gICAgICAvLyBcdTA0MURcdTA0MzBcdTA0NDVcdTA0M0VcdTA0MzRcdTA0MzhcdTA0M0MgSFRNTCBcdTA0MzggQ1NTIFx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQzNVx1MDQ0Mlx1MDQ0QiBcdTA0MzIgYnVuZGxlXG4gICAgICBsZXQgaHRtbEFzc2V0OiBPdXRwdXRBc3NldCB8IG51bGwgPSBudWxsO1xuICAgICAgbGV0IGNzc0Fzc2V0OiBPdXRwdXRBc3NldCB8IG51bGwgPSBudWxsO1xuICAgICAgbGV0IGh0bWxGaWxlTmFtZSA9ICcnO1xuICAgICAgZm9yIChjb25zdCBbZmlsZU5hbWUsIGZpbGVdIG9mIE9iamVjdC5lbnRyaWVzKGJ1bmRsZSkpIHtcbiAgICAgICAgaWYgKGlzQXNzZXQoZmlsZSkgJiYgZmlsZU5hbWUuZW5kc1dpdGgoJy5odG1sJykpIHtcbiAgICAgICAgICBodG1sQXNzZXQgPSBmaWxlIGFzIE91dHB1dEFzc2V0O1xuICAgICAgICAgIGh0bWxGaWxlTmFtZSA9IGZpbGVOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0Fzc2V0KGZpbGUpICYmIGZpbGVOYW1lLmVuZHNXaXRoKCcuY3NzJykgJiYgZmlsZU5hbWUgIT09ICd1bm9jc3MtZ2VuZXJhdGVkLmNzcycpIHtcbiAgICAgICAgICBjc3NBc3NldCA9IGZpbGUgYXMgT3V0cHV0QXNzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFx1MDQxNVx1MDQ0MVx1MDQzQlx1MDQzOCBcdTA0MzVcdTA0NDFcdTA0NDJcdTA0NEMgXHUwNDNFXHUwNDMxXHUwNDMwIFx1MDQ0NFx1MDQzMFx1MDQzOVx1MDQzQlx1MDQzMCwgXHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDQyXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDM1XHUwNDNDIFx1MDQzOFx1MDQ0NVxuICAgICAgaWYgKGh0bWxBc3NldCAmJiBjc3NBc3NldCkge1xuICAgICAgICBjb25zdCBodG1sUmF3ID0gaHRtbEFzc2V0LnNvdXJjZT8udG9TdHJpbmcoKSB8fCAnJztcbiAgICAgICAgY29uc3QgY3NzUmF3ID0gY3NzQXNzZXQuc291cmNlPy50b1N0cmluZygpIHx8ICcnO1xuICAgICAgICAvLyBcdTA0MUVcdTA0MzFcdTA0NDBcdTA0MzBcdTA0MzFcdTA0MzBcdTA0NDJcdTA0NEJcdTA0MzJcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDNEXHUwNDMwXHUwNDNGXHUwNDQwXHUwNDRGXHUwNDNDXHUwNDQzXHUwNDRFIFx1MDQ0N1x1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNyBwcm9jZXNzSHRtbEFuZENzc1N0cmluZ3NcbiAgICAgICAgY29uc3QgeyBodG1sLCBjc3MgfSA9IGF3YWl0IHByb2Nlc3NIdG1sQW5kQ3NzU3RyaW5ncyhodG1sUmF3LCBjc3NSYXcpO1xuICAgICAgICB1bm9Dc3NIdG1sID0gaHRtbDtcbiAgICAgICAgdW5vQ3NzUmF3ID0gY3NzO1xuICAgICAgICAvLyBcdTA0MjFcdTA0M0VcdTA0NDVcdTA0NDBcdTA0MzBcdTA0M0RcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDQ0XHUwNDM4XHUwNDNEXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDRCXHUwNDM5IENTU1xuICAgICAgICBidW5kbGVbJ3Vub2Nzcy1nZW5lcmF0ZWQuY3NzJ10gPSB7XG4gICAgICAgICAgdHlwZTogJ2Fzc2V0JyxcbiAgICAgICAgICBmaWxlTmFtZTogJ3Vub2Nzcy1nZW5lcmF0ZWQuY3NzJyxcbiAgICAgICAgICBzb3VyY2U6IGNzcyxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gXHUwNDIxXHUwNDNFXHUwNDQ1XHUwNDQwXHUwNDMwXHUwNDNEXHUwNDRGXHUwNDM1XHUwNDNDIFx1MDQzOFx1MDQzN1x1MDQzQ1x1MDQzNVx1MDQzRFx1MDQ1MVx1MDQzRFx1MDQzRFx1MDQ0Qlx1MDQzOSBIVE1MXG4gICAgICAgIGlmIChodG1sRmlsZU5hbWUgJiYgYnVuZGxlW2h0bWxGaWxlTmFtZV0pIHtcbiAgICAgICAgICAoYnVuZGxlW2h0bWxGaWxlTmFtZV0gYXMgT3V0cHV0QXNzZXQpLnNvdXJjZSA9IGh0bWw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gXHUwNDIzXHUwNDM0XHUwNDMwXHUwNDNCXHUwNDRGXHUwNDM1XHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNSBcdTA0M0VcdTA0NDBcdTA0MzhcdTA0MzNcdTA0MzhcdTA0M0RcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0NEJcdTA0MzUgQ1NTLVx1MDQ0NFx1MDQzMFx1MDQzOVx1MDQzQlx1MDQ0QiBcdTA0M0FcdTA0NDBcdTA0M0VcdTA0M0NcdTA0MzUgdW5vLWNzc1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGVOYW1lIG9mIE9iamVjdC5rZXlzKGJ1bmRsZSkpIHtcbiAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoJy5jc3MnKSAmJiBmaWxlTmFtZSAhPT0gJ3Vub2Nzcy1nZW5lcmF0ZWQuY3NzJykge1xuICAgICAgICAgICAgZGVsZXRlIGJ1bmRsZVtmaWxlTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm1JbmRleEh0bWwoaHRtbDogc3RyaW5nKSB7XG4gICAgICAvLyBcdTA0MTVcdTA0NDFcdTA0M0JcdTA0MzggXHUwNDQzXHUwNDM2XHUwNDM1IFx1MDQzRVx1MDQzMVx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0Mlx1MDQzMFx1MDQzQlx1MDQzOCBIVE1MLCBcdTA0MzJcdTA0M0VcdTA0MzdcdTA0MzJcdTA0NDBcdTA0MzBcdTA0NDlcdTA0MzBcdTA0MzVcdTA0M0MgXHUwNDM1XHUwNDMzXHUwNDNFXG4gICAgICBpZiAodW5vQ3NzSHRtbCkge1xuICAgICAgICAvLyBcdTA0MThcdTA0NDFcdTA0M0ZcdTA0NDBcdTA0MzBcdTA0MzJcdTA0M0JcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDNGXHUwNDNFXHUwNDM0XHUwNDNBXHUwNDNCXHUwNDRFXHUwNDQ3XHUwNDM1XHUwNDNEXHUwNDM4XHUwNDM1IENTUzogXHUwNDQzXHUwNDM0XHUwNDMwXHUwNDNCXHUwNDRGXHUwNDM1XHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNSA8bGluayByZWw9XCJzdHlsZXNoZWV0XCI+IFx1MDQzOCBcdTA0MzRcdTA0M0VcdTA0MzFcdTA0MzBcdTA0MzJcdTA0M0JcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDNGXHUwNDQwXHUwNDMwXHUwNDMyXHUwNDM4XHUwNDNCXHUwNDRDXHUwNDNEXHUwNDRCXHUwNDM5IHVuby1jc3NcbiAgICAgICAgY29uc3QgJCA9IGxvYWQodW5vQ3NzSHRtbCk7XG4gICAgICAgICQoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpLnJlbW92ZSgpO1xuICAgICAgICAkKCdoZWFkJykuYXBwZW5kKCc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi91bm9jc3MtZ2VuZXJhdGVkLmNzc1wiIC8+Jyk7XG4gICAgICAgIHJldHVybiAkLmh0bWwoKTtcbiAgICAgIH1cbiAgICAgIC8vIFx1MDQxMiBcdTA0M0ZcdTA0NDBcdTA0M0VcdTA0NDJcdTA0MzhcdTA0MzJcdTA0M0RcdTA0M0VcdTA0M0MgXHUwNDQxXHUwNDNCXHUwNDQzXHUwNDQ3XHUwNDMwXHUwNDM1IFx1MDQzMlx1MDQzRVx1MDQzN1x1MDQzMlx1MDQ0MFx1MDQzMFx1MDQ0OVx1MDQzMFx1MDQzNVx1MDQzQyBcdTA0MzhcdTA0NDFcdTA0NDVcdTA0M0VcdTA0MzRcdTA0M0RcdTA0NEJcdTA0MzkgaHRtbFxuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfSxcbiAgICAvLyBcdTA0MTRcdTA0M0VcdTA0MzFcdTA0MzBcdTA0MzJcdTA0NENcdTA0NDJcdTA0MzUgXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDRCXHUwNDM1IFx1MDQ0NVx1MDQ0M1x1MDQzQVx1MDQzOCBcdTA0MzBcdTA0M0RcdTA0MzBcdTA0M0JcdTA0M0VcdTA0MzNcdTA0MzhcdTA0NDdcdTA0M0RcdTA0M0UsIFx1MDQzNVx1MDQ0MVx1MDQzQlx1MDQzOCBcdTA0M0RcdTA0NDNcdTA0MzZcdTA0M0RcdTA0M0VcbiAgfTtcbn0gIiwgImltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IFVub0NTU1BsdWdpbiB9IGZyb20gJy4vcGx1Z2luJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVub2Nzc0NTU1BsdWdpbihvcHRpb25zPzoge1xyXG4gIHByZXNldHM/OiBhbnlbXTtcclxuICB0aGVtZT86IGFueTtcclxuICBzaG9ydGN1dHM/OiBhbnk7XHJcbiAgcnVsZXM/OiBhbnlbXTtcclxufSk6IFBsdWdpbiB7XHJcbiAgcmV0dXJuIFVub0NTU1BsdWdpbihvcHRpb25zKTtcclxufVxyXG5cclxuZXhwb3J0IHsgVW5vQ1NTUGx1Z2luIH07ICJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVcsU0FBUyxvQkFBb0I7QUFDaFksT0FBTyxTQUFTOzs7QUNEYyxPQUFBLGFBQUE7QUFDOUIsWUFBWSxhQUFhO0FBR3pCLFNBQVMsU0FBUyxnQkFBZ0I7OztBQ0czQixJQUFNLG1CQUFrQzs7RUFFN0Msb0JBQW9CO0VBQ3BCLFNBQVM7RUFDVCxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFD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
