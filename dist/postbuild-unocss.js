import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';
const distDir = '../match3-arena/dist';
function findCssBundle() {
    const assetsDir = join(distDir, 'assets');
    const files = readdirSync(assetsDir);
    const cssFile = files.find(file => file.startsWith('index-') && file.endsWith('.css') && !file.includes('-unocss'));
    if (!cssFile) {
        throw new Error('CSS bundle not found in assets directory');
    }
    return join(assetsDir, cssFile);
}
function findUnoCssBundle() {
    const assetsDir = join(distDir, 'assets');
    const files = readdirSync(assetsDir);
    const unoCssFile = files.find(file => file.startsWith('index-') && file.endsWith('-unocss.css'));
    if (!unoCssFile) {
        throw new Error('UnoCSS bundle not found in assets directory');
    }
    return join(assetsDir, unoCssFile);
}
async function main() {
    try {
        // 1. Динамически находим CSS-файлы
        const cssBundlePath = findCssBundle();
        const unoCssBundlePath = findUnoCssBundle();
        console.log(`[uno-css-postbuild] Найден CSS-файл: ${cssBundlePath}`);
        console.log(`[uno-css-postbuild] Найден UnoCSS-файл: ${unoCssBundlePath}`);
        // 2. Динамически импортируем createClassToUnoMap
        const { createClassToUnoMap } = await import('./js-processor.js');
        // 3. Читаем CSS и строим маппинг
        const css = readFileSync(cssBundlePath, 'utf-8');
        const classToUnoMap = await createClassToUnoMap(css);
        // 4. Обновляем HTML файл для использования UnoCSS CSS
        const htmlPath = join(distDir, 'index.html');
        let htmlContent = readFileSync(htmlPath, 'utf-8');
        const originalCssFile = cssBundlePath.split('/').pop();
        const unoCssFile = unoCssBundlePath.split('/').pop();
        if (originalCssFile && unoCssFile) {
            htmlContent = htmlContent.replace(originalCssFile, unoCssFile);
            writeFileSync(htmlPath, htmlContent, 'utf-8');
            console.log(`[uno-css-postbuild] Обновлен HTML файл: ${originalCssFile} -> ${unoCssFile}`);
        }
        // 5. Проходим по всем JS/HTML-файлам в dist
        function processDir(dir) {
            const files = readdirSync(dir);
            for (const file of files) {
                const fullPath = join(dir, file);
                if (statSync(fullPath).isDirectory()) {
                    processDir(fullPath);
                }
                else if (['.js', '.html'].includes(extname(fullPath))) {
                    let src = readFileSync(fullPath, 'utf-8');
                    let replacements = 0;
                    for (const [custom, uno] of classToUnoMap.entries()) {
                        const re = new RegExp(custom.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
                        const matches = src.match(re);
                        if (matches) {
                            replacements += matches.length;
                            src = src.replace(re, uno);
                        }
                    }
                    if (replacements > 0) {
                        writeFileSync(fullPath, src, 'utf-8');
                        console.log(`[uno-css-postbuild] Заменено ${replacements} классов в ${fullPath}`);
                    }
                }
            }
        }
        processDir(distDir);
        console.log('[uno-css-postbuild] Классы заменены на унарные во всех JS/HTML-файлах dist/');
    }
    catch (error) {
        console.error('[uno-css-postbuild] Ошибка:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=postbuild-unocss.js.map