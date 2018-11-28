const app = getApp()
 
Page({
  data: { 
    rotate1: 3600 - 360,
    rotate2: 3600 + 360,
    rotate3: 3600 - 360,
    rotate4: 3600 + 360,
    weightList: [],
    colorList: [],
    neatList: [],
    cutList: [],
    weightScaleList: [],
    colorScaleList: [],
    neatScaleList: [],
    cutScaleList: [],
    weightListStart: [0.3, 0.4, 0.5, 0.7, 0.8, 1.0, 2.0, 3.0, 5.0, 3.0, 2.0, 1.0, 0.8, 0.7, 0.5, 0.4],
    colorListStart: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'I', 'H', 'G', 'F', 'E'],
    neatListStart: ['VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2'],
    cutListStart: ['EX', 'VG', 'GD', 'FAIR', 'GD', 'VG'],
    rotate1Start: 3600,
    rotate2Start: 3600,
    rotate3Start: 3600, 
    rotate4Start: 3600,

    // 刻度角度
    rotate1Scale: 0,
    rotate2Scale: 0,
    rotate3Scale: 0,
    rotate4Scale: 0,
 
    // 调整刻度
    rotate1OffsetIndex: 0,
    rotate2OffsetIndex: 0,
    rotate3OffsetIndex: 0,
    rotate4OffsetIndex: 0,

    // 适配基数
    baseWidthNum: 0,
    baseHeightNum: 0,

    // 旋转速度
    roTime: 2,

    // 防抖
    // stop: false
  },

  goGIA() {
    wx.navigateTo({
      url: '/pages/class/GIA/GIA',
    })
  },

  goDiamond() {
    wx.navigateTo({
      url: '/pages/class/diamondRotate/diamondRotate',
    })
  },


  // 滑动删除
  touchstart(e) {
    this.setData({
      roTime: 0
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
    })
  },

  touchmove(e) {

    let that = this,
      data = e.currentTarget.dataset.data,
      style = e.currentTarget.dataset.style,
      startX = this.data.startX,
      startY = this.data.startY,
      touchMoveX = e.changedTouches[0].clientX,
      touchMoveY = e.changedTouches[0].clientY,
      // moveDire = `moveDire${data}`,
      angle = this.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        })

    // if (Math.abs(angle) < 10) { 
    //   this.setData({
    //     stop: true
    //   })
    //   return
    // }else {
    //   this.setData({
    //     stop: false
    //   })
    // }

    this.offset(angle, data, style)
    // this.setData({
    //   [rotate]: angle + this.data[dataStart]
    // })
    // if (touchMoveX > startX) {
    //   moveDire = 1
    // } else {
    //   moveDire = 2
    // }
  },

  offset(angle, data, style) {
    let rotate = `rotate${data}`
    let dataStart = `rotate${data}Start`
    let dataList = `${style}ScaleList`
    this.setData({
      [rotate]: angle + this.data[dataStart]
    })

    this.count(angle, data, style, this.data[dataList], (num, callData, i) => {
      let dataOffsetIndex = `rotate${callData}OffsetIndex`
      this.setData({
        [dataOffsetIndex]: i
      })
    })
  },

  count(angle, data, style, arr, callback) {
    let rotate = `rotate${data}`
    let cont = Math.abs(this.data[rotate] % 360)
    let dataOffsetIndex = `rotate${data}OffsetIndex`

    if (angle >= 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= cont) {
          callback(arr[i], data, i)
          return
        }
      }
    }
    if (angle <= 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= cont && arr[i + 1] >= cont) {
          callback(arr[i], data, i + 1)
          return
        }
      }
    }
  },

  touchend(e) {
    // if(this.data.stop) {
    //   return
    // }
    const self = this
    let data = e.currentTarget.dataset.data
    let style = e.currentTarget.dataset.style
    let rotate = `rotate${data}`
    let offsetIndex = e.currentTarget.dataset.offsetindex
    let dataStart = `rotate${data}Start`
    let dataList = `${style}ScaleList`

    let scale = this.data[`rotate${data}Scale`]
    
    let poor = scale - this.data[rotate] % scale

    this.setData({
      roTime: 1
    })

    setTimeout(() => {
      self.setData({
        roTime: 0
      })
    }, 1000)
    
    this.setData({
      [rotate]: parseInt(this.data[rotate]) + parseInt(scale) - parseInt(this.data[rotate] % scale),
      [dataStart]: parseInt(this.data[rotate]) + parseInt(scale) - parseInt(this.data[rotate] % scale)
    })

    // this.setData({
      // [rotate]: this.data[dataList][offsetIndex]
    // })

    // this.setData({
    //   [dataStart]: this.data[rotate],
    // })
    this.getScale(style, offsetIndex)
    this.getRotate()
  },

  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  go4C() {
    wx.navigateTo({
      url: '/pages/class/4C/4C',
    })
  },

  countScaleStart() {
    let weightList = [],
      colorList = [],
      neatList = [],
      cutList = []
    let scale = 360 / this.data.weightListStart.length
    for (let i = 0; i < this.data.weightListStart.length; i++) {
      this.data.weightScaleList.push(parseInt(i * scale))
      weightList.push({
        num: this.data.weightListStart[i],
        rotate: parseInt(i * scale)
      })
    }
    this.setData({
      rotate1Scale: scale
    })
    scale = 360 / this.data.colorListStart.length
    for (let i = 0; i < this.data.colorListStart.length; i++) {
      this.data.colorScaleList.push(parseInt(i * scale))
      colorList.push({
        num: this.data.colorListStart[i],
        rotate: parseInt(i * scale)
      })
    }
    this.setData({
      rotate2Scale: scale
    })
    scale = 360 / this.data.neatListStart.length
    for (let i = 0; i < this.data.neatListStart.length; i++) {
      this.data.neatScaleList.push(parseInt(i * scale))
      neatList.push({
        num: this.data.neatListStart[i],
        rotate: parseInt(i * scale)
      })
    }
    this.setData({
      rotate3Scale: scale
    })
    scale = 360 / this.data.cutListStart.length
    for (let i = 0; i < this.data.cutListStart.length; i++) {
      this.data.cutScaleList.push(parseInt(i * scale))
      cutList.push({
        num: this.data.cutListStart[i],
        rotate: parseInt(i * scale)
      })
    }
    this.setData({
      rotate4Scale: scale
    })

    this.setData({
      weightList,
      colorList,
      neatList,
      cutList,
    })
  },

  // 获取刻度
  getScale(style, offsetIndex) {
    if (style === 'weight') {
      this.setData({
        carat: this.data.weightListStart[offsetIndex]
      })
    }
    if (style === 'color') {
      this.setData({
        color: this.data.colorListStart[offsetIndex]
      })
    }
    if (style === 'neat') {
      this.setData({
        clarity: this.data.neatListStart[offsetIndex]
      })
    }
    if (style === 'cut') {
      this.setData({
        cut: this.data.cutListStart[offsetIndex]
      })
    }
  },

  // 获取价格
  getRotate() {
    const params = {
      carat: this.data.carat,
      color: this.data.color,
      clarity: this.data.clarity,
      cut: this.data.cut
    }
    app.$api.diamondFindDiamond(params).then(res => {
      let price
      if(res.data) {
        const { sellingPrice } = res.data
        price = sellingPrice
      }else {
        price = 0
      }
      this.setData({
        price
      })
    })
  },

  // 查询钻石
  getAttrList() {
    return new Promise((reslove, reject) => {
      app.$api.diamondAttr().then(res => {
        const data = res.data
        this.data.weightListStart = data.carat.concat((data.carat.slice(1, data.carat.length - 1)).reverse())
        this.data.colorListStart = data.color.concat((data.color.slice(1, data.color.length - 1)).reverse())
        this.data.neatListStart = data.clarity.concat((data.clarity.slice(1, data.clarity.length - 1)).reverse())
        this.data.cutListStart = data.cut.concat((data.cut.slice(1, data.cut.length - 1)).reverse())
        this.setData({
          weightListStart: this.data.weightListStart,
          colorListStart: this.data.colorListStart,
          neatListStart: this.data.neatListStart,
          cutListStart: this.data.cutListStart,
        })
        this.setData({
          carat: this.data.weightListStart[0],
          color: this.data.colorListStart[0],
          clarity: this.data.neatListStart[0],
          cut: this.data.cutListStart[0]
        })
        this.getRotate({})
        
        reslove(res)
      })
    })
  },

  onLoad(options) {
    this.getAttrList().then(res => {
      let start = 375,
        width, height, self = this;
      wx.getSystemInfo({
        success(res) {
          width = res.screenWidth / 375
          height = res.screenHeight / 375
          self.setData({
            baseWidthNum: width,
            baseHeightNum: height
          })
        }
      })
      this.countScaleStart()
    })

  },

  onShow() {
    const self = this
    this.setData({
      rotate1: this.data.rotate1 + 360,
      rotate3: this.data.rotate3 + 360,
      rotate2: this.data.rotate2 - 360,
      rotate4: this.data.rotate4 - 360
    })
    this.setData({
      roTime: 2
    })
    setTimeout(() => {
      self.setData({
        roTime: 0
      })
    }, 2000)
  }

})