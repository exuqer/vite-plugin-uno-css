export declare class CSSUtils {
    /**
     * Преобразует CSS свойство в UnoCSS класс
     */
    static convertPropertyToUnoClass(property: string, value: string): string[] | null;
    /**
     * Обрабатывает сокращённые свойства margin/padding
     */
    private static processShorthandProperty;
    /**
     * Преобразует CSS AST значение в строку
     */
    static propertyValueToString(value: any): string;
    /**
     * Извлекает имя класса из CSS селектора
     */
    static extractClassName(selector: string): string | null;
    /**
     * Извлекает селекторы из CSS AST
     */
    static extractSelectors(prelude: any): string[];
    /**
     * Преобразует CSS AST селектор в строку
     */
    static selectorToString(selector: any): string;
    /**
     * Извлекает свойства из CSS AST блока
     */
    static extractProperties(block: any): any[];
}
//# sourceMappingURL=utils.d.ts.map