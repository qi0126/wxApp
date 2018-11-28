const app = getApp()

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    $img: app.$img,
    $simg: app.$simg,
    proList: [],//产品数据列表
    proAllData: {},//接口返回值
    designerFlag: true,//设计师弹出框
    designerDetailFlag: true,//设计师详情弹出框
    imgStatus: {
      a: '/images/class/checkedTrue.png',
      b: '/images/class/checkedFalse.png',
    },//选择（单选和多选按钮图片地址）
    wayApi: '', //api
    manList: [{//适合人群
      'id': '001',
      'value': '女士',
      'checked': false
    }, {
      'id': '002',
      'value': '男士',
      'checked': false
    }, {
      'id': '003',
      'value': '中性',
      'checked': false
    }, {
      'id': '004',
      'value': '情侣组合',
      'checked': false
    }],
    seriesList: [{//系列
      'id': '001',
      'value': '不限系列',
      'checked': false
    }],
    classList: [{//分类
      'id': '001',
      'value': '戒指',
      'checked': false
    }, {
      'id': '002',
      'value': '项链',
      'checked': false
    }, {
      'id': '003',
      'value': '耳饰',
      'checked': false
    }, {
      'id': '004',
      'value': '吊垫',
      'checked': false
    }, {
      'id': '005',
      'value': '手环',
      'checked': false
    }],
    priceList: [{//价格排序
      'id': '001',
      'value': '价格升序',
      'checked': true
    }, {
      'id': '002',
      'value': '价格降序',
      'checked': false
    }],
    materList: [{//材质
      'id': '001',
      'value': 'K金',
      'checked': false
    }, {
      'id': '002',
      'value': 'PT950',
      'checked': false
    }, {
      'id': '003',
      'value': '纯银',
      'checked': false
    }, {
      'id': '004',
      'value': '镶嵌',
      'checked': false
    }],
    designerList: [{//设计师列表
      'id': '001',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }, {
      'id': '002',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }, {
      'id': '003',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }, {
      'id': '004',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }, {
      'id': '005',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }, {
      'id': '006',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }, {
      'id': '007',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }, {
      'id': '008',
      'name': 'Christy Brinkley',
      'sex': '女',
      'city': '意大利'
    }],
    num: 1
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
    console.log(item)
    const { detail: otherParams} = item
    // this.setData({
    //   prolist: item.detail
    // })
    this.setData({
      num: 1,
      otherParams
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
  designerDetailShow: function () {
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

  onShow() {
    // //设计师款产品查询接口
    // this.setData({
    //   proList: app.globalData.searchData.productListFroms,
    // })
    // this.setData({
    //   proAllData: app.globalData.searchData
    // })
  },

  changeApi() {
    const { currentPage } = this.data
    let wayApi = ''
    if (currentPage === 'home') {
      wayApi = 'selectSearchNameCommon'
    } else if (currentPage === 'class'){
      wayApi = 'selectSearchNameFactory'
    } else if (currentPage === 'designer') {
      wayApi = 'selectSearchNameDesigner'
    }
    this.setData({
      wayApi
    })
  },

  getData(num) {
    const { searchName, currentPage, wayApi, otherParams, proList } = this.data
    const params = {
      searchName,
      page: num,
      rows: 20,
    }
    Object.assign(params, otherParams)
    app.$api[wayApi](params).then(res => {
      if (res.data) {
        this.setData({
          proList: res.data.productListFroms
        })
        const resData = res.data.data[0]
        // 分页
        this.setData({
          result: res.data,
          proAllData: resData,
          proList: num === 1 ? resData.productListFroms : proList.concat(resData.productListFroms),
        })
        if (proList && proList.length >= res.data.rowSize) {
          this.setData({
            loadMore: true
          })
        } else {
          this.setData({
            loadMore: false
          })
        }

      } else {
        app.showToast(res.msg)
      }
    })

  },

  onReachBottom(e) {
    this.loadMore()
  },

  loadMore() {
    this.setData({
      num: this.data.num + 1
    })
    this.getData(this.data.num)
  },

  //添加到心愿单
  addWish(e) {
    var params = { productId: e.currentTarget.dataset.item.productId }
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

  goShop() {
    wx.switchTab({
      url: '/pages/shop/shop/shop',
    })
  },

  onLoad(options) {
    this.select = this.selectComponent(`#selectCommon`)
    const { way: currentPage, searchName } = options
    this.setData({
      currentPage,
      searchName
    })
    this.changeApi()
    app.$u.showLoading()
    this.getData(1)
  },

})