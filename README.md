# vue-loader [![Build Status](https://circleci.com/gh/vuejs/vue-loader/tree/master.svg?style=shield)](https://circleci.com/gh/vuejs/vue-loader/tree/master) [![npm package](https://img.shields.io/npm/v/vue-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/vue-loader)

> Vue.js component loader for [Webpack](http://webpack.github.io).

**新增style 样式表的css-modules属性**

该属性能让某个.vue文件里的class变成唯一不冲突的名字
例如:

``` html

<template>
  <div class="a">
    <h1 class="msg">{{ msg }}</h1>
    <h1 :class="hello">你好2</h1>
    <h1 class="b">你好3</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello Vue!',
      hello: cssModules.hello
    }
  }
}
</script>

<style css-modules>
  div .hello {
    color: green;
  }
</style>

<style css-modules lang="scss">
  .a {
    color: red;
    .b {
      color: yellow;
    }
  }
</style>


```

添加了css-modules属性后最后会编译成

``` html
<template>
  <div class="__cm15a">
    <h1 class="msg">{{ msg }}</h1>
    <h1 :class="hello">你好2</h1>
    <h1 class="__cm16b">你好3</h1>
  </div>
</template>

<script>
var cssModules = {"hello":"__cm14hello","a":"__cm15a","b":"__cm16b"}
export default {
  data () {
    return {
      msg: 'Hello Vue!',
      hello: cssModules.hello
    }
  }
}
</script>

<style css-modules>
  div .__cm14hello {
    color: green;
  }
</style>

<style css-modules lang="scss">
  .__cm15a {
    color: red;
    .__cm16b {
      color: yellow;
    }
  }
</style>

```

### 开发初衷:

css命名真的是一件令人头疼的一件事，简单的词汇表达的很清楚，比如，button，container，item此类的名字，但是使用的时候由于css的全局性很难大量重复使用这些单词，一些解决方案（BEM，OOCSS）是给这些词汇添加前缀后缀等等，但是前缀后缀也要自己用确切的单词表面意思，所以最后还是得面对css命名还真是件挺头疼的一件事。

后来知道了react-css-modules这个东西，这个类库可以让class处理成唯一的名称，但是它是在运行时做的处理，也就是说它是在浏览器运行的时候才会去做代码class名称的替换（不知道现在还是不是）。

vue-loader自己也有一套scoped机制，原理是给元素添加唯一的attribute，但是class还是会受到全局定义的影响。

基于上面的出发点，我想照着vue-loader中style的scoped属性那样做类似的处理，添加一个css-modules的属性，让class名称变得真·唯一，而且是在编译期间做好处理。所以有了这个Fork。

优点：

1.	使用了css-modules。再也不用担心样式重名。

缺点：

1.	 css-modules的使用务必会带来大量的冗余代码，毕竟每个模块的样式不能复用的话样式表也会大增。使用css框架的好处是这些框架定义了一些常用样式能让我们使用更通用的方法去处理样式。 但是如果用了webpack的code split特性（动态加载模块）的话，这些影响就会小很多。
2.	目前它还不支持其他html模板语言如jade，ejs等。
3. 仅对class做处理，不处理id或者其他属性的唯一性
4. [ ] 没有sourceMap

**NOTE: the master branch now hosts 9.x which only works with Vue 2.0. For version 8.x which works with Vue 1.x, see the [8.x branch](https://github.com/vuejs/vue-loader/tree/8.x).**

It allows you to write your components in this format:

![screenshot](http://blog.evanyou.me/images/vue-component.png)

The best way to get started is with [vue-cli](https://github.com/vuejs/vue-cli):

``` js
npm install -g vue-cli
vue init webpack-simple hello
cd hello
npm install
npm run dev
```

This will setup a basic Webpack + `vue-loader` project for you, with `*.vue` files and hot-reloading working out of the box!

For advanced `vue-loader` configuration, checkout the [documentation](http://vuejs.github.io/vue-loader/).


