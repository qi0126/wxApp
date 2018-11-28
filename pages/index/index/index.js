const app = getApp()

Page({

  data: {
    list: [],
    shopName: false,
    $img: app.$simg,
    $simg: app.$simg
  },

  shopDes () { 
    if (this.data.shopName) {
      this.setData({
        shopName: false
      }) 
    } else {
      this.setData({
        shopName: true
      })
    }
  }, 

  searchFun () {
    wx.navigateTo({
      url: "../../search/search/search?currentPage=home"
    })
  },

  goProductDetail(e) {
    const data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/product/productDetail/productDetail?productId=${data.productId}&way=des`
    })
  },

  getShop() {
    return Promise.resolve(app.$api.userShop().then(res => {
        this.setData({
          shopInfo: res.data
        })
      })
    )
  },

  getList() {
   return app.$api.productSelectHotgunStoreProduct({}).then(res => {
      res.data.forEach(item => {
        item.textureNumber = item.textureNumber.split(',').join('  |  ')
      })
      this.setData({
        list: res.data
      })
    })
  },

  judgeUrl(url) {
    let result 
    if(url.indexOf('?') > 0) {
      result = url.split('?').reverse()[0].split('=').reverse()[0]
    }else {
      result = url.split('/').reverse()[0]
    }
    return result
  },

  onShareAppMessage(res) {
    return {
      title: this.data.shopInfo.nickName,
      path: `/pages/index/index/index?shareShopId=${wx.getStorageSync('shopId')}`,
    }
  },

  getData() {
    this.getList()
    this.getShop()
  },
 
  onShow() {
    app.$api.cartNum()
    if (wx.getStorageSync('shopId')) {
      this.getData()
    } 
  },

  onLoad(options) {
    let scode
    this.showLogin = this.selectComponent("#showLogin");
    
    // 扫码获取店铺id 
    if(options.q) {
      scode = this.judgeUrl(decodeURIComponent(options.q))
    }

    // 获取分享店铺id
    if (options.shareShopId) {
      scode = options.shareShopId
    }

    let params = {
      scode
    }

    // 验证登录权限
    app.$u.userStatu().then().catch(err => {
      this.showLogin.show()
    })
    
    app.$api.getLogin(params).then(res => {
      this.getData()
    })

  }

})