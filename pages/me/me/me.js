const app = getApp()

Page({
  data: {
    $img: app.$img,
    $simg: app.$simg,
    wishLength: 0,
    wishList: [],
    orderLength: 0,
    orderList: [], 
    num: 0,
    nickName: ``,
    avatarUrl: `/images/noImg/img-nome.png`,
    loginStatu: false,
    sexImg: {
      boy: '/images/me/icon-sex.png',
      girl: '/images/me/icon-sex1.png'
    }
  }, 

  goWishList() {
    if (!this.data.loginStatu) {
      return
    }
    wx.navigateTo({
      url: '/pages/me/wishList/wishList',
    })
  },

  goOrder() {
    if (!this.data.loginStatu) {
      return
    }
    wx.navigateTo({
      url: '/pages/me/order/order',
    })
  },

  goAddr() {
    if (!this.data.loginStatu) {
      return
    }
    wx.navigateTo({
      url: '/pages/me/address/address',
    })
  },

  goContact() {
    wx.navigateTo({
      url: '/pages/me/contact/contact',
    })
  },

  getAddr() {
    let params = {
      page: 1,
      rows: 20,
    }
    app.$api.addrList(params).then(res => {
      this.setData({
        addr: res.data
      })
    })
  },

  getWish() {
    app.$api.wishproductWishProcutList().then(res => {
      let wishLength = res.data.length
      if (wishLength > 3) {
        res.data.length = 3
      }
      this.setData({
        wishLength, 
        wishList: res.data
      })
    })
  },

  getOrder() {
    const params = {
      pageIndex: 1,
      rows: 20
    }
    app.$api.orderMyOrders(params).then(res => {
      let orderLength = res.data.rowSize
      if (orderLength > 2) {
        res.data.data.length = 2
      }
      this.setData({
        orderLength,
        orderList: res.data.data
      })
    })
  },

  getUser() {
    const self = this
    wx.getUserInfo({
      success(res) {
        const us = res.userInfo
        self.setData({
          avatarUrl: us.avatarUrl,
          nickName: us.nickName
        })
      }
    })
  },

  goChangeInfo() {
    wx.navigateTo({
      url: '/pages/editMe/editMe',
    })
  },

  getData() {
    this.getWish()
    this.getAddr()
    this.getOrder()
    this.getUser()
    this.getInfo()
  },

  loginTrue(e) {
    this.setData({
      loginStatu: true
    })
    this.getData()
  },

  getInfo() {
    app.$api.userMyinfo().then(res => {
      const user = res.data
      this.setData({
        user,
      })
    })
  },

  onShow() {
    app.$api.cartNum()

    // 验证登录权限
    this.showLogin = this.selectComponent("#showLogin");
    app.$u.userStatu().then(res => {
      this.setData({
        loginStatu: true
      })
      this.getData()
    }).catch(err => {
      this.showLogin.show()
    })
  },

  onLoad(options) {

  },

})
