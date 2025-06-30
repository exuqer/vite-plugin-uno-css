// Общие утилиты для обработки CSS и UnoCSS
// Единый маппинг UnoCSS свойств
export const UNO_PROPERTY_MAP = {
    // Цветовые
    'background-color': 'bg-color',
    'color': 'color',
    'border-color': 'border',
    'outline-color': 'outline',
    'text-decoration-color': 'decoration',
    'column-rule-color': 'column-rule',
    'caret-color': 'caret',
    'fill': 'fill',
    'stroke': 'stroke',
    'accent-color': 'accent',
    'border-top-color': 'border-t',
    'border-right-color': 'border-r',
    'border-bottom-color': 'border-b',
    'border-left-color': 'border-l',
    // Размеры
    'width': 'w',
    'min-width': 'min-w',
    'max-width': 'max-w',
    'height': 'h',
    'min-height': 'min-h',
    'max-height': 'max-h',
    // Отступы
    'margin': 'm',
    'margin-top': 'mt',
    'margin-right': 'mr',
    'margin-bottom': 'mb',
    'margin-left': 'ml',
    'padding': 'p',
    'padding-top': 'pt',
    'padding-right': 'pr',
    'padding-bottom': 'pb',
    'padding-left': 'pl',
    // Flex/Grid
    'display': '', // handled separately
    'flex-direction': 'flex',
    'flex-wrap': 'flex',
    'flex-grow': 'grow',
    'flex-shrink': 'shrink',
    'flex-basis': 'basis',
    'justify-content': 'justify',
    'align-items': 'items',
    'align-self': 'self',
    'align-content': 'content',
    'order': 'order',
    'gap': 'gap',
    'row-gap': 'row-gap',
    'column-gap': 'col-gap',
    // Grid
    'grid-template-columns': 'grid-cols',
    'grid-template-rows': 'grid-rows',
    'grid-column': 'col',
    'grid-row': 'row',
    'grid-auto-flow': 'grid-flow',
    // Border
    'border-radius': 'rounded',
    'border-width': 'border',
    'border-style': 'border',
    // Текст
    'font-size': 'text',
    'font-weight': 'font',
    'font-family': 'font',
    'line-height': 'leading',
    'letter-spacing': 'tracking',
    'text-align': 'text',
    'text-transform': 'uppercase',
    'vertical-align': 'align',
    // Прочее
    'opacity': 'opacity',
    'box-shadow': 'shadow',
    'z-index': 'z',
    'overflow': 'overflow',
    'overflow-x': 'overflow-x',
    'overflow-y': 'overflow-y',
    'object-fit': 'object',
    'object-position': 'object',
    'background-image': 'bg-image',
    'background-position': 'bg',
    'background-size': 'bg',
    'background-repeat': 'bg',
    'background-clip': 'bg',
    'background-attachment': 'bg',
    'cursor': 'cursor',
    'user-select': 'select',
    'pointer-events': 'pointer-events',
    'transition': 'transition',
    'transition-property': 'transition',
    'transition-duration': 'duration',
    'transition-timing-function': 'ease',
    'transition-delay': 'delay',
    'animation': 'animate',
    'animation-name': 'animate',
    'animation-duration': 'duration',
    'animation-timing-function': 'ease',
    'animation-delay': 'delay',
    'animation-iteration-count': 'repeat',
    'animation-direction': 'direction',
    'animation-fill-mode': 'fill-mode',
    'animation-play-state': 'play',
    'isolation': 'isolate',
    'position': '', // handled separately
    'top': 'top',
    'right': 'right',
    'bottom': 'bottom',
    'left': 'left',
    'visibility': 'visible',
    'float': 'float',
    'clear': 'clear',
    'resize': 'resize',
    'list-style-type': 'list',
    'list-style-position': 'list',
    'appearance': 'appearance',
    'outline': 'outline',
    'outline-width': 'outline',
    'outline-style': 'outline',
    'outline-offset': 'outline-offset',
    'filter': 'filter',
    'backdrop-filter': 'backdrop',
    'mix-blend-mode': 'blend',
    'background-blend-mode': 'bg-blend',
    'box-sizing': 'box',
    'content-visibility': 'content',
    'aspect-ratio': 'aspect',
    'writing-mode': 'writing',
    'white-space': 'whitespace',
    'word-break': 'break',
    'overflow-wrap': 'break',
    'text-overflow': 'text-ellipsis',
    'text-decoration': 'underline',
    'text-decoration-style': 'decoration',
    'text-decoration-thickness': 'decoration',
    'text-underline-offset': 'underline-offset',
    'text-indent': 'indent',
    'tab-size': 'tab',
    'caret-shape': 'caret',
    'stroke-width': 'stroke',
    'stroke-dasharray': 'stroke',
    'stroke-dashoffset': 'stroke',
    'fill-opacity': 'fill',
    'stroke-opacity': 'stroke',
    'backface-visibility': 'backface',
    'perspective': 'perspective',
    'perspective-origin': 'perspective',
    'transform': 'transform',
    'transform-origin': 'origin',
    'scale': 'scale',
    'rotate': 'rotate',
    'translate': 'translate',
    'skew': 'skew',
};
export class CSSUtils {
    /**
     * Преобразует CSS свойство в UnoCSS класс
     */
    static convertPropertyToUnoClass(property, value) {
        const trimmedValue = value.trim();
        // Специальная обработка display
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
        // Специальная обработка position
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
        // Специальная обработка background-image
        if (property === 'background-image') {
            if (trimmedValue.startsWith('url(')) {
                return [`bg-image-[${trimmedValue}]`];
            }
            else if (trimmedValue.startsWith('http')) {
                return [`bg-image-[url(${trimmedValue})]`];
            }
            else {
                return [`bg-image-[${trimmedValue}]`];
            }
        }
        // Специальная обработка цветовых свойств согласно документации
        if (property === 'background-color') {
            if (trimmedValue.startsWith('#')) {
                return [`bg-color-[${trimmedValue}]`];
            }
            if (trimmedValue.startsWith('rgb') || trimmedValue.startsWith('hsl')) {
                return [`bg-color-[${trimmedValue}]`];
            }
            // Для именованных цветов
            const namedColors = {
                'red': 'red-500',
                'green': 'green-500',
                'blue': 'blue-500',
                'black': 'black',
                'white': 'white',
                'gray': 'gray-500',
                'yellow': 'yellow-500',
                'orange': 'orange-500',
                'purple': 'purple-500',
                'pink': 'pink-500'
            };
            const colorClass = namedColors[trimmedValue];
            if (colorClass) {
                return [`bg-${colorClass}`];
            }
            return [`bg-color-[${trimmedValue}]`];
        }
        if (property === 'color') {
            if (trimmedValue.startsWith('#')) {
                return [`color-[${trimmedValue}]`];
            }
            if (trimmedValue.startsWith('rgb') || trimmedValue.startsWith('hsl')) {
                return [`color-[${trimmedValue}]`];
            }
            // Для именованных цветов
            const namedColors = {
                'red': 'red-500',
                'green': 'green-500',
                'blue': 'blue-500',
                'black': 'black',
                'white': 'white',
                'gray': 'gray-500',
                'yellow': 'yellow-500',
                'orange': 'orange-500',
                'purple': 'purple-500',
                'pink': 'pink-500'
            };
            const colorClass = namedColors[trimmedValue];
            if (colorClass) {
                return [`color-${colorClass}`];
            }
            return [`color-[${trimmedValue}]`];
        }
        // Обработка сокращённых свойств
        if (property === 'margin' || property === 'padding') {
            return this.processShorthandProperty(property, trimmedValue);
        }
        if (property === 'border') {
            return this.processBorderShorthand(trimmedValue);
        }
        if (property === 'background') {
            return this.processBackgroundShorthand(trimmedValue);
        }
        // Обычный маппинг
        const unoPrefix = UNO_PROPERTY_MAP[property];
        if (unoPrefix) {
            if (unoPrefix === '')
                return null; // handled separately
            return [`${unoPrefix}-${trimmedValue}`];
        }
        // Fallback для нестандартных свойств
        return [`[${property}:${trimmedValue}]`];
    }
    /**
     * Обрабатывает сокращённые свойства margin/padding
     */
    static processShorthandProperty(property, value) {
        const parts = value.split(/\s+/);
        const unoClasses = [];
        const prefix = property[0]; // 'm' для margin, 'p' для padding
        function format(val) {
            if (/^-?\d+(px|rem|em|%)$/.test(val))
                return val;
            if (/^-?\d+$/.test(val))
                return val;
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
     * Обрабатывает сокращённое свойство border
     */
    static processBorderShorthand(value) {
        const parts = value.split(/\s+/);
        const unoClasses = [];
        for (const part of parts) {
            if (/^\d+px$/.test(part)) {
                unoClasses.push(`border-${part.replace('px', '')}`);
            }
            else if (['solid', 'dashed', 'dotted', 'double', 'none'].includes(part)) {
                unoClasses.push(`border-${part}`);
            }
            else if (part.startsWith('#')) {
                unoClasses.push(`border-[${part}]`);
            }
            else if (part.startsWith('rgb') || part.startsWith('hsl')) {
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
        // Простая обработка - разбиваем по пробелам
        const parts = value.split(/\s+/);
        for (const part of parts) {
            if (part.startsWith('url(')) {
                unoClasses.push(`bg-[${part}]`);
            }
            else if (part.startsWith('#') || part.startsWith('rgb') || part.startsWith('hsl')) {
                unoClasses.push(`bg-[${part}]`);
            }
            else if (['no-repeat', 'repeat', 'repeat-x', 'repeat-y'].includes(part)) {
                unoClasses.push(`bg-${part.replace('-', '')}`);
            }
            else if (['center', 'top', 'bottom', 'left', 'right'].includes(part)) {
                unoClasses.push(`bg-${part}`);
            }
        }
        return unoClasses;
    }
    /**
     * Преобразует CSS AST значение в строку
     */
    static propertyValueToString(value) {
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
                    childValue = child.value + child.unit;
                }
                else if (child.type === 'Hash') {
                    childValue = '#' + child.value;
                }
                else if (child.type === 'Function') {
                    // Обработка функций типа url(), rgb(), hsl()
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
                            funcCurrent = funcCurrent.next;
                        }
                    }
                    funcStr += ')';
                    childValue = funcStr;
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
                if (selector.type === 'Selector') {
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
    static extractProperties(block) {
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
}
//# sourceMappingURL=utils.js.map