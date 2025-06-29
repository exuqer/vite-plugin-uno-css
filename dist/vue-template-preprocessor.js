import { parse as parseHtml } from 'node-html-parser';
function extractTemplate(source) {
    const match = source.match(/<template>([\s\S]*?)<\/template>/);
    return match ? match[1] : null;
}
function replaceClassesInTemplate(template, classToUnoMap) {
    const root = parseHtml(template, { lowerCaseTagName: false });
    root.querySelectorAll('[class]').forEach((el) => {
        const orig = el.getAttribute('class');
        if (!orig)
            return;
        const classes = orig.split(/\s+/);
        const replaced = classes.map((cls) => classToUnoMap.get(cls) || cls).join(' ');
        el.setAttribute('class', replaced);
    });
    return root.toString();
}
export function preprocessVueSFC(source, classToUnoMap) {
    const template = extractTemplate(source);
    if (!template)
        return source;
    const replaced = replaceClassesInTemplate(template, classToUnoMap);
    // Вставляем обратно в исходник
    return source.replace(/<template>[\s\S]*?<\/template>/, `<template>${replaced}</template>`);
}
//# sourceMappingURL=vue-template-preprocessor.js.map