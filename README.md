# dom-maker

A library for create element by VanillaJs easily

## install

```bash
npm install dom-maker
# 或
yarn add dom-maker
```

## useage

```js
import $ from 'dom-maker';

const dom = $('div')
  .setAttr('data-type', 'img-box')
  .addChildren([
    $('div')
      .addClass('left-area')
      .addChildren([
        $('img')
          .addClass('img cover')
          .setAttr('draggable', false)
          .setAttr('src', 'https://source.unsplash.com/8xznAGy4HcY/800x400'),
      ]),
    $('div')
      .addClass('right-area')
      .addChildren([
        $('div').addClass('title').setText('title'),
        $('div').addClass('href').setText('href'),
      ]),
  ])
  .getElm();

// equal to

// <div data-type="img-box">
//   <div class="left-area">
//     <img src="https://source.unsplash.com/8xznAGy4HcY/" draggable="flase" class="img cover">
//   </div>
//   <div class="left-area">
//     <div class="title">title</div>
//     <div class="href">href</div>
//   </div>
// </div>

document.body.append(dom);
```
