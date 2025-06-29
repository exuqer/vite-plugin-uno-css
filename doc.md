# Плагин для Vite - convert to uno css

Плагин нужен для того чтобы была возможность при сборке все классы в итоговом html и css файле заменить на унарные uno css классы.


Использование:

**vite.config.ts**


```ts 

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import unocssCSSPlugin from '../vite-plugin-unocss-css';

export default defineConfig({
  plugins: [
    vue(),
    unocssCSSPlugin(),
  ],
});

```
Все зависимости  unoCss, пресеты должны остаться в этом файле 


Пример с html и css: 

**index.html**
```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title></title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="example">
    <div class="example__item">
        Hello!
    </div>
  </div>
</body>
</html>
```

**style.css**
```css
.example {
  background-color: #d07f44;
  padding: 10px;
}
.example__item {
  color: green;
  width: 100px;
  height: 200px;
  background-image: url('https://picsum.photos/200');
}
```

Должно трансформироваться при билде в 

**index.html**
```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title></title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="bg-color-[#d07f44] p-10">
    <div class="color-green w-100px h-200px bg-image-[url('https://picsum.photos/200')]">
        Hello!
    </div>
  </div>
</body>
</html>
```

**style.css**
```css
.bg-color-[#d07f44] {
  background-color: #d07f44;
}

.p-10 {
  padding: 10px;
}

.color-green {
  color: green;
}

.w-100px {
  width: 100px;
}

.h-200px {
  height: 200px;
}

.bg-image-[url('https://picsum.photos/200')] {
  background-image: url('https://picsum.photos/200');
}
```


Пример с vue + scss: 

**index.html**
```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title></title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>

**App.vue**
```vue 
<template>

<div class="example">
    <div class="example__item">
        Hello!
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .example {
    background-color: #d07f44;
    padding: 10px;

    &__item {
      color: green;
      width: 100px;
      height: 200px;
      background-image: url('https://picsum.photos/200');
    }
  }
</style>
```


в бандле после build должно выйти 


**style.css**
```css
.bg-color-[#d07f44] {
  background-color: #d07f44;
}

.p-10 {
  padding: 10px;
}

.color-green {
  color: green;
}

.w-100px {
  width: 100px;
}

.h-200px {
  height: 200px;
}

.bg-image-[url('https://picsum.photos/200')] {
  background-image: url('https://picsum.photos/200');
}
```

**index.html**
```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title></title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="bg-color-[#d07f44] p-10">
    <div class="color-green w-100px h-200px bg-image-[url('https://picsum.photos/200')]">
        Hello!
    </div>
  </div>
</body>
</html>
```


В общем плагин должен уметь обрабатывыать  css/scss/html/vue/css-modules/vue-scoped выдавая в конечном итоге 

один файл css с унарными классами а также замененные кастомные классы на uno css классы.

При этом не должно быть дубликаций в css собственно чем и славится uno csss, в html не должно быть scoped атрибутов. Используй любой пресет по выбору для уно. Важно чтобы абсолютно все свойства в классах были трансформированны в унарные классы.

# Примеры конфигурации vite-plugin-unocss-css

## Базовое использование (автоматический режим)

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { UnoCSSPlugin } from 'vite-plugin-unocss-css'

export default defineConfig({
  plugins: [
    UnoCSSPlugin({
      // mode: 'auto' — автоматически определяет режим по NODE_ENV (по умолчанию)
      // В development: работает в dev-режиме (виртуальный CSS)
      // В production: работает в build-режиме (генерация CSS-файла)
      mode: 'auto'
    })
  ]
})
```

## Только для разработки

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { UnoCSSPlugin } from 'vite-plugin-unocss-css'

export default defineConfig({
  plugins: [
    UnoCSSPlugin({
      mode: 'dev' // Только dev-режим, быстрая сборка
    })
  ]
})
```

## Только для продакшена

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { UnoCSSPlugin } from 'vite-plugin-unocss-css'

export default defineConfig({
  plugins: [
    UnoCSSPlugin({
      mode: 'build' // Только build-режим, оптимизированная сборка
    })
  ]
})
```

## Оба режима одновременно

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { UnoCSSPlugin } from 'vite-plugin-unocss-css'

export default defineConfig({
  plugins: [
    UnoCSSPlugin({
      mode: ['dev', 'build'] // Полная функциональность в обоих режимах
    })
  ]
})
```

## С дополнительными опциями UnoCSS

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { UnoCSSPlugin } from 'vite-plugin-unocss-css'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  plugins: [
    UnoCSSPlugin({
      mode: 'auto',
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons()
      ],
      theme: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b'
        }
      },
      shortcuts: {
        'btn': 'px-4 py-2 rounded bg-primary text-white hover:bg-primary/80',
        'card': 'p-6 bg-white rounded-lg shadow-md'
      },
      rules: [
        ['custom-rule', { color: 'red' }]
      ]
    })
  ]
})
```

## Рекомендации по использованию

### Для большинства проектов
```ts
UnoCSSPlugin({ mode: 'auto' }) // Рекомендуется
```

### Для быстрой разработки
```ts
UnoCSSPlugin({ mode: 'dev' }) // Только dev-режим
```

### Для CI/CD
```ts
UnoCSSPlugin({ mode: 'build' }) // Только build-режим
```

### Для максимальной функциональности
```ts
UnoCSSPlugin({ mode: ['dev', 'build'] }) // Оба режима
```

## Логи работы плагина

При запуске плагин выводит информацию о активных режимах:

```
[uno-css-plugin] Active modes: build
[uno-css-plugin] Active modes: dev
[uno-css-plugin] Active modes: dev, build
```

Это помогает понять, в каком режиме работает плагин и какие функции доступны.

