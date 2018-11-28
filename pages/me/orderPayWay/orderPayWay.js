const app = getApp()

Page({
	data: {
		checked: true,
		wxChecked: true,
		imgStatus: {
			a: '/images/class/checkedTrue.png',
			b: '/images/class/checkedFalse.png',
		},
	},
	
	//微信确认
	wxConfirmFun: function () {
		if (this.data.wxChecked) {
			this.setData({
				wxChecked: false
			})
		} else {
			this.setData({
				wxChecked: true
			})
		}
	},
	
	onLoad(options) {
	
	},
	
	onShow() {
	}
	
})
