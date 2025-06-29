export declare class VueProcessor {
    process(code: string, id: string, classMappingCache: Map<string, string>): Promise<string>;
    private processTemplate;
    private extractClassesFromStyles;
    private processCSSRule;
    private convertPropertiesToUnoClasses;
    private fallbackExtractClasses;
    private convertPropertiesStringToUnoClasses;
}
//# sourceMappingURL=vue-processor.d.ts.map