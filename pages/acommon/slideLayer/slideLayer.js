const app = getApp()
Component({
  properties: {
    result: Object
  },

  data: {
    $img: app.$img,
    $simg: app.$simg,
    isShow: true
  },
  
  methods: {
    //筛选弹出层消失
    hide() {
      this.setData({
        isShow: true,
      })
    },

    show() {
      const result = this.data.result
      result.field = result.field.replace(',','/')
      this.setData({
        isShow: false,
        result
      })
    },

    goDesDetail() {
      this.triggerEvent(`handleSearch`, this.data.result)
    },

    // 滑动删除begin
    touchstart(e) {
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
      })
    },

    touchmove(e) {
      let that = this,
        index = e.currentTarget.dataset.index,
        startX = that.data.startX,
        startY = that.data.startY,
        touchMoveX = e.changedTouches[0].clientX,
        touchMoveY = e.changedTouches[0].clientY,
        isTouchMove = false,
        angle = that.angle({
          X: startX,
          Y: startY
        }, {
            X: touchMoveX,
            Y: touchMoveY
          });
      if (Math.abs(angle) > 30) return;
      if (touchMoveX > startX - 100)
        isTouchMove = false
      else
        isTouchMove = true

      console.log(touchMoveX, startX, isTouchMove)
      if (isTouchMove) {
        this.hide()
      }
    },

    angle(start, end) {
      var _X = end.X - start.X,
        _Y = end.Y - start.Y
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },


  },

})