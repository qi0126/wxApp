import api from 'fetch/api'
import util from 'utils/util'
import date from 'utils/date'
import validate from 'utils/validate'
import { city } from 'utils/citydata'


// const $img = 'https://image.szsjysy.com/', // 线上
const $img = 'https://image.ezgold.cn/', // 动态图片
  $simg = 'https://image.ezgold.cn/'  // 静态图片

App({
  onLaunch() {

  },

  onShow() { 

  },

  globalData: {
    useInfo: null,
    searchData:[]
  },

  $api: api,

  $img,

  $simg,

  $u: util,

  $city: city,

  $d: date,

  $v: validate
})
