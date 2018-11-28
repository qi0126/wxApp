const app = getApp()

Page({

  data: {
    proList:[]
  },

  EnterDesignerPro:function(e){
    wx.navigateTo({
      url: '/pages/designer/subDesignerDisp/subDesignerDisp',
    })
  },

  //搜索
  searchFun() {
    wx.navigateTo({
      url: "../../search/search/search?currentPage=designer"
    })
  },

  onShow() {
    app.$api.cartNum()
  }

})