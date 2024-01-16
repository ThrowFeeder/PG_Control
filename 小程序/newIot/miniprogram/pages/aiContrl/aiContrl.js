// pages/user/user.js
var _app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuitems: [
      { text: '我的设备', url: '/pages/aiContrl/mDevices/mDevices', icon: '../../png/wj.png', tips: '', arrows: '../../png/pl.png' },
      // { text: '安全日志', url: '#', icon: '../../png/wj.png', tips: '', arrows: '../../png/pl.png' },
      // { text: '数据总览', url: '#', icon: '../../png/wj.png', tips: '', arrows: '../../png/pl.png' }
    
    ],
    userInfo:'',
  },
  onLoad(){
    let user=wx.getStorageSync('user')
    this.setData({
      userInfo:user
    })
 },
 login(){
   
   wx.getUserProfile({
     desc: '必须授权才能使用',
     success:res=>{
       let user=res.userInfo
       wx.setStorageSync('user', user)
 console.log('成功',res)
 this.setData({
   userInfo:user
 })
 },
     fall:res=>{
       console.log('失败',res)
     }
   })
 
 },
 nologin(){
  this.setData({
    userInfo:''
  })
  wx.setStorageSync('user', null)
 },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  

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
