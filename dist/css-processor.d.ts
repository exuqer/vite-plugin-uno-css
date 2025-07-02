import type { UnoGenerator } from '@unocss/core';
export declare class CSSProcessor {
    private uno;
    constructor(uno: UnoGenerator);
    process(code: string, id: string, classMappingCache: Map<string, string>, allUnoClasses?: Set<string>): Promise<string>;
    private extractClassesFromCSS;
    private processRule;
    private convertPropertiesToUnoClasses;
    private fallbackExtractClasses;
    private regexExtractClasses;
    private convertPropertiesStringToUnoClasses;
}
//# sourceMappingURL=css-processor.d.ts.map