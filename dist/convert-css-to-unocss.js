// Конвертация CSS в унарные классы UnoCSS
export function convertCSSToUnoCSS(css) {
    const unoClasses = [];
    const rules = parseCSSRules(css);
    for (const rule of rules) {
        const unoClass = convertRuleToUnoClass(rule);
        if (unoClass) {
            unoClasses.push(unoClass);
        }
    }
    return unoClasses.join('\n');
}
function parseCSSRules(css) {
    const rules = [];
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;
    while ((match = ruleRegex.exec(css)) !== null) {
        const selector = match[1].trim();
        const properties = match[2].trim();
        if (!selector.startsWith('@')) {
            rules.push({ selector, properties });
        }
    }
    return rules;
}
function convertRuleToUnoClass(rule) {
    const { selector, properties } = rule;
    // Обрабатываем Vue scoped стили - извлекаем основное имя класса
    let className = selector;
    if (selector.includes('data-v-')) {
        const match = selector.match(/^([^[]+)/);
        if (match) {
            className = match[1].trim();
        }
    }
    if (selector.includes(' ') || selector.includes('>') || selector.includes('+') || selector.includes('~')) {
        return null;
    }
    const unoClass = convertPropertiesToUnoClass(properties);
    if (unoClass) {
        return `.${unoClass}`;
    }
    return null;
}
function convertPropertiesToUnoClass(properties) {
    const propertyMap = new Map();
    const propertyRegex = /([^:]+):\s*([^;]+);/g;
    let match;
    while ((match = propertyRegex.exec(properties)) !== null) {
        const property = match[1].trim();
        const value = match[2].trim();
        propertyMap.set(property, value);
    }
    return mapPropertiesToUnoClass(propertyMap);
}
function mapPropertiesToUnoClass(properties) {
    const unoParts = [];
    for (const [property, value] of properties) {
        const unoClass = getUnoClassForProperty(property, value);
        if (unoClass) {
            unoParts.push(unoClass);
        }
    }
    if (unoParts.length > 0) {
        return unoParts.join('-');
    }
    return null;
}
function getUnoClassForProperty(property, value) {
    const mappings = {
        'display': {
            'flex': 'flex',
            'grid': 'grid',
            'block': 'block',
            'inline': 'inline',
            'inline-block': 'inline-block',
            'none': 'hidden'
        },
        'position': {
            'relative': 'relative',
            'absolute': 'absolute',
            'fixed': 'fixed',
            'sticky': 'sticky'
        },
        'width': {
            '100%': 'w-full',
            '100vw': 'w-screen',
            'auto': 'w-auto'
        },
        'height': {
            '100%': 'h-full',
            '100vh': 'h-screen',
            'auto': 'h-auto'
        },
        'margin': {
            '0': 'm-0',
            'auto': 'mx-auto'
        },
        'padding': {
            '0': 'p-0'
        },
        'background-color': {
            '#000': 'bg-black',
            '#fff': 'bg-white',
            '#f00': 'bg-red-500',
            '#0f0': 'bg-green-500',
            '#00f': 'bg-blue-500'
        },
        'color': {
            '#000': 'text-black',
            '#fff': 'text-white',
            '#f00': 'text-red-500',
            '#0f0': 'text-green-500',
            '#00f': 'text-blue-500'
        },
        'font-size': {
            '1rem': 'text-base',
            '1.2rem': 'text-lg',
            '1.5rem': 'text-xl',
            '2rem': 'text-2xl'
        },
        'font-weight': {
            'bold': 'font-bold',
            '700': 'font-bold',
            'normal': 'font-normal',
            '400': 'font-normal'
        },
        'text-align': {
            'center': 'text-center',
            'left': 'text-left',
            'right': 'text-right'
        },
        'border-radius': {
            '8px': 'rounded-lg',
            '4px': 'rounded',
            '50%': 'rounded-full'
        },
        'justify-content': {
            'center': 'justify-center',
            'flex-start': 'justify-start',
            'flex-end': 'justify-end',
            'space-between': 'justify-between',
            'space-around': 'justify-around'
        },
        'align-items': {
            'center': 'items-center',
            'flex-start': 'items-start',
            'flex-end': 'items-end',
            'stretch': 'items-stretch'
        },
        'flex-direction': {
            'column': 'flex-col',
            'row': 'flex-row',
            'column-reverse': 'flex-col-reverse',
            'row-reverse': 'flex-row-reverse'
        },
        'gap': {
            '4px': 'gap-1',
            '8px': 'gap-2',
            '12px': 'gap-3',
            '16px': 'gap-4',
            '24px': 'gap-6',
            '32px': 'gap-8',
            '40px': 'gap-10'
        },
        'cursor': {
            'pointer': 'cursor-pointer',
            'not-allowed': 'cursor-not-allowed',
            'default': 'cursor-default'
        },
        'opacity': {
            '0': 'opacity-0',
            '0.5': 'opacity-50',
            '0.6': 'opacity-60',
            '0.7': 'opacity-70',
            '0.8': 'opacity-80',
            '1': 'opacity-100'
        },
        'z-index': {
            '1': 'z-1',
            '10': 'z-10',
            '100': 'z-100',
            '9999': 'z-9999',
            '10000': 'z-10000'
        },
        'overflow': {
            'hidden': 'overflow-hidden',
            'auto': 'overflow-auto',
            'scroll': 'overflow-scroll'
        },
        'box-sizing': {
            'border-box': 'box-border'
        },
        'user-select': {
            'none': 'select-none'
        },
        'pointer-events': {
            'none': 'pointer-events-none',
            'auto': 'pointer-events-auto'
        }
    };
    const propertyMappings = mappings[property];
    if (propertyMappings && propertyMappings[value]) {
        return propertyMappings[value];
    }
    if (property === 'width' || property === 'height') {
        const numMatch = value.match(/^(\d+)px$/);
        if (numMatch) {
            const num = parseInt(numMatch[1]);
            if (property === 'width') {
                return `w-${num}`;
            }
            else {
                return `h-${num}`;
            }
        }
    }
    if (property === 'margin' || property === 'padding') {
        const numMatch = value.match(/^(\d+)px$/);
        if (numMatch) {
            const num = parseInt(numMatch[1]);
            const prefix = property === 'margin' ? 'm' : 'p';
            return `${prefix}-${num}`;
        }
    }
    if (property === 'min-width' || property === 'min-height') {
        const numMatch = value.match(/^(\d+)px$/);
        if (numMatch) {
            const num = parseInt(numMatch[1]);
            const prefix = property === 'min-width' ? 'min-w' : 'min-h';
            return `${prefix}-${num}`;
        }
    }
    if (property === 'max-width' || property === 'max-height') {
        const numMatch = value.match(/^(\d+)px$/);
        if (numMatch) {
            const num = parseInt(numMatch[1]);
            const prefix = property === 'max-width' ? 'max-w' : 'max-h';
            return `${prefix}-${num}`;
        }
    }
    if (property === 'border') {
        if (value === 'none') {
            return 'border-none';
        }
        const borderMatch = value.match(/^(\d+)px\s+solid\s+(.+)$/);
        if (borderMatch) {
            const width = borderMatch[1];
            const color = borderMatch[2];
            return `border-${width} border-solid border-${color}`;
        }
    }
    return null;
}
//# sourceMappingURL=convert-css-to-unocss.js.map