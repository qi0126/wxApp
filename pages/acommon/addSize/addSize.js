const app = getApp()
 
Component({
 
  properties: {
    result: Object,
    image: String,

    oneList: Array,
    twoList: Array,
    threeList: Array,
    fourList: Array,

    propShow: {
      type: Boolean, 
      value: false,
    } 
  },


  data: {
    scrollHeight: 0, 
    slideHight: 0,
    animationHeight: 190,
    contentHeight: 760,

    $img: app.$img,
    $simg: app.$simg,
    isShow: false,

    num: 1,
    oneIndex: 0,
    twoIndex: 0,
    threeIndex: 0,
    fourIndex: 0,
    one: {},
    two: {},
    three: {},
    four: {},
  },

  created() {
    const self = this
    this.animation = wx.createAnimation({
      duration: 300
    })
  },

  methods: {

    //隐藏弹框
    hideShopCartDialog() {
      const self = this

      setTimeout(() => {
        self.animation.height(this.data.screenHeight).step()
        self.setData({
          animationData: self.animation.export(),
        })
      }, 0)
      setTimeout(() => {
        self.setData({
          isShow: false
        })
      }, 400)

      this.triggerEvent("cancelEvent", {})
    },

    //展示弹框
    showShopCartDialog() {
      const self = this
      console.log(this.data.threeList)

      if(this.data.threeList.length > 0) {
        this.setData({
          animationHeight: 100,
          contentHeight: 910, 
        })
      }

      wx.getSystemInfo({
        success(res) {
          const ratio = res.screenHeight / 675
          self.setData({
            screenHeight: res.screenHeight,
            slideHight: self.data.animationHeight * parseFloat(ratio.toFixed(2))
          })
        }
      })

      this.setData({
        isShow: true,
        num: 1
      })

      this.setData({
        popuStatus: false,
      })

      setTimeout(() => {
        self.animation.height(this.data.slideHight).step()
        self.setData({
          animationData: self.animation.export()
        })
      }, 0)

      const { oneList, twoList, threeList, fourList, oneIndex, twoIndex, threeIndex, fourIndex} = this.data

      // 默认选择数组第一个
      this.setData({
        one: oneList[oneIndex],
        two: twoList[twoIndex] ,
        three: threeList[threeIndex],
        four: fourList[fourIndex] , 
      })
      this.getParams()
    },
 
    // 减少
    decrease() {
      this.setData({
        num: this.data.num >= 2 ? this.data.num - 1 : 1
      })

      this.getParams()
    },

    // 增加
    increase() {
      this.setData({
        num: this.data.num + 1
      })

      this.getParams()
    },

    oneChange(e) {
      const oneIndex = e.detail.value
      this.setData({
        oneIndex,
        one: this.data.oneList[oneIndex]
      })
      this.getParams()
    },

    twoChange(e) {
      const twoIndex = e.detail.value
      this.setData({
        twoIndex,
        two: this.data.twoList[twoIndex]
      })
      this.getParams()
    },

    threeChange(e) {
      const threeIndex = e.detail.value
      this.setData({
        threeIndex,
        three: this.data.threeList[threeIndex]
      })
      this.getParams()
    },

    fourChange(e) {
      const fourIndex = e.detail.value
      this.setData({
        fourIndex,
        four: this.data.fourList[fourIndex]
      })
      this.getParams()
    },

    // 获取值方法
    getParams() {
      const params = {
        num: this.data.num,
        one: this.data.one,
        two: this.data.two,
        three: this.data.three,
        four: this.data.four,
      }
      this.triggerEvent("getParams", params)
      this.changeParams(params)
    },

    // 默认改编值
    changeParams(params) {
      // var tempList = [{
      //   "specId": 3,
      //   "specView": "材质",
      //   "specName": "材质",
      //   "specValue": "玫瑰金"
      // }, {
      //   "specId": 70,
      //   "specView": "尺寸",
      //   "specName": "尺寸",
      //   "specValue": "22"
      // }]
      let arr = [], specInfo = []
      
      params.one.name = '材质'
      params.two.name = '尺寸'
      params.three.name = '男士尺寸'
      params.four.name = '女士尺寸'
      
      arr = [params.one, params.two]
      
      // 如果没有尺寸
      if (this.data.twoList.length === 0) {
        arr = [params.one]
      }
      // 如果情侶款存在
      if (this.data.threeList.length !== 0) {
        arr = [params.one, params.three, params.four]
      } 

      arr.forEach(item => {
        specInfo.push({
          specId: item.id,
          specView: item.name,
          specName: item.name,
          specValue: item.val
        })
      })
      const defParams = {
        num: params.num,
        specInfo: JSON.stringify(specInfo)
      }
      this.triggerEvent("changeParams", defParams)
    }

  }
})
