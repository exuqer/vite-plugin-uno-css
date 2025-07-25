// Общие утилиты для обработки CSS и UnoCSS
/**
 * Преобразует CSS свойство в UnoCSS класс
 */
export function convertPropertyToUnoClass(property, value) {
    const trimmedValue = value.trim();
    // Display
    if (property === 'display') {
        const displayMap = {
            'flex': 'flex',
            'grid': 'grid',
            'block': 'block',
            'inline': 'inline',
            'inline-block': 'inline-block',
            'none': 'hidden',
        };
        const unoClass = displayMap[trimmedValue];
        return unoClass ? [unoClass] : null;
    }
    // Position
    if (property === 'position') {
        const positionMap = {
            'relative': 'relative',
            'absolute': 'absolute',
            'fixed': 'fixed',
            'sticky': 'sticky',
            'static': 'static',
        };
        const unoClass = positionMap[trimmedValue];
        return unoClass ? [unoClass] : null;
    }
    // background и background-image
    if ((property === 'background' || property === 'background-image')) {
        // Ищем url(...) с кавычками или без
        const urlMatch = trimmedValue.match(/url\(['"]?([^'")]+)['"]?\)/);
        if (urlMatch) {
            const unoClass = `bg-[url(${urlMatch[1]})]`;
            return [unoClass];
        }
        // Если это просто URL без url() обертки (начинается с http/https)
        if (/^https?:\/\//.test(trimmedValue)) {
            const unoClass = `bg-[url(${trimmedValue})]`;
            return [unoClass];
        }
        // Если это просто цвет, пробуем как цвет
        if (/^#/.test(trimmedValue) || /^rgb|^hsl/.test(trimmedValue) || /^[a-zA-Z]+$/.test(trimmedValue)) {
            const unoClass = `bg-[${trimmedValue}]`;
            return [unoClass];
        }
        // Иначе не создаём класс
        return null;
    }
    // background-color (только если это валидный цвет)
    if (property === 'background-color') {
        if (/^#/.test(trimmedValue))
            return [`bg-[${trimmedValue}]`];
        if (/^rgb|^hsl/.test(trimmedValue)) {
            const val = trimmedValue.replace(/,\s+/g, ',');
            return [`bg-[${val}]`];
        }
        if (/^[a-zA-Z]+$/.test(trimmedValue))
            return [`bg-[${trimmedValue}]`];
        // Не цвет — не создаём класс
        return null;
    }
    // color
    if (property === 'color') {
        if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
            return [`text-[${trimmedValue}]`];
        if (/^#/.test(trimmedValue))
            return [`text-[${trimmedValue}]`];
        if (/^rgb|^hsl/.test(trimmedValue)) {
            const val = trimmedValue.replace(/,\s+/g, ',');
            return [`text-[${val}]`];
        }
        if (/^[a-zA-Z]+$/.test(trimmedValue))
            return [`text-[${trimmedValue}]`];
        return [`text-[${trimmedValue}]`];
    }
    // border-radius
    if (property === 'border-radius') {
        if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
            return [`rounded-[${trimmedValue}]`];
        const unoRadiusMap = {
            '4px': 'rounded',
            '8px': 'rounded-md',
            '12px': 'rounded-lg',
            '9999px': 'rounded-full',
        };
        if (unoRadiusMap[trimmedValue])
            return [unoRadiusMap[trimmedValue]];
        return [`rounded-[${trimmedValue}]`];
    }
    // font-weight
    if (property === 'font-weight') {
        const unoWeightMap = {
            'bold': 'font-bold',
            'normal': 'font-normal',
            '600': 'font-semibold',
            '700': 'font-bold',
            '400': 'font-normal',
        };
        if (unoWeightMap[trimmedValue])
            return [unoWeightMap[trimmedValue]];
        return [`font-[${trimmedValue}]`];
    }
    // font-size
    if (property === 'font-size') {
        if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
            return [`text-[${trimmedValue}]`];
        const unoSizeMap = {
            '16px': 'text-base',
            '18px': 'text-lg',
            '20px': 'text-xl',
            '24px': 'text-2xl',
            '32px': 'text-4xl',
            '12px': 'text-xs',
            '14px': 'text-sm',
        };
        if (unoSizeMap[trimmedValue])
            return [unoSizeMap[trimmedValue]];
        return [`text-[${trimmedValue}]`];
    }
    // text-align
    if (property === 'text-align') {
        const alignMap = {
            'center': 'text-center',
            'left': 'text-left',
            'right': 'text-right',
            'justify': 'text-justify',
            'start': 'text-start',
            'end': 'text-end'
        };
        return alignMap[trimmedValue] ? [alignMap[trimmedValue]] : [`text-[${trimmedValue}]`];
    }
    // border-width
    if (property === 'border-width') {
        const unoBorderWidthMap = {
            '1px': 'border',
            '2px': 'border-2',
            '4px': 'border-4',
            '8px': 'border-8',
        };
        if (unoBorderWidthMap[trimmedValue])
            return [unoBorderWidthMap[trimmedValue]];
        return [`border-[${trimmedValue}]`];
    }
    // border-style
    if (property === 'border-style') {
        const unoBorderStyleMap = {
            'solid': 'border-solid',
            'dashed': 'border-dashed',
            'dotted': 'border-dotted',
            'double': 'border-double',
            'none': 'border-none',
        };
        if (unoBorderStyleMap[trimmedValue])
            return [unoBorderStyleMap[trimmedValue]];
        return [`border-[${trimmedValue}]`];
    }
    // border-color
    if (property === 'border-color') {
        if (/^#/.test(trimmedValue))
            return [`border-[${trimmedValue}]`];
        if (/^rgb|^hsl/.test(trimmedValue)) {
            const val = trimmedValue.replace(/,\s+/g, ',');
            return [`border-[${val}]`];
        }
        if (/^[a-zA-Z]+$/.test(trimmedValue))
            return [`border-[${trimmedValue}]`];
        return [`border-[${trimmedValue}]`];
    }
    // width/height с поддержкой calc() и 100%
    if (property === 'width') {
        if (trimmedValue === '100')
            return null;
        if (trimmedValue === '100%')
            return ['w-full'];
        if (trimmedValue === '100vw')
            return ['w-screen'];
        if (/^calc\(.+\)$/.test(trimmedValue))
            return [`w-[${trimmedValue}]`];
        if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
            return [`w-[${trimmedValue}]`];
        return [`w-[${trimmedValue}]`];
    }
    if (property === 'height') {
        if (trimmedValue === '100')
            return null;
        if (trimmedValue === '100%')
            return ['h-full'];
        if (trimmedValue === '100vh')
            return ['h-screen'];
        if (/^calc\(.+\)$/.test(trimmedValue))
            return [`h-[${trimmedValue}]`];
        if (/^-?\d+(\.\d+)?px$/.test(trimmedValue))
            return [`h-[${trimmedValue}]`];
        return [`h-[${trimmedValue}]`];
    }
    // margin/padding (шорткаты)
    if (property === 'margin' || property === 'padding') {
        return processShorthandProperty(property, trimmedValue);
    }
    if (property === 'margin-top')
        return [`mt-[${trimmedValue}]`];
    if (property === 'margin-right')
        return [`mr-[${trimmedValue}]`];
    if (property === 'margin-bottom')
        return [`mb-[${trimmedValue}]`];
    if (property === 'margin-left')
        return [`ml-[${trimmedValue}]`];
    if (property === 'padding-top')
        return [`pt-[${trimmedValue}]`];
    if (property === 'padding-right')
        return [`pr-[${trimmedValue}]`];
    if (property === 'padding-bottom')
        return [`pb-[${trimmedValue}]`];
    if (property === 'padding-left')
        return [`pl-[${trimmedValue}]`];
    // border (шорткат)
    if (property === 'border') {
        // Ожидаем формат: '2px solid #333' или подобное
        const parts = trimmedValue.split(/\s+/);
        const unoClasses = [];
        for (const part of parts) {
            if (["solid", "dashed", "dotted", "double", "none"].includes(part)) {
                unoClasses.push(`border-${part}`);
            }
            else if (/^\d+(px|em|rem)?$/.test(part)) {
                const unoBorderWidthMap = {
                    '1px': 'border',
                    '2px': 'border-2',
                    '4px': 'border-4',
                    '8px': 'border-8',
                };
                unoClasses.push(unoBorderWidthMap[part] || `border-[${part}]`);
            }
            else if (part.startsWith('#') || part.startsWith('rgb') || part.startsWith('hsl')) {
                unoClasses.push(`border-[${part}]`);
            }
        }
        return unoClasses.length > 0 ? unoClasses : null;
    }
    // box-shadow
    if (property === 'box-shadow') {
        return [`shadow-[${trimmedValue}]`];
    }
    // opacity
    if (property === 'opacity') {
        return [`opacity-[${trimmedValue}]`];
    }
    // z-index
    if (property === 'z-index') {
        return [`z-[${trimmedValue}]`];
    }
    // overflow
    if (property === 'overflow') {
        return [`overflow-[${trimmedValue}]`];
    }
    // text-decoration
    if (property === 'text-decoration') {
        return [`text-decoration-[${trimmedValue}]`];
    }
    // fallback
    return [`[${property}:${trimmedValue}]`];
}
/**
 * Обрабатывает сокращённые свойства margin/padding
 */
function processShorthandProperty(property, value) {
    const parts = value.split(/\s+/);
    const unoClasses = [];
    const prefix = property[0]; // 'm' для margin, 'p' для padding
    function format(val) {
        return `[${val}]`;
    }
    if (parts.length === 1) {
        unoClasses.push(`${prefix}-${format(parts[0])}`);
    }
    else if (parts.length === 2) {
        unoClasses.push(`${prefix}y-${format(parts[0])}`);
        unoClasses.push(`${prefix}x-${format(parts[1])}`);
    }
    else if (parts.length === 3) {
        unoClasses.push(`${prefix}t-${format(parts[0])}`);
        unoClasses.push(`${prefix}x-${format(parts[1])}`);
        unoClasses.push(`${prefix}b-${format(parts[2])}`);
    }
    else if (parts.length === 4) {
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
export function propertyValueToString(value) {
    if (value.type === 'Value' && value.children) {
        const result = [];
        // Обрабатываем List объект из css-tree
        let current = value.children.head;
        while (current) {
            const child = current.data;
            let childValue = '';
            if (child.type === 'Raw') {
                childValue = child.value;
            }
            else if (child.type === 'String') {
                childValue = `"${child.value}"`;
            }
            else if (child.type === 'Number') {
                childValue = child.value;
            }
            else if (child.type === 'Dimension') {
                if (child.unit === '%') {
                    childValue = child.value + '%';
                }
                else {
                    childValue = child.value + child.unit;
                }
            }
            else if (child.type === 'Hash') {
                childValue = '#' + child.value;
            }
            else if (child.type === 'Function') {
                // Обработка функций типа url(), rgb(), hsl(), calc()
                if (/^(rgb|rgba|hsl|hsla)$/i.test(child.name)) {
                    // Собираем значения с запятыми
                    let args = [];
                    if (child.children) {
                        let funcCurrent = child.children.head;
                        while (funcCurrent) {
                            const funcChild = funcCurrent.data;
                            if (funcChild.type === 'Number') {
                                args.push(funcChild.value);
                            }
                            else if (funcChild.type === 'Dimension') {
                                args.push(funcChild.value + funcChild.unit);
                            }
                            else if (funcChild.type === 'Hash') {
                                args.push('#' + funcChild.value);
                            }
                            else if (funcChild.type === 'Raw') {
                                args.push(funcChild.value);
                            }
                            else if (funcChild.type === 'Identifier') {
                                args.push(funcChild.name);
                            }
                            else if (funcChild.type === 'String') {
                                args.push('"' + funcChild.value + '"');
                            }
                            funcCurrent = funcCurrent.next;
                        }
                    }
                    childValue = `${child.name}(${args.join(',')})`;
                }
                else if (/^url$/i.test(child.name)) {
                    // url(...) — сохраняем кавычки, если есть
                    let urlArg = '';
                    if (child.children && child.children.head) {
                        const urlChild = child.children.head.data;
                        if (urlChild.type === 'String') {
                            urlArg = `"${urlChild.value}"`;
                        }
                        else if (urlChild.value) {
                            urlArg = urlChild.value;
                        }
                    }
                    childValue = `url(${urlArg})`;
                }
                else if (/^calc$/i.test(child.name)) {
                    // calc(...) — собираем выражение с пробелами и операторами
                    let funcStr = 'calc(';
                    if (child.children) {
                        let funcCurrent = child.children.head;
                        while (funcCurrent) {
                            const funcChild = funcCurrent.data;
                            if (funcChild.type === 'String') {
                                funcStr += `"${funcChild.value}"`;
                            }
                            else if (funcChild.type === 'Number') {
                                funcStr += funcChild.value;
                            }
                            else if (funcChild.type === 'Dimension') {
                                funcStr += funcChild.value + funcChild.unit;
                            }
                            else if (funcChild.type === 'Hash') {
                                funcStr += '#' + funcChild.value;
                            }
                            else if (funcChild.type === 'Raw') {
                                funcStr += funcChild.value;
                            }
                            else if (funcChild.type === 'Identifier') {
                                funcStr += funcChild.name;
                            }
                            else if (funcChild.type === 'Operator') {
                                funcStr += ' ' + funcChild.value + ' ';
                            }
                            funcCurrent = funcCurrent.next;
                        }
                    }
                    funcStr += ')';
                    childValue = funcStr;
                }
                else {
                    let funcStr = child.name + '(';
                    if (child.children) {
                        let funcCurrent = child.children.head;
                        while (funcCurrent) {
                            const funcChild = funcCurrent.data;
                            if (funcChild.type === 'String') {
                                funcStr += `"${funcChild.value}"`;
                            }
                            else if (funcChild.type === 'Number') {
                                funcStr += funcChild.value;
                            }
                            else if (funcChild.type === 'Dimension') {
                                funcStr += funcChild.value + funcChild.unit;
                            }
                            else if (funcChild.type === 'Hash') {
                                funcStr += '#' + funcChild.value;
                            }
                            else if (funcChild.type === 'Raw') {
                                funcStr += funcChild.value;
                            }
                            else if (funcChild.type === 'Identifier') {
                                funcStr += funcChild.name;
                            }
                            else if (funcChild.type === 'Operator') {
                                funcStr += ' ' + funcChild.value + ' ';
                            }
                            funcCurrent = funcCurrent.next;
                        }
                    }
                    funcStr += ')';
                    childValue = funcStr;
                }
            }
            else if (child.type === 'Identifier') {
                childValue = child.name;
            }
            else if (child.value) {
                childValue = child.value;
            }
            if (childValue) {
                result.push(childValue);
            }
            current = current.next;
        }
        return result.join(' ');
    }
    return '';
}
/**
 * Извлекает имя класса из CSS селектора
 */
export function extractClassName(selector) {
    const classMatch = selector.match(/\.([a-zA-Z0-9_-]+)/);
    return classMatch ? classMatch[1] : null;
}
/**
 * Извлекает селекторы из CSS AST
 */
export function extractSelectors(prelude) {
    const selectors = [];
    if (prelude?.children) {
        for (const selector of prelude.children) {
            if (selector.type === 'Selector') {
                const selectorText = selectorToString(selector);
                selectors.push(selectorText);
            }
        }
    }
    return selectors;
}
/**
 * Преобразует CSS AST селектор в строку
 */
function selectorToString(selector) {
    let result = '';
    if (selector.children) {
        for (const child of selector.children) {
            if (child.type === 'ClassSelector') {
                result += '.' + child.name;
            }
            else if (child.type === 'IdSelector') {
                result += '#' + child.name;
            }
            else if (child.type === 'ElementSelector') {
                result += child.name;
            }
            else if (child.type === 'Combinator') {
                result += ' ' + child.name + ' ';
            }
        }
    }
    return result.trim();
}
/**
 * Извлекает свойства из CSS AST блока
 */
export function extractProperties(block) {
    const properties = [];
    if (block?.children) {
        for (const child of block.children) {
            if (child.type === 'Declaration') {
                properties.push(child);
            }
        }
    }
    return properties;
}
//# sourceMappingURL=utils.js.map