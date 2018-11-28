const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    $img: app.$img,
    $simg: app.$simg,
    proList: [], //产品数据列表
    proAllData: {}, //接口返回值
    hideTF: true, //筛选弹出框
    designerId: '', //当前设计师id
    designerList: [], //设计师列表
    designerData: {}, //当前设计师个人信息
    designerFlag: true, //设计师弹出框
    designerDetailFlag: true, //设计师详情弹出框
    num: 1,
    otherParams: {}, // 搜索参数
  },

  //筛选弹出层出现
  show() {
    this.select.show()
  },

  //筛选弹出层消失
  hide() {
    this.select.hide()
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

  //设计师弹出层出现
  designerShow: function () {
    this.setData({
      designerFlag: false
    })
  },

  //设计师弹出层消失
  designerHide: function () {
    this.setData({
      designerFlag: true
    })
  },

  //设计师详情弹出层出现
  designerDetailShow: function (e) {
    this.setData({
      designerFlag: true,
      designerDetailFlag: false
    })
  },

  //设计师详情弹出层消失
  designerDetailHide: function () {
    this.setData({
      designerDetailFlag: true
    })
  },

  returnDesigner: function () {
    this.setData({
      designerFlag: false,
      designerDetailFlag: true
    })
  },

  //适合人群选择
  PriceCheckbox: function (e) {
    var self = this;
    for (let i = 0; i < self.data.priceList.length; i++) {
      if (self.data.priceList[i].id == e.target.dataset.item.id) {
        self.data.priceList[i].checked = true
      } else {
        self.data.priceList[i].checked = false
      }
    }
    this.setData({
      priceList: self.data.priceList
    })
  },

  //适合人群选择
  MaterCheckbox: function (e) {
    var self = this;
    for (let i = 0; i < self.data.materList.length; i++) {
      if (self.data.materList[i].id == e.target.dataset.item.id) {
        self.data.materList[i].checked = !self.data.materList[i].checked
        this.setData({
          materList: self.data.materList
        })
        return
      }
    }
  },

  //适合人群选择
  ManCheckbox: function (e) {
    var self = this;
    for (let i = 0; i < self.data.manList.length; i++) {
      if (self.data.manList[i].id == e.target.dataset.item.id) {
        self.data.manList[i].checked = !self.data.manList[i].checked
        this.setData({
          manList: self.data.manList
        })
        return
      }
    }
  },

  //路由跳转
  RouterCheck(e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/productDetail/productDetail?productId=${data.item.productId}&way=des`,
    })
  },

  // 设计师产品
  getData(num) {
    let params = {
      page: num,
      rows: 20,
    }
    Object.assign(params, this.data.otherParams)

    // 如果搜索设计师
    if (this.data.desInfo) {
      const { designerId } = this.data.desInfo
      if (designerId) Object.assign(params, { designerId })
    }

    // 如果搜索系列
    if (this.data.desInfoSeries) {
      const { id } = this.data.desInfoSeries
      if (id) Object.assign(params, { seriecsId: id })
    }

    app.$api.selectDesignerProduct(params).then(res => {
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

  onShow() {
    // 初始化弹窗

    app.$u.showLoading()
    this.getData(1)
    app.$api.selectDesignerTextureAndCrowd().then(res => {
      var tempObj = res.data;
      if (this.data.desInfoSeries) {
        if (res.data.seriecs) delete res.data.seriecs
      }
      this.setData({
        proAllData: res.data
      })
    })

  },

  onLoad(options) {
    this.select = this.selectComponent(`#selectCommon`)
    if (options.desInfo) {
      this.setData({
        desInfo: JSON.parse(options.desInfo)
      })
    }
    if (options.desInfoSeries) {
      this.setData({
        desInfoSeries: JSON.parse(options.desInfoSeries)
      })
    }
  },

  //设计师查询接口
  getDesInfo() {
    app.$api.selectDesignerInfo().then((res) => {
      this.setData({
        designerList: res.data
      })
    });
  },

  goShop() {
    wx.switchTab({
      url: '/pages/shop/shop/shop',
    })
  },

  //添加到心愿单
  addWish(e) {
    var self = this;
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

})