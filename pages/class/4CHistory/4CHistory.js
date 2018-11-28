const app = getApp()

Page({
  data: {
    list: []
  },

  getList() {
    if(wx.getStorageSync('4chistory')) {
      const listObj = wx.getStorageSync('4chistory')
      let list = []
      for (let i in listObj) {
        list.push({ num: i, date: app.$d(listObj[i]).format('YYYY/MM/DD')})
      }
      list = list.reverse()
      this.setData({
        list
      })
    }
  },

  goInfo(e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/class/queryResult/queryResult?num=${data.item.num}`,
    })
  },

  onShow() {
    this.getList()
  }

})