const app = getApp()

Page({

  data: {
    $img: app.$img,
    $simg: app.$simg,
    imagesSele: {
      T: `/images/class/checkedTrue.png`,
      F: `/images/class/checkedFalse.png`
    },
    proList: [], //产品数据列表
    proAllData: {}, //接口返回值
    hideTF: true, //筛选弹出框
    designerId: '', //当前设计师id
    designerList: [], //设计师列表
    designerListAll: [], //设计师全部列表
    designerData: {}, //当前设计师个人信息
    designerFlag: true, //设计师弹出框
    designerDetailFlag: true, //设计师详情弹出框
    num: 1,
    otherParams: {}, // 搜索参数
    desInfo: {}, //选中设计师
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
    const { otherParams } =this.data
    Object.assign(params, otherParams)
    this.setData({
      num: 1,
      otherParams: params
    })
    app.$u.showLoading()
    this.getData(1)
  },

  //设计师弹出层出现
  designerShow: function() {
    this.setData({
      designerFlag: false
    })
  },

  // 设计师列表 搜索全部设计师产品
  allDesSear() {
    this.resetDes()
  },

  // 重置设计师
  resetDes() {
    const otherParams = this.data.otherParams
    if (otherParams.designerId) {
      delete this.data.otherParams.designerId
      this.setData({
        otherParams: this.data.otherParams,
        desInfo: {}
      })
    }
    this.getData(1)
  },

  //设计师列表 搜索设计师产品 把设计师id储存起来
  designerListSear(e) {
    const {item} = e.currentTarget.dataset
    const { otherParams } = this.data
    Object.assign(otherParams, { designerId: item.designerId})
    this.setData({
      desInfo: item,
      otherParams
    })
    // 执行搜索
    this.designerSearOne()
    this.setData({
      designerFlag: true
    })
  },

  //设计师弹出层消失
  designerHide: function() {
    this.setData({
      designerFlag: true
    })
  },

  //设计师详情弹出层出现
  designerDetailShow: function(e) {
    const data = e.currentTarget.dataset
    data.item.fields = data.item.field.replace(',', '/')
    this.setData({
      desInfo: data.item
    })
    this.getData(1)
    this.setData({
      designerFlag: true,
      designerDetailFlag: false
    })
  },

  // 搜索单个设计师作品
  designerSear() {
    this.designerSearOne()
    this.setData({
      designerDetailFlag: true
    })
  },

  //搜索单个设计师作品方法
  designerSearOne() {
    const {
      designerId
    } = this.data.desInfo
    Object.assign(this.data.otherParams, {
      designerId
    })
    app.$u.showLoading()
    this.getData(1)
  },

  //设计师详情弹出层消失
  designerDetailHide: function() {
    this.setData({
      designerDetailFlag: true
    })
  },

  // 设计师详情返回列表
  returnDesigner: function() {
    this.setData({
      designerFlag: false,
      designerDetailFlag: true
    })
  },

  //适合人群选择
  PriceCheckbox: function(e) {
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
  MaterCheckbox: function(e) {
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
  ManCheckbox: function(e) {
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

  // 关闭所有弹窗
  closeLayer() {
    this.setData({
      designerFlag: true,
      designerDetailFlag: true
    })
  },

  // 设计师产品
  getData(num) {
    this.closeLayer()
    let params = {
      page: num,
      rows: 20,
    }
    if (this.data.otherParams.designerId) {
      this.data.otherParams.desginerId = this.data.otherParams.designerId
    }
    Object.assign(params, this.data.otherParams)
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

  //设计师查询接口
  getDesInfo() {
    app.$api.selectDesignerInfo().then((res) => {
      this.setData({
        designerListAll: res.data,
        designerList: res.data,
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

  // 设计师搜索
  searchInput(e) {
    const key = e.detail.value
    const designerListAll = this.data.designerListAll.map(item => item.designerName.toLocaleLowerCase())
    let desList = []
    this.data.designerListAll.forEach(item => {
      app.$u.slurSear(designerListAll, key).forEach(it => {
        if (item.designerName.toLocaleLowerCase() === it) {
          desList.push(item)
        }
      })
    })
    this.setData({
      designerList: desList
    })
  },

  onReachBottom(e) {
    this.loadMore()
  },

  onShow() {
    this.getDesInfo()

    // 初始化弹窗
    app.$u.showLoading()
    app.$api.selectDesignerTextureAndCrowd().then(res => {
      var tempObj = res.data;
      this.setData({
        proAllData: res.data
      })
    })

  },

  onLoad() {
    this.getData(1)
    this.select = this.selectComponent(`#selectCommon`)
  },
})