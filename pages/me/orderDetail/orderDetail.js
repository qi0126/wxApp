const app = getApp()

Page({
  data: {
    $img: app.$img,
    $simg: app.$simg,
    list: [{}, {}],
    result: {},
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

  // 取消订单
  cancel() {
    app.$u.showModal('确认取消订单吗？').then(res => {
      this.cancelTrue()
    })

  },

  // 取消订单方法
  cancelTrue() {
    const params = {
      orderNo: this.data.result.orderNo
    }
    app.$u.showLoading()
    app.$api.orderCancelOrder(params).then(res => {
      app.$u.showToast('取消成功')
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 800)
    })
  },

  // 支付
  goPay() {
    const orderNo = this.data.result.orderNo
    const params = {
      orderNo
    }
    app.$api.orderGetPayJsApi(params).then(res => {
      app.$u.pay(res.data).then(rs => {
        app.$api.orderPayStatu(params).then(pRes => {
          wx.navigateBack({
            delta: 1,
          })
        })
      }).catch(err => {
        wx.navigateBack({
          delta: 1,
        })
      })
    })
  },

  // 处理订单 将订单推到下一个状态
  hanldTrue() {
    const { orderNo, nextHandleCode, operator } = this.data.result
    const params = {
      orderNo,
      mark: '',
      handleCode: nextHandleCode,
    }
    app.$u.showModal('是否确认收货？').then(res => {
      app.$api.orderOperateSelf(params).then(res => {
        app.$u.showToast('确认收获成功')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      })
    })

  },

  getDetail(params) {
    app.$api.orderMyOrderDetail(params).then(res => {
      const result = res.data
      result.createTime = app.$d(result.createTime).format(`YYYY-MM-DD hh:mm:ss`)
      result.proList.forEach(item => {
        item.specInfos = JSON.parse(item.specInfo)
      })
      this.setData({
        result
      })
    })
  },

  onLoad(options) {
    if(options.orderNo) {
      const params = {
        orderNo: options.orderNo
      }
      this.getDetail(params)
    }

  },

  onShow() {
  }

})
