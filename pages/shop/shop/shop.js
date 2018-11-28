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
    allPrice: 0,
    num: 1,
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
      if (item.isEffective === 'Y') {
        item.checkbox = this.data.checkboxAll
      }
    })
    this.setData({
      checkboxAll: this.data.checkboxAll,
      list: this.data.list
    })
    this.getCheckbox()
  },

  getCheckbox() {
    this.data.checkboxList = []
    this.countPrice()
    this.data.list.forEach(item => {
      if (item.checkbox && item.isEffective === 'Y') {
        this.data.checkboxList.push(item)
      }
    })
    this.setData({
      checkboxList: this.data.checkboxList
    })
  },

  // 计算价格
  countPrice() {
    let allPrice = 0,
      allNum = 0;
    this.data.list.forEach(item => {
      allPrice += parseFloat((item.price * item.num).toFixed(2))
      if (item.checkbox) {
        allNum += item.num
      }
    })
    this.setData({
      allPrice,
      allNum
    })
  },

  // 减少
  decrease(e) {
    const data = e.currentTarget.dataset
    this.data.list[data.index].num = this.data.list[data.index].num >= 2 ? this.data.list[data.index].num - 1 : 1
    this.changShopNum(data.item)
  },

  // 增加
  increase(e) {
    const data = e.currentTarget.dataset
    this.data.list[data.index].num = this.data.list[data.index].num + 1
    this.changShopNum(data.item)
  },

  // 购物车改变数量
  changShopNum(item) {
    let params = {
      cartId: item.cartId,
      num: item.num
    }
    app.$api.cartUpdate(params).then(res => {
      this.setData({
        list: this.data.list
      })
    })
  },

  // 多选移除
  defDel(e) {
    if (this.data.checkboxList.length === 0) {
      return
    }
    const params = JSON.stringify(this.data.checkboxList),
      self = this

    const cartIds = this.data.checkboxList.map(item => {
      return item.cartId
    })

    app.$u.showModal('确定删掉选中产品吗').then(e => {
      app.$api.cartDel({
        cartIds
      }).then(res => {
        app.$u.showToast('删除成功')
        self.data.list.forEach((item, index) => {
          if (item.checkbox) {
            item.hide = true
          }
        })
        self.getData(1)
      })
    })
  },

  // 滑动删除begin
  touchstart(e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      result: this.data.result
    })
  },

  touchmove(e) {

    let that = this,
      index = e.currentTarget.dataset.index,
      startX = that.data.startX,
      startY = that.data.startY,
      touchMoveX = e.changedTouches[0].clientX,
      touchMoveY = e.changedTouches[0].clientY,
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });

    that.data.list.forEach(function (v, i) {
      v.isTouchMove = false
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX)
          v.isTouchMove = false
        else
          v.isTouchMove = true
      }
    })
    that.setData({
      list: that.data.list
    })
  },

  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 滑动删除
  deleDefOne(e) {
    let data = e.currentTarget.dataset,
      self = this
    app.$u.showModal('确定删掉选中产品吗').then(e => {
      app.$api.cartDel({
        cartIds: [data.item.cartId]
      }).then(res => {
        app.$u.showToast('删除成功')
        self.data.list.splice(data.index, 1)
        self.setData({
          list: self.data.list
        })
        if (self.data.list.length === 0) {
          self.getData(1)
        }
      })
    }).catch(err => {
      this.data.list.forEach(item => {
        item.isTouchMove = false
      })
    })
  },

  // 滑动删除end
  
  // 尺寸参数处理
  handleSize(item) {
    // 有尺寸
    if (item.specInfoObj.lenght > 1) {
      item.designName = item.specInfoObj[1].specValue
    }else {
      item.designName = ``
    }
    // 无尺寸
  },

  getData(num) {
    let params = {
      pageIndex: num,
      rows: 20,
    } 
    app.$api.cartList(params).then(res => {
      res.data.data.forEach(item => {
        item.specInfoObj = JSON.parse(item.specInfo)
        item.textureName = item.specInfoObj[0].specValue
        this.handleSize(item)
      })
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
      app.$api.cartNum()
      // 重置checkbox
      this.getCheckbox()
    })
  },

  // 前往商品详情
  goShopDetail(e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/productDetail/productDetail?productNo=${data.item.proId}&way=shop`,
    })
  },

  // 去支付
  goPay() {
    const proList = this.data.checkboxList.map(item => {
      return {
        cartId: item.cartId,
        proId: item.proId,
        proName: item.proName,
        picUrl: item.picUrl,
        specInfo: JSON.parse(item.specInfo),
        num: item.num,
        price: item.price,
        proType: item.proType
      }
    })

    wx.navigateTo({
      url: `/pages/product/productOrder/productOrder?proList=${JSON.stringify(proList)}&way=shop`,
    })
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

  // 重置列表
  resetShop() {
    this.data.list.forEach(item => {
      item.checkbox = false
    })
    this.setData({
      checkboxAll: false
    })
    this.getCheckbox()
  },

  // 登陆弹窗
  loginTrue(e) {
    this.getData(1)
  },

  onLoad(options) {},

  onShow() {
    // 验证登录权限
    this.showLogin = this.selectComponent("#showLogin");
    app.$u.userStatu().then(res => {
      this.getData(1)
    }).catch(err => {
      this.showLogin.show()
    })
    
    app.$api.cartNum()
  },

  onHide() {
    this.resetShop()
  }


})