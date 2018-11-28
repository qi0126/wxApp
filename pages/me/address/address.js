const app = getApp()

Page({
  data: {
    imgStatus: {
      a: '/images/class/checkedFalse.png',
      b: '/images/class/checkedTrue.png'
    },
    choAddr: false,
    list: [], 
    num: 1,
  },

  // 删除地址
  deleAddress(e) {
    let data = e.currentTarget.dataset, self = this
    console.log(data)
    app.$u.showModal('确定删除地址吗？').then(e => {
      app.$api.addrDel({ id: data.item.id }).then(res => {
        console.log(res)
        self.data.list.splice(data.index, 1)
        self.setData({
          list: this.data.list
        })
        app.$u.showToast('删除成功')
      })
    })
  },

  // 修改地址
  setDefault(e) {
    const data = e.currentTarget.dataset;
    let params, result
    result = data.item
    params = {
      name: result.receiver,
      phone: result.telephone,
      area: `${result.province},${result.city},${result.district}`,
      detail: result.address,
      def: result.isDefault === 'Y' ? 'N' : 'Y' ,
      id: result.id
    }
    app.$api.addrUpload(params).then(res => {
      app.$u.showToast('更改成功')
      if(this.data.list.length > 1) {
        this.data.list.forEach(item => {
          item.isDefault = 'N'
        })
      }
      this.data.list[data.index].isDefault = this.data.list[data.index].isDefault === 'Y' ? 'N' : 'Y'
      this.setData({
        list: this.data.list
      })
    })    
  },

  // 编辑地址
  editAddress(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/me/addAddr/addAddr?item=${JSON.stringify(item)}`,
    })
  },

  // 新增地址
  goAddress() {
    wx.navigateTo({
      url: '/pages/me/addAddr/addAddr',
    })
  },

  // 订单详情选择地址
  goOrder(e) {
    if (this.data.choAddr) {
      const data = e.currentTarget.dataset
      wx.setStorageSync('addr', data.item)
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  getData(num) {
    let params = {
      page: num,
      rows: 20,
    }
    app.$api.addrList(params).then(res => {
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
    })
  },

  onReachBottom(e) {
    console.log(1)
    this.loadMore()
  },

  onPullDownRefresh(e) {
    this.getData(1)
  },

  loadMore() {
    this.setData({
      num: this.data.num + 1
    })
    this.getData(this.data.num)
  },


  onLoad(options) {
    if(options.way) {
      this.setData({
        choAddr: true
      })
    }
  },

  onShow() {
    this.getData(1)
  }

})
