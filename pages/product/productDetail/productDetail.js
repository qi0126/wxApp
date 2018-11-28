let WxParse = require('../../../utils/wxParse/wxParse.js');

const app = getApp()
 
Page({
  data: {
    result: {},
    oneList: [],
    twoList: [],
    threeList: [],
    fourList: [],
  
    $img: app.$img,
    $simg: app.$simg,
    currentSwiper: 0,
    // shopCartState: false, //购物车状态,
    proData: {}, //产品详情数据
 
    // 详情
    goWay: `shop`,
    propShow: false,

    // 数量
    totalCount: 0,
  },

  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  }, 

  countToatal(num) {
    const { totalCount } = this.data
    this.setData({
      totalCount: totalCount + num
    })
  },

  // 加入购物车
  goShopCart() {
    // 验证登录权限
    app.$u.userStatu().then(res => {
      console.log(res)
      this.addSize.showShopCartDialog();
      this.setData({
        goWay: 'shop',
        propShow: true,
      })
    }).catch(err => {
      console.log(err)
      this.showLogin.show()
    })

  },

  // 买单
  goPay() {
    // 验证登录权限
    app.$u.userStatu().then(res => {
      this.addSize.showShopCartDialog();
      this.setData({
        goWay: 'pay',
        propShow: true,
      })
    }).catch(err => {
      this.showLogin.show()
    })

  },

  // 获取弹窗参数
  changeParams(e) {
    const paramsProp = e.detail
    this.setData({
      paramsProp
    })
  },

  cancelEvent(e) {
    this.setData({
      propShow: false
    })
  },

  // 确定
  handleTrue() {
    let params;
    const proData = this.data.proData,
      paramsProp = this.data.paramsProp
    if (this.data.goWay === `shop`) {
      params = {
        proId: proData.productCode,
        num: paramsProp.num,
        proType: proData.productType,
        specInfo: paramsProp.specInfo,
      }
      app.$api.cartAdd(params).then(res => {
        app.$u.showToast(res.msg)
        this.addSize.hideShopCartDialog();
        this.setData({
          propShow: false,
          num: 1
        })
      })
      this.countToatal(paramsProp.num)
    } else if (this.data.goWay === `pay`) {

      const proList = [{
        proId: proData.productCode,
        proName: proData.resalePrice,
        picUrl: proData.images[0].imageUrl,
        specInfo: JSON.parse(paramsProp.specInfo),
        num: paramsProp.num,
        price: proData.resalePrice,
        proType: proData.productType
      }]

      wx.navigateTo({
        url: `/pages/product/productOrder/productOrder?proList=${JSON.stringify(proList)}&way=detail`
      })
    }

  },

  // 获取店铺详情
  getBandDetail(params) {
    app.$api.selectStoreBandProduct(params).then(res => {
      this.getBandData(res)
    })
  },

  // 获取设计师详情
  getClassDetail(params) {
    app.$api.selectStoreDesignerProduct(params).then(res => {
      this.getDesData(res)
    })
  },

  // 获取购物车详情
  getShopDetail(params) {
    app.$api.selectStoreCartProductInfo(params).then(res => {
      this.getShopData(res)
    })
  },

  // 处理店铺详情数据
  getBandData(res) {
    // 组件赋值
    const result = res.data;
    let designItem = {},
      boyDesignItem = {},
      girlDesignItem = {}
    result.price = result.resalePrice
    result.code = result.productCode
    result.textures.forEach(item => {
      this.data.oneList.push({
        val: item.textureName,
        code: item.textureName,
        id: item.id
      })
    })

    result.designs.forEach(item => {
      if (item.designName === `款式尺寸`) {
        designItem = item
      } else if (item.designName === `男士尺寸`) {
        boyDesignItem = item
      } else if (item.designName === `女士尺寸`) {
        girlDesignItem = item
      }
    })

    if (designItem.designValue) {
      designItem.designValue.split(',').forEach(item => {
        this.data.twoList.push({
          val: item,
          code: item,
          id: designItem.id
        })
      })
    }

    if (boyDesignItem.designValue) {
      boyDesignItem.designValue.split(',').forEach(item => {
        this.data.threeList.push({
          val: item,
          code: item,
          id: boyDesignItem.id
        })
      })
    }

    if (girlDesignItem.designValue) {
      girlDesignItem.designValue.split(',').forEach(item => {
        this.data.fourList.push({
          val: item,
          code: item,
          id: girlDesignItem.id
        })
      })
    }

    this.setData({
      result: result,
      oneList: this.data.oneList,
      twoList: this.data.twoList,
      threeList: this.data.threeList,
      fourList: this.data.fourList,

      // 全部信息
      proData: res.data,
      texture: this.data.oneList.map(item => item.val).join('/'),  // 材质
      size: this.data.twoList.map(item => item.val).join('/')  // 尺寸
    })

    // 文本为空判断
    if (!this.data.result.details) {
      this.data.result.details = '  '
      this.setData({
        result: this.data.result
      })
    }
    WxParse.wxParse('article', 'html', this.data.result.details, this, 5);
  },

  // 处理设计师详情数据
  getDesData(res) {
    this.getBandData(res) 
  },

  // 处理店铺详情数据
  getShopData(res) {
    this.getBandData(res) 
  },

  goShop() {
    wx.switchTab({
      url: '/pages/shop/shop/shop',
    })
  },

  openDes() {
    this.design.show()
  },

  openSeries() {
    this.desc.show()
  },
  
  handleSearch(e) {
    wx.navigateTo({
      url: `/pages/designer/detailToDes/detailToDes?desInfo=${JSON.stringify(e.detail)}`,
    })
  },

  searSerise(e) {
    console.log(e.detail)
    wx.navigateTo({
      url: `/pages/designer/detailToDes/detailToDes?desInfoSeries=${JSON.stringify(e.detail)}`,
    })
  },

  onShow() {
    this.addSize.hideShopCartDialog();
  },

  onLoad(options) {
    this.showLogin = this.selectComponent("#showLogin")
    this.design = this.selectComponent("#design")
    this.desc = this.selectComponent("#desc")
    this.addSize = this.selectComponent("#addSize");
    
    let params;

    // 店家详情
    if (options.productId) {
      params = {
        id: options.productId,
      }
    }
    
    // 设计师详情
    if (options.productNo){
      params = {
        productNo: options.productNo,
      }
    }

    if(options.way) {
      this.setData({
        way: options.way
      })
    }
    
    if (options.way === 'band') {
      this.getBandDetail(params)
    } else if (options.way === 'des') {
      this.getClassDetail(params)
    } else if(options.way === 'shop') {
      this.getShopDetail(params)
    }

    if (!this.data.result.details) {
      this.data.result.details = " "
    } 

  },

})