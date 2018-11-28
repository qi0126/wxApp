const app = getApp()

Page({
  data: {
    num: 0
  },

  goWishList() {
    wx.navigateTo({
      url: '/pages/me/wishList/wishList',
    })
  },

  goOrder() {
    wx.navigateTo({
      url: '/pages/me/order/order',
    })
  },

  goAddr() {
    wx.navigateTo({
      url: '/pages/me/address/address',
    })
  },

  goContact() {
    wx.navigateTo({
      url: '/pages/me/contact/contact',
    })
  },

  prewImg(e) {
    const data = e.currentTarget.dataset
    console.log(e)
  },

  onLoad(options) {

  },

  onShow() {
  }

})
