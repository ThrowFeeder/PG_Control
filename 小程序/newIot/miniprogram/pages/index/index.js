
const app =  getApp();





Page({
  data: {
    gearDownCtlTopic:'geardownctl' //舵机
  
    
  },

  // 触摸特效


  containerTap: function (res) {
    var that = this
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
      rippleStyle: ''
    });
    setTimeout(function () {
      that.setData({
        rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
      });
    },200)
  },


  sendLeftGear: function() {
    // console.log('left');
    app.onClick_PubMsg(this.data.gearDownCtlTopic,'geargoleft');
  },
  sendRightGear: function() {
    // console.log('right');
    app.onClick_PubMsg(this.data.gearDownCtlTopic,'geargoright');
  },
  sendUpGear: function() {
    // console.log('up');
    app.onClick_PubMsg(this.data.gearDownCtlTopic,'geargoup');
  },
  sendDownGear: function() {
    // console.log('down');
    app.onClick_PubMsg(this.data.gearDownCtlTopic,'geargodown');
  },
  
  conne: function() {
    app.onClick_connect();
  },
  //options(Object)
  onLoad: function(options){
    
  },
  onReady: function(){

  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});