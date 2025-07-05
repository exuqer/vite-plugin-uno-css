/**
 * Преобразует CSS свойство в UnoCSS класс
 */
export declare function convertPropertyToUnoClass(property: string, value: string): string[] | null;
/**
 * Преобразует CSS AST значение в строку
 */
export declare function propertyValueToString(value: any): string;
/**
 * Извлекает имя класса из CSS селектора
 */
export declare function extractClassName(selector: string): string | null;
/**
 * Извлекает селекторы из CSS AST
 */
export declare function extractSelectors(prelude: any): string[];
/**
 * Извлекает свойства из CSS AST блока
 */
export declare function extractProperties(block: any): any[];
//# sourceMappingURL=utils.d.ts.map