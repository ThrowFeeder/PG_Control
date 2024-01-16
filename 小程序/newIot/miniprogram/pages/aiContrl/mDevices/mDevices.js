const db = wx.cloud.database().collection("deviceNums");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    deviceForm: [{
      _id: "",
      _openid: "",
      name: "未知",
      class: "未知",
      selected: false,
    }, ],
    deviceNums: '0',
    hiddenmodalput: true,
    val: {
      name: '',
      class: ''
    },
  },
  selectDevicefun: function () {
    db.where({
      _openid: "oHOFd4_hff_nCs8o0EYIpT3uYRoA"
    }).get().then(res => {
      let form = []
      res.data.forEach((item, index) => {
        form[index] = {}
        form[index]._id = item._id
        form[index]._openid = item._openid
        form[index].name = item.name
        form[index].class = item.class
        form[index].selected = false
      })
      this.setData({
        deviceForm: form,
        deviceNums: res.data.length
      })
    
    }).catch(err => {
      console.log(err);
    })
  },

  addDeviceFunc: function () {

  },
  modaladd: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  select(e) {
    let id = e.currentTarget.dataset.id
    let index = this.data.deviceForm.findIndex(item => item._id == id)
    let form = this.data.deviceForm
    if (this.data.deviceForm[index].selected) {
      form[index].selected = false
    } else {
      form[index].selected = true
    }
    this.setData({
      deviceForm: form
    })
  },
  deleteModal() {
    let ids = 
      this.data.deviceForm.filter(item => item.selected).map(item => item._id)
    ids.forEach(item => {
      db.where({
        _id: item
      }).remove().then(res => {
        if(res.stats.removed > 0){
          wx.showToast({
            title: "删除成功！",
            icon: 'success'
          })
          this.selectDevicefun();
        }
      })
    })

  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  confirmAdd: function (e) {
    let name = this.data.val.name
    let classs = this.data.val.class
    if (name.trim().length > 0 && classs.trim().length > 0) {
      db.add({
        data: {
          name,
          class: classs
        }
      }).then(res => {
        this.setData({
          hiddenmodalput: true
        })
        this.selectDevicefun();
        wx.showToast({
          title: "添加成功",
          icon: "success"
        })
      })
    } else {
      wx.showToast({
        title: '请先输入',
        icon: "error"
      })
    }
    console.log("clear");
    this.setData({
      val: {
        name: '',
        class: ''
      }
    })
    console.log(this.data.val);
  },

  setInputVal: function (e) {
    let prop = e.currentTarget.dataset.prop
    let value = this.data.val
    value[prop] = e.detail.value
    this.setData({
      val: value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectDevicefun();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})