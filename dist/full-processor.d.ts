export declare function processVueFile(vuePath: string): Promise<{
    html: string;
    unoClasses: string[];
}>;
export declare function processAllSources({ htmlPath, cssPath }: {
    htmlPath: string;
    cssPath: string;
}): Promise<{
    html: string;
    css: any;
}>;
export declare function processHtmlAndCssStrings(htmlRaw: string, cssRaw: string): Promise<{
    html: string;
    css: any;
}>;
//# sourceMappingURL=full-processor.d.ts.map