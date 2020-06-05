module.exports = {
  install: function (Vue) {
    Vue.directive('dialogDrag', {
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
          var sty = function (dom, attr) { return dom.currentStyle[attr] }
        } else {
          var sty = function (dom, attr) { return getComputedStyle(dom, false)[attr] }
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
            styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
            styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
          } else {
            styL = +styL.replace(/\px/g, '')
            styT = +styT.replace(/\px/g, '')
          };
      
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
  }
}
