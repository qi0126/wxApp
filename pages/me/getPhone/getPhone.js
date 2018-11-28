const app = getApp()

Page({
  data: {
    phone:'',//手机号
    code:'',//验证码
    iscode: '',//用于存放验证码接口里获取到的code
    codename:'获取验证码',
    disabledCode: true
  },

  getPhoneValue(e){
    this.setData({
      phone:e.detail.value
    })
  },

  getCodeValue(e) {
    let disabledCode;
    const val = e.detail.value
    disabledCode = true
    if (val.length > 4) {
      disabledCode = false
    }
    this.setData({
      code: e.detail.value,
      disabledCode
    })
  },

  getCode(){
    const params = {
      phone: this.data.phone
    }
    let self = this;
    if (this.data.phone == "") {
      app.$u.showToast('手机号不能为空')
      return false;
    } else if (this.data.phone.trim().length !== 11) {
      app.$u.showToast('请输入正确的手机号')
      return false;
    }else{
      app.$api.userSendCode(params).then(res => {
        self.setData({
          disabled: true,
          codename: 59 + "s"
        })
        let num = 59;
        let timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            self.setData({
              codename: '重新发送',
              disabled: false
            })

          } else {
            self.setData({
              codename: num + "s"
            })
          }
        }, 1000)
      })
      
    }
    
    
  },
  //获取验证码
  getVerificationCode() {
    if (!this.getCode()) {
      return false
    }
    this.setData({
      disabled: true
    })
  },

  //提交表单信息
  save(){
    if(this.data.phone == ""){
      app.$u.showToast('手机号不能为空')
      return false;
    }else if(this.data.phone.trim().length !== 11){
      app.$u.showToast('请输入正确的手机号')
      return false;
    }
    if(this.data.code === ""){
      app.$u.showToast('验证码不能为空')
      return false;
    }else {
      const {phone, code} = this.data
      const params = {
        phone,
        code
      }
      app.$api.userValidateCode(params).then(res => {
        app.$u.showToast('手机号验证码成功')
        wx.setStorageSync('phone', params)
         setTimeout(() => {
           wx.navigateBack({
             delta: 1,
           })
         })
      })
    }
  }

})