const app = getApp()

Page({
  /** 
   * 页面的初始数据
   */ 
  data: { 
    focus: false,
    flag: true,
    inputValue: '',
    imgDispList: [{ //图片数组
      'id': '001',
      'categoryName': '戒指',
      'endValue': 'RING',
      'imgBig': '/images/class/class01big.jpg',
      'imgSmall': '/images/class/class01small.jpg',
      'routerURL':'/pages/class/subClassDisp/subClassDisp',
      'checked': false
    }, {
      'id': '002',
      'categoryName': '项链',
      'endValue': 'NECKLACE',
      'imgBig': '/images/class/class02big.jpg',
      'imgSmall': '/images/class/class02small.jpg',
      'routerURL': '/pages/class/subClassDisp/subClassDisp',
      'checked': false
    }, {
      'id': '003',
      'categoryName': '耳饰',
      'endValue': 'EARRINGS',
      'imgBig': '/images/class/class03big.jpg',
      'imgSmall': '/images/class/class03small.jpg',
      'routerURL': '/pages/class/subClassDisp/subClassDisp',
      'checked': false
    }, {
      'id': '004',
      'categoryName': '手环',
      'endValue': 'BRACELET',
      'imgBig': '/images/class/class04big.jpg',
      'imgSmall': '/images/class/class04small.jpg',
      'routerURL': '/pages/class/subClassDisp/subClassDisp',
      'checked': false
    }, {
      'id': '005',
      'categoryName': '吊坠',
      'endValue': 'PENDANT',
      'imgBig': '/images/class/class05big.jpg',
      'imgSmall': '/images/class/class05small.jpg',
      'routerURL': '/pages/class/subClassDisp/subClassDisp',
      'checked': false
    }],
  },
  imgDispNewList:[],//
  // 点击图片放大事件
  ImgCheckbox(e) {
    const { item } = e.currentTarget.dataset
    for (let i = 0; i < this.data.imgDispNewList.length; i++) {
      if (this.data.imgDispNewList[i].id == item.id) {
        this.data.imgDispNewList[i].checked = true
      } else {
        this.data.imgDispNewList[i].checked = false
      }
    }
    this.setData({
      imgDispNewList: this.data.imgDispNewList
    })
    if (item.checked) {
      this.RouterCheck(e)
    }
  },

  goQuery() {
    wx.navigateTo({
      url: '/pages/class/diamondQuery/diamondQuery',
    })
  },

  //路由跳转
  RouterCheck:function(e){
    const { item } = e.currentTarget.dataset
    // this.ImgCheckbox(e)
    wx.navigateTo({
      url: `/pages/class/subClassDisp/subClassDisp?categoryId=${item.categoryId}&categoryName=${item.categoryName}`,
    })
  },

  //搜索
  searchFun() {
    wx.navigateTo({
      url: "../../search/search/search?currentPage=class"
    })
  },

  onShow() {
    app.$api.cartNum()
    const { imgDispList } = this.data
    var self = this
    let params = { brandType: 1 }
    app.$api.selectCategoryOnlyStore(params).then(res => {
      var tempImgList = []
      imgDispList.forEach(ielem=>{
        res.data.forEach(jelem=>{
          if (jelem.categoryName === ielem.categoryName){
            ielem.categoryId = jelem.categoryId
            tempImgList.push(ielem)
          }
        })
      })
      if (tempImgList[0]) {
        tempImgList[0].checked = true
      }
      self.setData({
        imgDispNewList: tempImgList
      })
    })
  },


})