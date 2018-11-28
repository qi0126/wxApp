const app = getApp()

Page({
  data: {
    $img: app.$img,
    $simg: app.$simg,
    imgSlide: {
      a: '/images/order/icon-down.png',
      b: '/images/order/icon-up.png'
    },
    orderStatus: '',
    num: 1,
    list: []
  },

  // 订单详情
  goOrderDetail(e) {
    let data = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/me/orderDetail/orderDetail?orderNo=${data.item.orderNo}`,
    })
  },

  changeStatusClick(e) {
    let status = e.currentTarget.dataset.status
    this.setData({
      orderStatus: status,
    })
    if(status === `1`) {
      this.setData({
        orderStatus: ``,
      }) 
    }
    this.getData()
  },

  getDetailData(num) {
    wx.setNavigationBarTitle({
      title: '采购订单',
    })
    if (!num) {
      num = 1
    }
    let params = {
      pageIndex: num,
      rows: 20,
      orderStatu: this.data.orderStatus,
    }

    app.$u.showLoading()
    app.$api.orderMyOrders(params).then(res => {
      if (res.data) {
        res.data.data.forEach(item => {
          // item.type = this.changeType(item.orderType)
          item.proList.forEach(it => {
            it.specInfos = JSON.parse(it.specInfo)
          })
        })
      }
      // 分页
      this.setData({
        result: res.data,
        list: num === 1 ? res.data.data : this.data.list.concat(res.data.data),
      })
      if (this.data.list && this.data.list.length >= res.data.rowSize) {
        this.setData({
          loadMore: true
        })
      } else {
        this.setData({
          loadMore: false
        })
      }
      // console.log(this.data.list, res.data.rowSize, this.data.loadMore)
    })
  },


  getData(num) {
    this.getDetailData(num)
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

  getStatu() {
    app.$api.orderRetailStatuList().then(res => {
      this.setData({
        statuList: res.data
      })
    })
  },

  onLoad(options) {

  },
  
  

  onShow() {
    this.getStatu()
    app.$u.showLoading()
    this.getData()
  }

})
