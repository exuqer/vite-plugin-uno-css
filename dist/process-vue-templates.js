import { preprocessVueSFC } from './vue-template-preprocessor';
import { createClassToUnoMap } from './js-processor';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';
// Путь к итоговому CSS-бандлу
const cssBundlePath = '../match3-arena/dist/assets/index-CuU9e6TR.css';
function processDir(dir, classToUnoMap) {
    const files = readdirSync(dir);
    for (const file of files) {
        const fullPath = join(dir, file);
        if (statSync(fullPath).isDirectory()) {
            processDir(fullPath, classToUnoMap);
        }
        else if (extname(fullPath) === '.vue') {
            const src = readFileSync(fullPath, 'utf-8');
            const processed = preprocessVueSFC(src, classToUnoMap);
            writeFileSync(fullPath, processed, 'utf-8');
            console.log(`[uno-css-pre] Processed: ${fullPath}`);
        }
    }
}
async function main() {
    const cssSource = readFileSync(cssBundlePath, 'utf-8');
    const classToUnoMap = await createClassToUnoMap(cssSource);
    // Укажите корневую директорию с .vue-файлами
    processDir('../match3-arena/src', classToUnoMap);
}
main();
//# sourceMappingURL=process-vue-templates.js.map