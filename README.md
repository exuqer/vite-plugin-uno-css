# vite-plugin-unocss-css

Плагин для Vite, который преобразует обычные CSS-классы в UnoCSS-унарные классы для HTML, Vue, CSS/SCSS файлов. Поддерживает работу как в production (build), так и в development (dev) режиме с возможностью выборочного включения режимов для оптимизации производительности.

## Возможности
- Автоматическое преобразование классов в UnoCSS-унарные
- Поддержка Vue, HTML, CSS/SCSS
- Генерация единого CSS-файла в build
- Виртуальный CSS-модуль в dev-режиме (live-обновление стилей)
- Гибкая настройка режима работы (dev/build/auto/массив режимов)
- Оптимизация производительности: обработка файлов только в активных режимах

## Установка

```bash
npm install vite-plugin-unocss-css
```

## Использование

### Подключение в Vite

```ts
// vite.config.ts
import { UnoCSSPlugin } from 'vite-plugin-unocss-css';

export default {
  plugins: [
    UnoCSSPlugin({
      // Режимы работы:
      // mode: 'auto' — автоматически определяет режим по NODE_ENV (по умолчанию)
      // mode: 'dev' — только dev-режим (виртуальный CSS)
      // mode: 'build' — только build-режим (генерация CSS-файла)
      // mode: ['dev', 'build'] — оба режима одновременно
      mode: 'auto',
      // другие опции UnoCSS (presets, theme, shortcuts, rules)
    })
  ]
}
```

### Примеры конфигурации

```ts
// Только для разработки (быстрая сборка)
UnoCSSPlugin({ mode: 'dev' })

// Только для продакшена (оптимизированная сборка)
UnoCSSPlugin({ mode: 'build' })

// Оба режима (полная функциональность)
UnoCSSPlugin({ mode: ['dev', 'build'] })

// Автоматический выбор (рекомендуется)
UnoCSSPlugin({ mode: 'auto' })
```

### Как работает режим dev
- Все классы из Vue/HTML/CSS файлов автоматически преобразуются в унарные UnoCSS-классы.
- Плагин собирает все классы в live-кэш.
- В проект автоматически добавляется `<link rel="stylesheet" href="/@unocss-generated.css">`.
- Виртуальный модуль `/@unocss-generated.css` генерирует CSS на лету через UnoCSS.
- Любые изменения классов сразу отражаются в браузере без перезагрузки сервера.

### Как работает режим build
- Все классы преобразуются в унарные UnoCSS-классы.
- Генерируется единый CSS-файл `unocss-generated.css`.
- В HTML автоматически подключается только этот CSS-файл.
- Оригинальные CSS-файлы удаляются из сборки.

### Оптимизация производительности
- Плагин обрабатывает файлы только в тех режимах, которые включены.
- Если режим не активен, файлы не обрабатываются, что ускоряет сборку.
- UnoCSS генератор и процессоры создаются только при необходимости.
- В dev-режиме без build-режима не создаются лишние ресурсы для сборки.

### Рекомендации
- Для большинства проектов используйте `mode: 'auto'` (по умолчанию).
- Если используете только dev или только build — укажите явно соответствующий режим для ускорения.
- Для CI/CD можно использовать `mode: 'build'` для оптимизации времени сборки.
- В режиме dev не требуется ручной импорт CSS — всё подключается автоматически.

## Пример

```ts
import { UnoCSSPlugin } from 'vite-plugin-unocss-css';

export default {
  plugins: [
    UnoCSSPlugin({
      mode: 'auto', // или ['dev', 'build'] для полной функциональности
      // другие опции UnoCSS
    })
  ]
}
```

## Лицензия
MIT 