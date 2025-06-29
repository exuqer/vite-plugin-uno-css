import { parse, walk } from 'css-tree';
export class JSProcessor {
    async process(code, id, classToUnoMap) {
        try {
            // Заменяем кастомные классы на набор унарных классов
            let processedCode = this.replaceCustomClasses(code, classToUnoMap);
            // Удаляем data-v-***
            processedCode = this.removeDataV(processedCode);
            return processedCode;
        }
        catch (error) {
            console.error('Error processing JS file:', error);
            return code;
        }
    }
    // Максимально простая замена: заменяю все вхождения кастомного класса как подстроки
    replaceCustomClasses(code, classToUnoMap) {
        for (const [custom, uno] of classToUnoMap.entries()) {
            // Заменяем все вхождения custom на uno, даже если это часть другой строки
            const re = new RegExp(custom.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            code = code.replace(re, (m) => {
                // eslint-disable-next-line no-console
                console.log(`[uno-css-plugin] Заменяю ${custom} -> ${uno}`);
                return uno;
            });
        }
        return code;
    }
    removeDataV(code) {
        return code.replace(/data-v-[a-f0-9]+/g, '');
    }
    async createClassToUnoMap(cssSource) {
        return createClassToUnoMap(cssSource);
    }
    // Примитивный маппинг css->uno (можно расширить)
    cssPropToUno(prop, value) {
        switch (prop) {
            case 'cursor': return `cursor-${value}`;
            case 'position': return `position-${value}`;
            case 'width': return `w-${value.replace(/px$/, 'px')}`;
            case 'height': return `h-${value.replace(/px$/, 'px')}`;
            case 'padding': return `p-[${value}]`;
            case 'padding-top': return `pt-[${value}]`;
            case 'padding-bottom': return `pb-[${value}]`;
            case 'padding-left': return `pl-[${value}]`;
            case 'padding-right': return `pr-[${value}]`;
            case 'background-image': return `bg-[${value}]`;
            case 'background-size': return `bg-size-${value}`;
            case 'background-repeat': return `bg-repeat-${value}`;
            case 'color': return `text-[${value}]`;
            case 'box-sizing': return value === 'border-box' ? 'box-border' : `box-${value}`;
            default:
                // Можно добавить больше соответствий
                return null;
        }
    }
    propertyValueToString(value) {
        if (value.type === 'Value' && value.children && Array.isArray(value.children)) {
            return value.children.map((child) => {
                if (child.type === 'Raw') {
                    return child.value;
                }
                else if (child.type === 'String') {
                    return `"${child.value}"`;
                }
                else if (child.type === 'Number') {
                    return child.value;
                }
                else if (child.type === 'Dimension') {
                    return child.value + child.unit;
                }
                else if (child.type === 'Hash') {
                    return '#' + child.value;
                }
                return child.value || '';
            }).join('');
        }
        return '';
    }
}
// Вынесенная функция для генерации маппинга
export async function createClassToUnoMap(cssSource) {
    const map = new Map();
    try {
        const ast = parse(cssSource, { positions: true });
        walk(ast, {
            visit: 'Rule',
            enter: (node) => {
                if (node.type === 'Rule' && node.prelude && node.prelude.children) {
                    for (const sel of node.prelude.children) {
                        if (sel.type === 'Selector') {
                            let className = '';
                            for (const part of sel.children) {
                                if (part.type === 'ClassSelector') {
                                    className = part.name;
                                }
                            }
                            if (className) {
                                const unoClasses = [];
                                if (node.block && node.block.children) {
                                    for (const decl of node.block.children) {
                                        if (decl.type === 'Declaration') {
                                            const uno = cssPropToUno(decl.property, propertyValueToString(decl.value));
                                            if (uno)
                                                unoClasses.push(uno);
                                        }
                                    }
                                }
                                if (unoClasses.length) {
                                    map.set(className, unoClasses.join(' '));
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    catch (e) {
        console.error('Failed to build class->uno map:', e);
    }
    return map;
}
function cssPropToUno(prop, value) {
    switch (prop) {
        case 'cursor': return `cursor-${value}`;
        case 'position': return `position-${value}`;
        case 'width': return `w-${value.replace(/px$/, 'px')}`;
        case 'height': return `h-${value.replace(/px$/, 'px')}`;
        case 'padding': return `p-[${value}]`;
        case 'padding-top': return `pt-[${value}]`;
        case 'padding-bottom': return `pb-[${value}]`;
        case 'padding-left': return `pl-[${value}]`;
        case 'padding-right': return `pr-[${value}]`;
        case 'background-image': return `bg-[${value}]`;
        case 'background-size': return `bg-size-${value}`;
        case 'background-repeat': return `bg-repeat-${value}`;
        case 'color': return `text-[${value}]`;
        case 'box-sizing': return value === 'border-box' ? 'box-border' : `box-${value}`;
        default:
            return null;
    }
}
function propertyValueToString(value) {
    if (value.type === 'Value' && value.children && Array.isArray(value.children)) {
        return value.children.map((child) => {
            if (child.type === 'Raw') {
                return child.value;
            }
            else if (child.type === 'String') {
                return `"${child.value}"`;
            }
            else if (child.type === 'Number') {
                return child.value;
            }
            else if (child.type === 'Dimension') {
                return child.value + child.unit;
            }
            else if (child.type === 'Hash') {
                return '#' + child.value;
            }
            return child.value || '';
        }).join('');
    }
    return '';
}
//# sourceMappingURL=js-processor.js.map