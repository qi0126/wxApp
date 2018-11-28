const app = getApp()

Page({

  data: {
    result: {},
    oneList: [],
    twoList: [],
    $simg: app.$simg,
    currentSwiper: 0,
    // shopCartState: false, //购物车状态,
    proData: {}, //产品详情数据
  },

  onReady: function() {
    //获得dialog组件
    this.addSize = this.selectComponent("#addSize");
  },

  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  preventTouchMove: function(e) {
    console.log('滑动');
  },

  // 加入购物车
  goShopCart: function() {
    this.addSize.showShopCartDialog();
    if (!this.addSize.data.isShow) {
      var tempList = [{
        "specId": 3,
        "specView": "材质",
        "specName": "材质",
        "specValue": "玫瑰金"
      }, {
        "specId": 70,
        "specView": "尺寸",
        "specName": "尺寸",
        "specValue": "22"
      }]
      let params = {
        proId: this.data.proData.id,
        num: 6,
        proType: this.data.proData.productType,
        specInfo: JSON.stringify(tempList),
      }
      console.log(params)
      app.$api.cartAdd(params).then(res => {
        console.log(res.data)
      })
    }


  },
  //购物车
  _cancelEvent() {
    this.addSize.hideShopCartDialog();
  },

  // 获取弹窗参数
  getParams(e) {
    const paramsProp = e.detail
    this.setData({
      paramsProp
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var self = this
    let params = {
      id: options.productId
    }
    app.$api.selectStoreBandProduct(params).then(res => {

      // 组件赋值
      const result = res.data
      result.price = result.resalePrice
      result.code = result.productCode
      result.textures.forEach(item => {
        this.data.oneList.push({ val: item.textureName, code: item.textureName })
      })
      result.designs[1].designValue.split(',').forEach(item => {
        this.data.twoList.push({ val: item, code: item })
      })
      console.log(this.data.oneList, this.data.twoList)
      this.setData({
        result: result,
        oneList: this.data.oneList,
        twoList: this.data.twoList,
        proData: res.data
      })

    })


  },

})