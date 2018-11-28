const app = getApp()

Page({
  data: {
    imgStatus: {
      a: '/images/class/checkedFalse.png',
      b: '/images/class/checkedTrue.png'
    },
    result: {},
    status: 'add',
    popuStatus: true,
    def: 'N',
    animationData: {},
    phoneWeChat: ``// 点击获取的手机号
  },

  defAddClick() {
    if (this.data.def === 'Y') {
      this.setData({
        def: 'N'
      })
    } else {
      this.setData({
        def: 'Y'
      })
    }
  },

  formSubmit(e) {
    let val = e.detail.value, goWay, params = {}, responseTit = '', def = { def: this.data.def }, area;
    // 如果是修改
    if (this.data.city) {
      area = { area: `${this.data.city.province},${this.data.city.city},${this.data.city.district}`}
      Object.assign(params, area, val, def)
    } else {
    // 如果是新增
      area = { area: `${this.data.result.province},${this.data.result.city},${this.data.result.district}` }
      Object.assign(params, area, val, def)
    }
    if (this.data.status === 'add') {
      goWay = 'addrAdd',
      responseTit = '添加成功'
    } else if (this.data.status === 'update') {
      params.id = this.data.result.id
      goWay = 'addrUpload'
      responseTit = '修改成功'
    }
    if (!params.name) {
      app.$u.showToast('请输入联系人')
    }
    if (!app.$v.verifyMobile(params.phone)) {
      app.$u.showToast('请输入正确格式的手机号')
      return
    }
    if (!params.area) {
      app.$u.showToast('请选择地址')
    }
    app.$u.showLoading()
    app.$api[goWay](params).then(res => {
      wx.showToast({
        title: responseTit,
        icon: 'none',
        mask: true,
        success() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 800)
        }
      })
    })
  },

  popuShow(e) {
    let self = this
    this.setData({
      popuStatus: false,
    })
    setTimeout(() => {
      self.animation.height(190).step()
      self.setData({
        animationData: self.animation.export()
      })
    }, 0)
  },
 
  popConfirm(e) {
    let city = e.detail.params
    console.log(city)
    this.setData({
      city
    })
  },

  editAddress() {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress',
    })
  }, 

  // 点击获取手机号
  getPhoneNumber(e) {
    console.log(e)
    this.setData({
      phoneWeChat: e.detail.value
    })
  },

  onLoad(options) {

    // 修改地址赋值
    if (options.item) {
      let result;
      result = JSON.parse(options.item)
      this.data.result = {
        name: result.receiver,
        phone: result.telephone,
        // area: `${result.province}${result.city}${result.district}`,
        province: result.province,
        city: result.city,
        district: result.district,
        detail: result.address,
        def: result.isDefault,
        id: result.id
      }
      this.setData({
        status: 'update',
        def: this.data.result.def,
        result: this.data.result
      })
    }
  },

  onReady() {
    this.animation = wx.createAnimation()
  }

})
