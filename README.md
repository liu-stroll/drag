# drag
vue 拖拽

## 安装

```js
npm i @stroll/drag

```
## 引入
```js
import Vue from 'vue'
import Drag from '@stroll/drag'

Vue.use(Drag)

```
## 调用
```html
// 需要拖拽的组件添加 v-dialogDrag
// v-dialogDrag 可以传两个参数 drag 和 modal（v-dialogDrag="{ drag: 'ivu-modal-header', modal: 'ivu-modal' }"）；
//              也可不传，不穿默认 iviewUI 的 Modal 组件类名
// drag 为 鼠标按下部分 class 名，可传 字符串 （drag: 'ivu-modal-header'）或 数组（drag: ['ivu-modal-header', 'ivu-modal-footer]）
// modal 为 需要拖拽的窗口 class 名，只可传字符串
<div v-dialogDrag>
  <div class="ivu-modal">
    <div class="ivu-modal-header">头部分</div>
    <div>内容部分</div>
    <div class="ivu-modal-footer">脚部分</div>
  </div>
</div>
```