let CryptoJS = require('../utils/aes.js').CryptoJS
import $u from '../utils/util.js'
// api设置 
  
// let baseUrl = 'http://192.168.21.122:8880/' // cxl
// let baseUrl = 'http://192.168.21.242:8881/';// 海生
let baseUrl = 'http://192.168.16.18:8081/' // cs
// let baseUrl = 'http://192.168.21.185/ezjewelry-front/' // xwh
// let baseUrl = 'http://192.168.16.71:8881/' // gzg
// let baseUrl = `https://f.ezgold.cn/`

class Api { 
  constructor() {
 
  }

  buildURL(url, needToken) { 
    return url 
  } 

  // 公用拦截
  intercept(res, resolve, reject) {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    if (res.data.code === 200) {
      resolve(res.data)
    } else if (res.data.code === 203) {
      reject(res)
      $u.showToast(res.data.msg)
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index/index'
        })
      }, 800)
    } else if (res.data.code === 205 || res.data.code === 1001) {
      console.log(typeof res.data.code)
      resolve(res.data)
    } else {
      $u.showToast(res.data.msg)
      reject(res)
    }
  }

  // 参数处理
  paramsMana(params) {
    let otherParams = {
      // blockName: `BLOCK-DESIGNER`
      // blockName: `BLOCK-DIAMOND`
    }
    params = params ? params : {}
    Object.assign(params, otherParams)
    return params
  }


  /**
   * 请求设置
   * params { string } url 请求地址
   * parmas { object } params  请求参数
   */
  get(url, params, needToken, blockName) {
    url = api.buildURL(url, needToken)
    if (!url) {
      return
    }
    // blockName 类型
    params = api.paramsMana(params)
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + url,
        data: params,
        header: {
          'Authorization': `${wx.getStorageSync('accessToken')}`
        },
        success(res) {
          api.intercept(res, resolve, reject)
        }
      })
    })
  }

  post(url, params, needToken) {
    url = api.buildURL(url, needToken)
    if (!url) {
      return
    }
    params = api.paramsMana(params)
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + url,
        method: 'POST',
        data: params,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `${wx.getStorageSync('accessToken')}`
        },
        success(res) {
          api.intercept(res, resolve, reject)
        }
      })
    })
  }

  // 上传
  updataAvatar(url, params) {
    url = api.buildURL(url, true)
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        success(res) {
          let tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: baseUrl + url,
            filePath: tempFilePaths[0],
            name: 'file',
            formData: params,
            header: {
              'Authorization': `${wx.getStorageSync('accessToken')}`
            },
            success(res) {
              res = JSON.parse(res.data)
              resolve(res)
            },
            fail() {
              $u.showToast('上传失败')
            }
          })
        }
      })
    })
  }

  /**
   * Api列表
   */

  // 上传图片
  commonUploadImg(params) {
    return api.updataAvatar('uploadImg', params, false)
  }

  /**
   *  购物车(郭志剛)
   */

  // 查看购物车数量
  cartNum(params) {
    return api.cartList({}).then(res => {
      let { rowSize } = res.data
      rowSize = rowSize.toString()
      if (rowSize !== '0') {
        wx.setTabBarBadge({
          index: 3,
          text: rowSize
        })
      }else {
        wx.removeTabBarBadge({
          index: 3,
        })
      }
    })
  }

  // 查看购物车列表
  cartList(params) {
    return api.get('cart/list', params, false)
  }

  // 添加到购物车(单个) 
  cartAdd(params) {
    return api.post('cart/add', params, false)
  }

  // 删除购物车记录(可多选)
  cartDel(params) {
    return api.get('cart/del', params, false)
  }

  // 清空购物车
  cartEmpty(params) {
    return api.get('cart/empty', params, false)
  }

  // 更新商品数量
  cartUpdate(params) {
    return api.get('cart/update', params, false)
  }

  // 查询当前购物车中的商品总数
  cartCount(params) {
    return api.get('cart/count', params, false)
  }

  // 单品创建订单
  createOrderSingle(params) {
    return api.post('order/createOrderSingle', params, false)
  }

  // 订单列表
  orderMyOrders(params) {
    return api.post('order/myOrders', params, false)
  }

  // 订单操作
  orderOperateSelf(params) {
    return api.get('order/operateSelf', params, false)
  }
 
  // 查看我的订单的详情
  orderMyOrderDetail(params) {
    return api.get('order/myOrderDetail', params, false)
  }

  // 购物车下单
  orderCreateFromCart(params) {
    return api.get('order/createFromCart', params, false)
  }

  // 获取支付信息(小程序和公众号, JSAPI方式)
  orderGetPayJsApi(params) {
    return api.get('order/getPayJsApi', params, false)
  }

  // 查看订单支付状态(目前只支持微信支付和现金支付两种)
  orderPayStatu(params) {
    return api.get('order/payStatu', params, false)
  }

  // 取消订单
  orderCancelOrder(params) {
    return api.get('order/payStatu', params, false)
  }

  // 订单
  orderRetailStatuList(params) {
    return api.get('/order/retailStatuList', params, false)
  }

  /**
   *  产品(杨海生)
   */
  // 查询首页甄选
  productSelectHotgunStoreProduct(params) {
    return api.get('web/product/selectHotgunStoreProduct', params, false)
  }

  // 查询分类
  selectCategoryOnlyStore(params) {
    return api.get('web/product/selectCategoryOnlyStore', params, false)
  }

  //查询适合人群，材质信息
  selectTextureAndCrowd(params) {
    return api.get('web/product/selectTextureAndCrowd', params, false)
  }

  // 查询店铺关联的设计师信息
  selectDesignerInfo(params) {
    return api.get('web/product/selectDesignerInfo', params, false)
  }

  //用户登录小程序，获取相关设计师的商品数据信息
  selectStoreBrandProduct(params) {
    return api.get('web/product/selectStoreBrandProduct', params, false)
  }

  //查询产品详情 id
  selectStoreBandProduct(params) {
    return api.get('/web/product/selectStoreBandProduct', params, false)
  }
  // selectStoreCartProductInfo

  //查询产品详情 proNo
  selectStoreCartProductInfo(params) {
    return api.get('/web/product/selectStoreCartProductInfo', params, false)
  }

  // 查询设计师产品详情
  selectStoreDesignerProduct(params) {
    return api.get('/web/product/selectStoreDesignerProduct', params, false)
  }

  //查询设计师适合人群，材质信息，分类，系列
  selectDesignerTextureAndCrowd(params) {
    return api.get('/web/product/selectDesignerTextureAndCrowd', params, false)
  }

  //用户登录小程序，获取相关设计师的商品数据信息
  selectDesignerProduct(params) {
    return api.get('web/product/selectDesignerProduct', params, false)
  }

  //搜索页面，要查询最新款，和分类的产品信息
  selectNewStoreProductInfo(params) {
    return api.get('web/product/selectNewStoreProductInfo', params, false)
  }

  //店铺搜索所有的产品数据
  selectSearchNameCommon(params) {
    return api.post('web/product/selectSearchNameCommon', params, false)
  }

  //店铺搜索品牌数据
  selectSearchNameFactory(params) {
    return api.get('web/product/selectSearchNameFactory', params, false)
  }

  //店铺搜索设计师数据
  selectSearchNameDesigner(params) {
    return api.get('web/product/selectSearchNameDesigner', params, false)
  }

  //分类筛选
  classFilter(params) {
    return api.get('web/product/selectStoreBrandProduct', params, false)
  }

  //首页、设计师筛选
  indexDesginFilter(params) {
    return api.get('web/product/selectDesignerProduct', params, false)
  }

  // 查询公共数据信息
 
  /**
   *  用户(夏文浩)
   */

  // 登录处理
  getLogin(options) {
    let scode;
    return new Promise((reslove, reject) => {
      wx.login({
        success(res) {
          const code = res.code
          const params = {
            code: res.code,
            scode: options.scode,
            name: options.name,
            sex: options.sex,
            pic: options.pic,
            region: options.region,
          }
          if (!options.scode) {
            delete params.scode
          }
          if (!options.name) {
            delete params.name
          }
          if (!options.sex) {
            delete params.sex
          }
          if (!options.pic) {
            delete params.pic
          }
          if (!options.region) {
            delete params.region
          }
          api.userLogin(params).then(res => {
            wx.setStorageSync('accessToken', res.data[0])
            wx.setStorageSync('shopId', res.data[1])
            reslove(res)
          })
        },
      })

    })
  }

  userLogin(params) {
    return api.post('user/wxLogin', params, false)
  }

  userShop(params) {
    return api.get('user/shop', params, false)
  }

  // 新增地址
  addrAdd(params) {
    return api.post('addr/add', params, false)
  }

  // 编辑
  addrUpload(params) {
    return api.post('addr/update', params, false)
  }

  // 地址列表
  addrList(params) {
    return api.post('addr/list', params, false)
  }

  // 刪除收货地址
  addrDel(params) {
    return api.post('addr/del', params, false)
  }

  // 查询证书
  getCert(params) {
    return api.get('getCert', params, false)
  }

  // 查询默认地址
  addrDef(params) {
    return api.get('addr/def', params, false)
  }

  // 获取验证码
  userSendCode(params) {
    return api.post('user/sendCode', params, false)
  }

  // 验证手机号
  userValidateCode(params) {
    return api.post('user/validateCode', params, false)
  }

  // 修改用户信息
  userEditInfo(params) {
    return api.post('user/editInfo', params, false)
  }

  // 获取登录用户信息
  userMyinfo(params) {
    return api.get('user/myinfo', params, false)
  }

  /**
   *  心愿单 (白怡波)
   */

  // 点击红心，收藏产品-----心愿单
  wishproductInsertWishProduct(params) {
    return api.get('wishproduct/insertWishProduct', params, false)
  }

  // 查询心愿产品(收藏)
  wishproductWishProcutList(params) {
    return api.get('wishproduct/wishProductList', params, false)
  }

  // 取消心愿单
  wishproductCancelWishProcut(params) {
    return api.get('wishproduct/cancelWishProcut', params, false)
  }

  // 批量取消心愿单
  wishproductCancelMangWishProcut(params) {
    return api.post('wishproduct/cancelMangWishProcut', params, false)
  }

  /**
   *  钻石行情 (行情)
   */

  diamondAttr(params) {
    return api.post('diamond/attr', params, false)
  }

  diamondFindDiamond(params) {
    return api.post('diamond/findDiamond', params, false)
  }
}

let api = new Api()

export default api