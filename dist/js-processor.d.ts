export declare class JSProcessor {
    process(code: string, id: string, classToUnoMap: Map<string, string>): Promise<string>;
    private replaceCustomClasses;
    private removeDataV;
    createClassToUnoMap(cssSource: string): Promise<Map<string, string>>;
    private cssPropToUno;
    private propertyValueToString;
}
export declare function createClassToUnoMap(cssSource: string): Promise<Map<string, string>>;
//# sourceMappingURL=js-processor.d.ts.map