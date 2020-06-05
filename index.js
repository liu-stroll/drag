export default {
  install: function (Vue) {
    Vue.directive('sDragDialog', {
      bind: function (el, binding) {
        var _dragEl = []
        var dragEl = {}
        var dragDom = el.querySelector('.' + (binding.value.modal || 'ivu-modal'))
        if (binding.value.drag) {
          if (typeof binding.value.drag === 'string') {
            _dragEl.push(binding.value.drag)
            dragEl[binding.value.drag] = el.querySelector('.' + binding.value.drag)
          } else if (Array.isArray(binding.value.drag) && binding.value.drag.length) {
            binding.value.drag.forEach(function (v) {
              _dragEl.push(v)
              dragEl[v] = el.querySelector('.' + v)
            })
          } else {
            console.error('dialogDrag 的 drag 必须是字符串或数组 且 数组不能为空')
            return
          }
        } else {
          ['ivu-modal-header'].forEach (function (v) {
            _dragEl.push(v)
            dragEl[v] = el.querySelector('.' + v)
          })
        }
        
        _dragEl.forEach(function (v) {
          dragEl[v].style.cssText += ';cursor:move;'
        })
        dragDom.style.cssText += ';top:0px;'
      
        var sty = null
        if (window.document.currentStyle) {
          sty = function (dom, attr) { return dom.currentStyle[attr] }
        } else {
          sty = function (dom, attr) { return getComputedStyle(dom, false)[attr] }
        }

        function onmousedown (e) {
          var disX = e.clientX - dragEl[_dragEl[0]].offsetLeft
          var disY = e.clientY - dragEl[_dragEl[0]].offsetTop
      
          var screenWidth = document.body.clientWidth
          var screenHeight = document.documentElement.clientHeight
      
          var dragDomWidth = dragDom.offsetWidth
          var dragDomheight = dragDom.offsetHeight
      
          var minDragDomLeft = dragDom.offsetLeft
          var maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
      
          var minDragDomTop = dragDom.offsetTop
          var maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight
      
          var styL = sty(dragDom, 'left')
          var styT = sty(dragDom, 'top')
      
          if (styL.includes('%')) {
            /* eslint-disable */
            styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
            /* eslint-disable */
            styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
          } else {
            styL = +styL.replace(/\px/g, '')
            styT = +styT.replace(/\px/g, '')
          }
      
          document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离 
            var left = e.clientX - disX;
            var top = e.clientY - disY;
      
            if (-(left) > minDragDomLeft) {
              left = -(minDragDomLeft);
            } else if (left > maxDragDomLeft) {
              left = maxDragDomLeft;
            }
      
            if (-(top) > minDragDomTop) {
              top = -(minDragDomTop)
            } else if (top > maxDragDomTop) {
              top = maxDragDomTop
            }
      
            dragDom.style.cssText += ';left:' + (left + styL) + 'px;top:' + (top + styT) + 'px;'
          }
      
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
          }
        }

        _dragEl.forEach(function (el) {
          dragEl[el].onmousedown = onmousedown
        })
      }
    })

    Vue.directive('sDrag', {
      inserted: function(el) {
        el.style.position = 'fixed'
        el.style.zIndex = '99999'
        // el.style.right = '9%'
        // el.style.bottom = '9%'
        el.onmousedown = function(e) {
          var disX = e.clientX - el.offsetLeft
          var disY = e.clientY - el.offsetTop
    
          if (el.setCapture) {
            el.setCapture()
          }
          document.onmousemove = function(e) {
            e.preventDefault && e.preventDefault()
            var L = e.clientX - disX
            var T = e.clientY - disY
    
            L = Math.min(Math.max(L, 0), document.documentElement.clientWidth - el.offsetWidth)
            T = Math.min(Math.max(T, 0), document.documentElement.clientHeight - el.offsetHeight)
    
            el.style.left = L + 'px'
            el.style.top = T + 'px'
          }
          document.onmouseup = function() {
            document.onmousemove = document.onmousedown = null
            if (el.releaseCapture) {
              el.releaseCapture()
            }
          }
        }
      }
    })

    Vue.directive('sDragSort', {
      bind: function (el) {
        var box1 = el.querySelector('.box1')
        var box2 = el.querySelector('.box2')

        var box1child = box1.childNodes
        var borderArr = ['1px solid #ccc', '2px dashed #000']
        var arr = []

        box1child.forEach(item => {
          if(item.nodeName == "#text" && !/\s/.test(item.nodeValue)){
            document.getElementById("test").removeChild(item)
          } else {
            item.setAttribute('draggable', true)
          }
        })

        // box1.ondragStart = dragStart
        // box2.ondragStart = dragStart
        box1.ondragenter = dragEnter
        box2.ondragenter = dragEnter
        box1.ondragover = dragOver
        box2.ondragover = dragOver
        box1.ondragleave = dragLeave
        box2.ondragleave = dragLeave
        box1.ondrop = drop
        box2.ondrop = drop
        // box2.ondragend = box1.ondragend = dragEnd

        arr.forEach.call(box1child, function(col) {
          col.style.border = borderArr[0]
          col.addEventListener('dragstart', dragStart, false)
          // col.addEventListener('dragenter', dragEnter, false)
          // col.addEventListener('dragover', dragOver, false)
          // col.addEventListener('dragleave', dragLeave, false)
          // col.addEventListener('drop', drop, false)
          // col.addEventListener('dragend', dragEnd, false)
        })

        function dragStart (e) { // 开始拖动
          this.style.opacity = '0.4'
          e.dataTransfer.setData('Text', e.target.id)
          console.log('dragStart', e, e.dataTransfer)
        }
        function dragEnter (e) { // 到一个可释放目标时触发
          this.style.border = borderArr[1]
          // console.log('到一个可释放目标时触发', e)
        }
        function dragOver (e) { // 到一个可释放目标上时触发
          // console.log('到一个可释放目标上时触发', e)
          e.preventDefault && e.preventDefault()
        
          e.dataTransfer.dropEffect = 'move'
        }
        function dragLeave (e) { // 离开一个可释放目标时触发
          this.style.border = borderArr[0]
          // console.log('离开一个可释放目标时触发', e)
        }
        function drop (e) { // 可释放目标上被释放时触发
          // e.stopPropagation && e.stopPropagation()
          // e.preventDefault && e.preventDefault()
          this.style.border = borderArr[0]
          var data = e.dataTransfer.getData('Text')
          var el = document.getElementById(data)
          console.log(el)
          e.target.appendChild(el)
          console.log('可释放目标上被释放时触发', e.dataTransfer, e.target)
        }
        function dragEnd (e) { // 当拖拽操作结束时触发
          // console.log('当拖拽操作结束时触发', e, e.dataTransfer, e.target)
          this.style.border = borderArr[0]
          // arr.forEach.call(box1child, function (col) {
          //   col.style.border = borderArr[0]
          // })
        }
        
        // drag: 当拖动元素或选中的文本时触发
        
        // dragend: 当拖拽操作结束时触发 (比如松开鼠标按键或敲“Esc”键)

        // dragexit: 当元素变得不再是拖动操作的选中目标时触发

        // dragenter: 当拖动元素或选中的文本到一个可释放目标时触发
        
        // dragleave: 当拖动元素或选中的文本离开一个可释放目标时触发。

        // dragover: 当元素或选中的文本被拖到一个可释放目标上时触发

        // dragstart: 当开始拖动一个元素或选中的文本时触发
        
        // drop: 当元素或选中的文本在可释放目标上被释放时触发
      }
      // inserted: function () {
      //   setTimeout(() => {console.log('inserted')}, 2000)
      // },
      // update: function () {
      //   setTimeout(() => {console.log('update')}, 1000)
      // },
      // componentUpdated: function () {
      //   setTimeout(() => {console.log('componentUpdated')}, 20)
      // },
      // unbind: function () {
      //   setTimeout(() => {console.log('unbind')}, 3000)
      // }
    })
  }
}
