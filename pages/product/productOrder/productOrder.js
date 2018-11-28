const app = getApp()

Page({
  data: {
    $img: app.$img,
    $simg: app.$simg,
    deliWay: true,
    wxChecked: true,
    imgStatus: {
      a: '/images/class/checkedTrue.png',
      b: '/images/class/checkedFalse.png',
    },
    num: 1,
    word: ``,
    addr: {},

    // 单价
    price: 0,
    // 总价格
    totalPrice: 0,

  },

  //单选框
  selectCollect() {
    this.setData({
      deliWay: true
    })
  },

  //单选框
  selectTake() {
    this.setData({
      deliWay: false
    })
  },

  // 减少
  decrease(e) {
    const data = e.currentTarget.dataset
    let currentNum = this.data.proList[data.index].num
    this.data.proList[data.index].num = currentNum >= 2 ? currentNum - 1 : 1
    this.changePrice()
  },

  // 增加
  increase(e) {
    const data = e.currentTarget.dataset
    let currentNum = this.data.proList[data.index].num
    this.data.proList[data.index].num = currentNum + 1
    this.changePrice()
  },

  // 改变价格
  changePrice() {
    let totalPrice = 0, totalNum = 0
    this.data.proList.forEach(item => {
      totalPrice += item.num * item.price
      totalNum += item.num
    })

    // 计算运费 
    // totalPrice = totalPrice + freight

    totalPrice = totalPrice.toFixed(2)
    this.setData({
      proList: this.data.proList,
      totalPrice,
      totalNum,
    })
  },

  // 改变备注
  changeText(e) {
    let word = e.detail.value.trim()
    if (word.length > 45) {
      this.setData({
        word: word.slice(0, 45)
      })
      return
    }
    this.setData({
      word
    })
  },

  //微信确认
  wxConfirmFun() {
    // if (this.data.wxChecked) {
    //   this.setData({
    //     wxChecked: false
    //   })
    // } else {
    //   this.setData({
    //     wxChecked: true
    //   })
    // }
  },


  goPay() {
    if (JSON.stringify(this.data.addr) === `{}`) {
      app.$u.showToast('请选择地址信息')
      return
    }

    if (this.data.way === 'detail') this.payDetail()
    if (this.data.way === 'shop') this.payShop()
  },

  // 产品详情创建订单
  payDetail() {
    let proList = this.data.proList
    const addr = this.data.addr
    let params = {
      delivery: `EXPRESS`,
      consignee: addr.consignee,
      concatInfo: addr.concatInfo,
      address: addr.address,
      mark: this.data.word,
      proId: proList[0].proId,
      specInfo: JSON.stringify(proList[0].specInfo),
      proType: proList[0].proType,
      num: this.data.totalNum
    }
    app.$u.showLoading()
    app.$api.createOrderSingle(params).then(res => {
      if (!res.data) {
        return
      }
      let payParams = {
        orderNo: res.data.orderNo
      }
      this.pay(payParams)
    })
  },

  // 支付
  pay(params) {
    app.$api.orderGetPayJsApi(params).then(rs => {
      app.$u.pay(rs.data).then(re => {
        app.$api.orderPayStatu(params).then(pRes => {
          wx.redirectTo({
            url: '/pages/me/order/order',
          })
        })
      }).catch(err => {
        wx.redirectTo({
          url: '/pages/me/order/order',
        })
      })
    })
  },

  // 购物车创建订单
  payShop() {
    let proList = this.data.proList
    const cartIdStr = proList.map(item => {
      return item.cartId
    })
    const addr = this.data.addr
    let params = {
      delivery: `EXPRESS`,
      consignee: addr.consignee,
      concatInfo: addr.concatInfo,
      address: addr.address,
      mark: this.data.word,
      cartIdStr: JSON.stringify(cartIdStr)
    }
    app.$u.showLoading()
    app.$api.orderCreateFromCart(params).then(res => {
      if (!res.data) {
        return
      }
      let payParams = {
        orderNo: res.data.orderNo
      }
      this.pay(payParams)
    })
  },

  // 改变默认地址
  changeAddr() {
    wx.navigateTo({
      url: '/pages/me/address/address?way=order',
    })
  },

  // 获取默认地址
  getDefAddr() {
    app.$api.addrDef().then(res => {
      const data = res.data
      if (!res.data) {
        return
      }
      const addr = {
        consignee: data.receiver,
        concatInfo: data.telephone,
        address: `${data.province}${data.city}${data.district}  ${data.address}`,
        isDefault: data.isDefault
      }
      this.setData({
        addr
      })
    })
  },

  onLoad(options) {
    this.getDefAddr()
    if (!options.proList) {
      return
    }
    const proList = JSON.parse(options.proList)
    this.setData({
      proList,
      way: options.way
    })
  },

  onShow() {
    // 计算运费
    this.changePrice()

    // 地址
    if (wx.getStorageSync('addr')) {
      const data = wx.getStorageSync('addr')
      const addr = {
        consignee: data.receiver,
        concatInfo: data.telephone,
        address: `${data.province}${data.city}${data.district}  ${data.address}`,
        isDefault: data.isDefault
      }
      this.setData({
        addr
      })
    }
  }

})