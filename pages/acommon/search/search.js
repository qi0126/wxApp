const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentPage: {
      type: String,
      value: "home"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    $img: app.$img,
    $simg: app.$simg,
    showHistory: true,
    brandType: '',
    hotSaleData: [],//新品热卖数据
    Keyword: '',
    searchHistory: [],
  },

  created: function () {

  },

  attached: function () {
  },

  ready: function () {
    const { currentPage} = this.data
    if (currentPage == 'home') {
      this.setData({
        brandType: 0
      })
    } else if (currentPage == 'class') {
      this.setData({
        brandType: 1
      })
    } else if (currentPage == 'designer') {
      this.setData({
        brandType: 2
      })
    };
    let params = {
      brandType: this.data.brandType
    }
    this.getProductInfo(params);

    //获取历史记录
    this.getHistory();
  },

  methods: {

    //获取历史记录
    getHistory() {
      this.setData({
        searchHistory: wx.getStorageSync('searHistory')
      })
    },

    //进入搜索结果页面
    sarchResult(params) {
      wx.navigateTo({
        url: `/pages/search/searchResult/searchResult?searchName=${params.searchName}&way=${params.page}`
      })
    },

    //输入框搜索事件
    onBindConfirm(e) {
      let Keyword = e.detail.value;
      let params = {
        searchName: Keyword,
        page: this.data.currentPage
      }
      this.saveKeyWord(Keyword);
      this.getHistory();
      this.sarchResult(params)
    },

    //保存关键字
    saveKeyWord(Keyword) {
      let searHistory = [], flag = false
      if (!wx.getStorageSync('searHistory') && Keyword.trim() !== "") {
        searHistory.unshift(Keyword)
        wx.setStorageSync('searHistory', searHistory)
      } else {
        searHistory = wx.getStorageSync('searHistory')
        if (!searHistory.includes(Keyword) && Keyword.trim() !== "") {
          flag = true
        }
        if (flag) {
          searHistory.unshift(Keyword)
          if (searHistory.length >= 8) {
            searHistory.length = 8
          }
          wx.setStorageSync('searHistory', searHistory)
        }
      }

    },
    //取消搜索
    cancelSearch() {
      this.setData({
        Keyword: ''
      })
    },
    //关键字搜索
    keyWordSearch(e) {
      const { keyword: searchName } = e.currentTarget.dataset
      const { currentPage: page} = this.data
      let params = {
        searchName,
        page
      }
      this.getHistory();
      this.sarchResult(params)
    },
    //删除历史记录
    delHistory(e) {
      const { num } = e.currentTarget.dataset
      let searchHistory = wx.getStorageSync('searHistory');
      searchHistory.splice(num, 1);
      console.log(searchHistory)
      wx.setStorageSync('searHistory', searchHistory);
      this.setData({
        searchHistory
      })
    },
    //查看产品详情
    checkProductDetail(e) {
      let productid = e.currentTarget.dataset.productid;
      wx.navigateTo({
        url: `/pages/product/productDetail/productDetail?productId=${productid}&way=des`,
      })
    },

    //获取新品热卖数据
    getProductInfo(params) {
      app.$api.selectNewStoreProductInfo(params).then(res => {
        this.setData({
          hotSaleData: res.data
        })
      });
    },
    historyFun: function () {
      this.setData({
        showHistory: false
      })
    },
    cancelHistory: function () {
      this.setData({
        showHistory: true
      })
    },
  }
})
