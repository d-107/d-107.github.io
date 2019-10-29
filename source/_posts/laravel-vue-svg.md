---
title: 在 laravel vue 中使用 svg 图标
date: 2019-10-28 21:21:59
tags: laravel
categories: 南瓜
---

#### 安装扩展组件：
```
npm install laravel-mix-svg-vue
or
yarn add laravel-mix-svg-vue
```

#### 在 webpack.mix.js 中添加引用：
```
const mix = require('laravel-mix');
require('laravel-mix-svg-vue');

mix.js('resources/js/app.js', 'public/js')
    .svgVue();
```

#### 在 app.js 中引用组件
```
import Vue from 'vue';
import SvgVue from 'svg-vue';

Vue.use(SvgVue);
```

#### svg 使用：
```
<svg-vue icon="avatar"></svg-vue>
```

#### 默认配置
```
{
    svgPath: 'resources/svg',
    extract: false,
    svgoSettings: [
        { removeTitle: true },
        { removeViewBox: false },
        { removeDimensions: true }
    ]
}
```


参数 | 类型 | 默认值| 说明
----  | ----    | -----   | ----
svgPath | String | resources/svg | svg 图标路径
extract | Boolean | false |  将 svg 与主包分离
svgoSettings | Array | [{ removeTitle: true }, { removeViewBox: false }, { removeDimensions: true }] | svgo 相关设置

#### 缺点
好像是不能通过参数动态改变 svg 内容，没试出来，不知道什么原因。
