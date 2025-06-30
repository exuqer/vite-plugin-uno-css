<template>
  <div class="vue-example">
    <div class="vue-example__item"> Hello from Vue! </div>
  </div>
  <div class="bg-red-500 p-4 text-white rounded-xl m-4">UnoCSS test</div>
</template>

<style lang="scss" scoped>
  .vue-example {
    background-color: #4a90e2;
    padding: 15px;
    margin: 25px;
    border-radius: 12px;
    color: white;
    width: 150px;
    height: 100px;
    background-image: url('https://picsum.photos/300');
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vue-example__item {
    // Можно добавить стили для вложенного элемента
  }
</style> 