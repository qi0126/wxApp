const app = getApp()

Page({
  data: {
  },

  onLoad(options) {
    let article;
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    let self = this;
    let params = {
      // q: `6232150384`,
      q: options.num,
      t: `1`
    }
    app.$u.showLoading()
    app.$api.getCert(params).then(res => {
      this.setData({
        result: res.data
      })
    }).catch(err => {
      wx.navigateBack({
        delta: 1,
      })
    })
  },

  onShow() {

  }

})
