const app = getApp()
Page({
  data: {
    searInfo: ``
  },

  click(e) {
    const data = e.currentTarget.dataset.data
    if(data === 'CE') {
      this.setData({
        searInfo: ``
      })
      return
    }

    if (data === 'del') {
      this.setData({
        searInfo: this.data.searInfo.slice(0, this.data.searInfo.length - 1)
      })
      return
    }
    
    this.setData({
      searInfo: `${this.data.searInfo}${data}`
    })
  },

  goQuery() {
    const { searInfo } = this.data
    let params = {
      q: searInfo,
      // q: `6232150384`,
      t: `1`
    }
    
    app.$u.showLoading()
    app.$api.getCert(params).then(res => {
      wx.navigateTo({
        url: `/pages/class/queryResult/queryResult?num=${searInfo}`,
      })
      this.saveHistory(searInfo)
    }).catch(err => {
      app.$u.showToast("未查询到相关信息")
    })
  },

  saveHistory(num) {
    let list = {}
    if(wx.getStorageSync('4chistory')) {
      list = wx.getStorageSync('4chistory')
    }
    let flag = false
    Object.keys(list).forEach(item => {
      item = num 
      if(item === num) {
        flag = true
      }
    })
    delete list[num]
    list[num] = new Date()
    wx.setStorageSync('4chistory', list)
  },

  handleNum() {

  },

  goSearchHistory() {
    wx.navigateTo({
      url: '/pages/class/4CHistory/4CHistory',
    })
  },

  onLoad(options) {

  },

  onShow() {

  }

})
