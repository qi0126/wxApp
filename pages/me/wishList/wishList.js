const app = getApp()

Page({
  data: {
    $img: app.$img,
    $simg: app.$simg,
    list: [],
    imgStatus: {
      a: '/images/shop/icon-true.png',
      b: '/images/shop/icon-false.png'
    },
    checkboxList: [],
    checkboxAll: false,
    num: 1,

    // 当前选中下标
    indexTrue: 0,

    // 弹窗
    propShow: false,
    oneList: [],
    twoList: [],
    propImg: ``
  },

  // 标准款清空checkbox
  defclearCheckbox() {
    if (this.data.list) {
      this.data.list.forEach(item => {
        item.checkbox = false
      })
      this.setData({
        defCheckAll: false,
        list: this.data.list
      })
      this.getCheckbox()
    }
  },

  // 点击多选
  checkbox(e) {
    let data = e.currentTarget.dataset
    console.log(data)
    this.data.list[data.index].checkbox = !this.data.list[data.index].checkbox
    this.setData({
      list: this.data.list
    })
    this.getCheckbox()
  },

  // 全选
  checkboxAll(e) {
    this.data.checkboxAll = !this.data.checkboxAll
    this.data.list.forEach(item => {
      item.checkbox = this.data.checkboxAll
    })
    this.setData({
      checkboxAll: this.data.checkboxAll,
      list: this.data.list
    })
    this.getCheckbox()
  },

  getCheckbox() {
    this.data.checkboxList = []
    this.data.list.forEach(item => {
      if (item.checkbox) {
        this.data.checkboxList.push(item.wishId)
      }
    })
  },

  defDel(e) {
    if (this.data.checkboxList.length === 0) {
      return
    }
    const params = this.data.checkboxList
    console.log(Object.prototype.toString.call(params))
    app.$u.showModal('确定删掉选中产品吗').then(e => {
      app.$api.wishproductCancelMangWishProcut({
        wishIds: JSON.stringify(params)
      }).then(res => {
        app.$u.showToast('删除成功')
        this.getWish()
      })
    })
  },

  // 弹窗
  propResult(result) {
    // 组件赋值
    let designItem;
    result.price = result.resalePrice
    result.code = result.productId
    result.textures.forEach(item => {
      this.data.oneList.push({
        val: item.textureName,
        code: item.textureName,
        id: item.id
      })
    })
    result.designs.forEach(item => {
      if (item.designName === `款式尺寸`) {
        designItem = item
      }
    })
    designItem.designValue.split(',').forEach(item => {
      this.data.twoList.push({
        val: item,
        code: item,
        id: designItem.id
      })
    })
    this.setData({
      result,
      propImg: result.productImageUrl,
      oneList: this.data.oneList,
      twoList: this.data.twoList,
    })
  },


  // 加入购物车
  goShopCart(e) {
    const data = e.currentTarget.dataset
    this.propResult(data.item)
    // this.propResult()
    this.addSize.showShopCartDialog();
    this.setData({
      goWay: 'shop',
      propShow: true,
      indexTrue: data.index
    })
  },

  // 获取弹窗参数
  changeParams(e) {
    const paramsProp = e.detail
    this.setData({
      paramsProp
    })
  },

  cancelEvent(e) {
    this.setData({
      propShow: false
    })
  },

  // 确定
  handleTrue() {
    let params;
    params = {
      proId: this.data.result.productCode,
      // proId: this.data.result.productId,
      num: this.data.paramsProp.num,
      proType: this.data.result.productType,
      specInfo: this.data.paramsProp.specInfo,
    }
    app.$api.cartAdd(params).then(res => {
      app.$u.showToast(res.msg)
      this.addSize.hideShopCartDialog();
      this.setData({
        propShow: false,
        num: 1
      })
    })
  },

  goShop() {
    wx.switchTab({
      url: '/pages/shop/shop/shop',
    })
  },

  getWish() {
    app.$api.wishproductWishProcutList().then(res => {
      this.setData({
        list: res.data
      })
    })
  },

  onLoad(options) {
    this.addSize = this.selectComponent("#addSize");
  },

  onShow() {
    app.$u.showLoading()
    this.getWish()
  }

})