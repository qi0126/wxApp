const app = getApp()
Component({
  properties: {
    selectData: Object, 
    categoryId: Object,
    dataCate: String,
  },

  data: {
    $img: app.$img,
    $simg: app.$simg, 
    imgStatus: {
      a: '/images/class/checkedTrue.png',
      b: '/images/class/checkedFalse.png',
    }, //选择（单选和多选按钮图片地址）
    imgSelect: {
      T: '/images/index/allSelect.png',
      F: '/images/index/allNoSelect.png',
    }, //全部按钮（全选和取消全选按钮图片地址）
    commonsALLChecked: true, //适合人群全选/反选
    goldALLChecked: true, //材质全选/反选
    categoryALLChecked: true, //分类全选/反选
    seriesALLChecked: true, //系列全选/反选
    checkStatusTF: false, //类别默认隐藏
    priceList: [{ //适合人群
      'id': 1,
      'value': '价格升序',
      'checked': true
    }, {
      'id': 2,
      'value': '价格降序',
      'checked': false
    }],
    hideTF: true,
  },

  ready() {
    const self = this
    this.animation = wx.createAnimation()
  },

  methods: {

    //筛选弹出层消失
    hide() {
      const self = this 

      setTimeout(() => {
        self.animation.left(-400).step()
        self.setData({
          animationData: self.animation.export()
        })
      }, 0)
      setTimeout(() => {
        self.setData({
          hideTF: true,
        })
      }, 400)

    },

    //筛选弹出层展示
    show() {
      console.log(this.data.selectData, this.data.categoryId, this.data.dataCate)
      const self = this 

      this.setData({
        hideTF: false, 
      })

      setTimeout(() => {
        self.animation.left(0).step()
        self.setData({
          animationData: self.animation.export()
        })
      }, 0)

    },

    //适合人群全选按钮
    commonsAllSelect() {
      var self = this;
      self.setData({
        commonsALLChecked: true
      })
      var tempList = self.data.selectData.commons;
      tempList.forEach(item => {
        item.checked = false
      })

      self.setData({
        selectData: self.data.selectData
      })
    },

    //材质人群全选按钮
    goldALLSelect() {
      var self = this;
      var tempList = self.data.selectData.goldprices;
      tempList.forEach(item => {
        item.checked = false
      })
      self.setData({
        goldALLChecked: true,
        selectData: self.data.selectData
      })
    },

    // 系列全选按钮
    seriesALLSelect() {
      var tempList = this.data.selectData.seriecs;
      tempList.forEach(item => {
        item.checked = false
      })
      this.setData({
        seriesALLChecked: true,
        selectData: this.data.selectData
      })
    },

    //分类全选按钮
    categoryALLSelect() {
      var self = this;
      var tempList = self.data.selectData.category;
      tempList.forEach(item => {
        item.checked = false
      })
      self.setData({
        categoryALLChecked: true,
        selectData: self.data.selectData
      })
    },

    //搜索
    goSearch(e) {
      var self = this
      let { commons, goldprices, seriecs, category } = this.data.selectData
      //价格排序
      var upDown = 1;
      self.data.priceList.forEach(item => {
        if (item.checked == true) {
          upDown = item.id
        }
      })

      //适合人群
      var crowIdList = [];
      if (self.data.selectData.commons) {
        if (self.data.commonsALLChecked) {
          self.data.selectData.commons.forEach(item => {
            crowIdList.push(item.id)
          })
        } else {
          self.data.selectData.commons.forEach(item => {
            if (item.checked == true) {
              crowIdList.push(item.id)
            }
          })
        }
      }

      //材质列表
      var textureIdList = []
      if (self.data.selectData.goldprices) {
        if (self.data.goldALLChecked) {
          self.data.selectData.goldprices.forEach(item => {
            textureIdList.push(item.id)
          })
        } else {
          self.data.selectData.goldprices.forEach(item => {
            if (item.checked == true) {
              textureIdList.push(item.id)
            }
          })
        }
      }

      // 系列列表
      var seriecsList = []
      if (self.data.selectData.seriecs) {
        if (self.data.seriesALLChecked) {
          self.data.selectData.seriecs.forEach(item => {
            seriecsList.push(item.id)
          })
        } else {
          self.data.selectData.seriecs.forEach(item => {
            if (item.checked == true) {
              seriecsList.push(item.id)
            }
          })
        }
      }

      //分类列表
      var categoryList = []
      if (self.data.selectData.category) {
        if (self.data.categoryALLChecked) {
          self.data.selectData.category.forEach(item => {
            categoryList.push(item.id)
          })
        } else {
          self.data.selectData.category.forEach(item => {
            if (item.checked == true) {
              categoryList.push(item.id)
            }
          })
        }
      }

      const params = {
        upDown: upDown, //价格排序 1 升 2 降
      };

      //适合人群ID数组
      if (commons) {
        Object.assign(params, { crowId: crowIdList.join(',')})
      }
      //材质ID	数组
      if (goldprices) {
        Object.assign(params, { textureId: textureIdList.join(',') })
      }
      //系列ID，数组
      if (seriecs) {
        Object.assign(params, { seriecsId: seriecsList.join(',') })
      }
      //分类ID数组
      if (category) {
        Object.assign(params, { categoryId: categoryList.join(',') })
      }
      
      self._returnData(params)
      this.hide()
    },

    //返回字段
    _returnData(elem) {
      this.triggerEvent("returnData", elem)
    },

    //全部重置按钮
    reSet() {
      var self = this;
      self.setData({
        commonsALLChecked: false, //适合人群全选/反选
        goldALLChecked: false, //材质全选/反选
        categoryALLChecked: false, //分类全选/反选
        seriesALLChecked: false, //系列全选/反选
        priceList: [{ //适合人群
          'id': 1,
          'value': '价格升序',
          'checked': true
        }, {
          'id': 2,
          'value': '价格降序',
          'checked': false
        }],
      })
      self.commonsAllSelect()
      self.goldALLSelect()
      self.seriesALLSelect()
      if (self.data.selectData.category) {
        self.categoryALLSelect()
      }
    },

    //价格排序选择
    PriceCheckbox: function(e) {
      var self = this;
      for (let i = 0; i < self.data.priceList.length; i++) {
        if (self.data.priceList[i].id == e.target.dataset.item.id) {
          self.data.priceList[i].checked = true
        } else {
          self.data.priceList[i].checked = false
        }
      }
      this.setData({
        priceList: self.data.priceList
      })
    },

    //材质选择
    MaterCheckbox: function(e) {
      var self = this;
      var allCheckTF = true;
      for (let i = 0; i < self.data.selectData.goldprices.length; i++) {
        if (self.data.selectData.goldprices[i].id == e.target.dataset.item.id) {
          self.data.selectData.goldprices[i].checked = !self.data.selectData.goldprices[i].checked
        }
        if (self.data.selectData.goldprices[i].checked == true) {
          allCheckTF = false
        }
      }
      self.setData({
        selectData: self.data.selectData,
        goldALLChecked: allCheckTF
      })
    },

    //适合人群选择
    ManCheckbox: function(e) {
      var self = this;
      var allCheckTF = true;
      for (let i = 0; i < self.data.selectData.commons.length; i++) {
        if (self.data.selectData.commons[i].id == e.target.dataset.item.id) {
          self.data.selectData.commons[i].checked = !self.data.selectData.commons[i].checked
        }
        if (self.data.selectData.commons[i].checked == true) {
          allCheckTF = false
        }
      }
      self.setData({
        selectData: self.data.selectData,
        commonsALLChecked: allCheckTF
      })
    },

    // 点击系列列表
    seriesCheckbox(e) {
      const data = e.currentTarget.dataset
      let selectData = this.data.selectData, seriesALLChecked = true
      selectData.seriecs[data.index].checked = !selectData.seriecs[data.index].checked
      seriesALLChecked = false
      this.setData({
        selectData,
        seriesALLChecked
      })
    },

    //分类选择
    CategoryCheckbox(e) {
      var self = this
      var allCheckTF = true;
      for (let i = 0; i < self.data.selectData.category.length; i++) {
        if (self.data.selectData.category[i].id == e.target.dataset.item.id) {
          self.data.selectData.category[i].checked = !self.data.selectData.category[i].checked
        }
        if (self.data.selectData.category[i].checked == true) {
          allCheckTF = false
        }
      }
      self.setData({
        selectData: self.data.selectData,
        categoryALLChecked: allCheckTF
      })
    },

    // 切换系列
    checkStatus() {
      let checkStatusTF = this.data.checkStatusTF
      const selectData = this.data.selectData
      checkStatusTF = !checkStatusTF
      if (!checkStatusTF) {
        selectData.seriecs.forEach(item => {
          item.checked = false
        })
      }
      this.setData({
        checkStatusTF,
        selectData,
      })
    },

    // 滑动删除begin
    touchstart(e) {
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
      })
    },

    touchmove(e) {
      let that = this,
        index = e.currentTarget.dataset.index,
        startX = that.data.startX,
        startY = that.data.startY,
        touchMoveX = e.changedTouches[0].clientX,
        touchMoveY = e.changedTouches[0].clientY,
        isTouchMove = false,
        angle = that.angle({
          X: startX,
          Y: startY
        }, {
            X: touchMoveX,
            Y: touchMoveY
          });
        if (Math.abs(angle) > 30) return;
        if (touchMoveX > startX - 100 )
          isTouchMove = false
        else
          isTouchMove = true

      // console.log(touchMoveX, startX, isTouchMove)
      if (isTouchMove) {
        this.hide()
      }
    },

    angle(start, end) {
      var _X = end.X - start.X,
        _Y = end.Y - start.Y
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },

  },

})