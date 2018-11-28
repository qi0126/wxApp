const app = getApp()
Page({

  data: {
    $img: app.$img,
    $simg: app.$simg, 
    proList: [], //产品列表详情
    categoryName: '', //分类产品
    hideTF: true,
    proAllData: {}, //接口返回值
    categoryId: '',
    num: 1,
    otherParams: {}, // 搜索参数
  },
 
  //筛选弹出层出现
  show() {
    this.select.show()
  },
  
  //筛选后产品数据返回
  _returnData(item) {
    const params = item.detail
    this.setData({
      num: 1,
      otherParams: params
    })
    app.$u.showLoading()
    this.getData(1)
  },

  // 设计师产品
  getData(num) {
    let params = {
      page: num,
      rows: 20,
      categoryId: this.data.categoryId
    }
    Object.assign(params, this.data.otherParams)
    app.$api.selectStoreBrandProduct(params).then(res => {
      // 验证登录
      app.$u.userStatu().then().catch(err => {
        res.data.data.forEach(item => {
          item.wishHide = true
        })
        this.setData({
          proList: this.data.proList
        })
      })
      // 分页
      this.setData({
        result: res.data,
        proList: num === 1 ? res.data.data : this.data.proList.concat(res.data.data),
      })
      if (this.data.proList && this.data.proList.length >= res.data.rowSize) {
        this.setData({
          loadMore: true
        })
      } else {
        this.setData({
          loadMore: false
        })
      }
    })
  },

  loadMore() {
    this.setData({
      num: this.data.num + 1
    })
    this.getData(this.data.num)
  },

  onReachBottom(e) {
    this.loadMore()
  },

  //产品详情跳转
  proToDetail(e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/productDetail/productDetail?productId=${data.item.productId}&way=band`,
    })
  },

  goShop() {
    wx.switchTab({
      url: '/pages/shop/shop/shop',
    })
  },

  //添加到心愿单
  addWish(e) {
    var params = {
      productId: e.currentTarget.dataset.item.productId
    }
    app.$api.wishproductInsertWishProduct(params).then(res => {
      this.data.proList.forEach(item => {
        if (params.productId == item.productId) {
          item.checkWish = !item.checkWish
        }
      })
      this.setData({
        proList: this.data.proList
      })
    })
  },

  onShow() {
    app.$u.showLoading()
    app.$api.selectTextureAndCrowd().then(res => {
      var tempObj = res.data;
      this.setData({
        proAllData: res.data
      })
    })
  },

  onLoad(options) {
    console.log(options)
    this.select = this.selectComponent(`#selectCommon`)
    this.setData({
      categoryName: options.categoryName,
      categoryId: options.categoryId
    })
    this.getData(1)
    wx.setNavigationBarTitle({
      title: options.categoryName
    })
    var params = {
      categoryId: options.categoryId
    }

  },
})