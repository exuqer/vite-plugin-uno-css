# Vite Plugin UnoCSS CSS - Example

Этот пример демонстрирует использование плагина `vite-plugin-unocss-css`.

## Режимы работы

### Обычный режим (без опции dev)

```bash
bun run dev
```

В этом режиме CSS файлы работают как обычно, плагин не обрабатывает их. Стили применяются напрямую из CSS файлов.

### Dev режим (с опцией dev)

```bash
bun run dev:uno
```

В этом режиме плагин обрабатывает CSS файлы и заменяет их на UnoCSS классы. Стили генерируются динамически.

## Конфигурация

### Обычный режим (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocssCSSPlugin from '../dist/index.mjs';

export default defineConfig({
  plugins: [
    vue(),
    unocssCSSPlugin(), // Без опции dev
  ],
});
```

### Dev режим (vite.config.dev.ts)
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import unocssCSSPlugin from '../dist/index.mjs';

export default defineConfig({
  plugins: [
    vue(),
    unocssCSSPlugin({ dev: true }), // С опцией dev
  ],
});
```

## Файлы в примере

- `style.css` - обычный CSS файл с классами `.example` и `.example__item`
- `App.vue` - Vue компонент с scoped стилями
- `main.ts` - точка входа, импортирующая CSS файл

## Ожидаемое поведение

### В обычном режиме:
- Стили из `style.css` применяются как обычно
- Стили из Vue компонента применяются как scoped стили

### В dev режиме:
- Стили из `style.css` заменяются на UnoCSS классы
- Стили из Vue компонента также заменяются на UnoCSS классы
- Генерируется виртуальный CSS файл с UnoCSS стилями 