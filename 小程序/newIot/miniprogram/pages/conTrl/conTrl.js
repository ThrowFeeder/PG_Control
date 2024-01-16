// pages/conTrl/conTrl.js
const app =  getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    paraTitle:[
      "温度",
      "湿度",

    ],
    viewstyle:{
      motoheight:"600",
      cameraheight:"400",
      parameterheight:"500",
      waterpumpheight:"300"


    },
    moto_topic:"motoLRF",
    moto_topic_fast:"motoFAST",
    moto_payloadcrl:"right",
    moto_payloadpower:"on",

    temp_value_topic:"tempvalue",
    rh_value_topic:"rhvalue",

    tempSelectStart:[],
    tempSelectEnd:[],
    rhSelectStart :[],
    rhSelectEnd:[] ,
    tempCurColumIdex:[20,30],
    rhCurColumIdex:[30,60],


  },
    

  // 触摸特效
  // pages/test/test.js

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


  selectvalue(bl){
   
    this.setData({
      selectvalue:bl
    })
  },
  //减速电机开关控制
  motopower: function() {
    if (this.data.moto_payloadpower === "off") { //监听事件返回值
      //改变数据
      this.setData({
        moto_payloadpower:"on"
      })
       wx.showToast({
        title: 'power_on',
        icon:"none"
      })
    }else {
      this.setData({
        //改变数据
        moto_payloadpower:"off"
      }) 
      wx.showToast({
        title: 'power_off',
        icon:"none"
      })
    }
  },
  //实现指令发送
  sendLeftMoto: function() {
//判断当前状态
    if (this.data.moto_payloadpower == 'on') {
      //发送行为向左指令
      this.moto_publish(this.data.moto_topic,'leftstop');
      wx.showToast({
        title: 'moto_left',
        icon: 'none',
      })
    }else {
      //错误提示
      wx.showToast({
        title: '开关未打开',
        icon: 'none',
      })
    }
  },
  sendRightMoto: function() {
    //发送向右指令
    if (this.data.moto_payloadpower == 'on') {
      this.moto_publish(this.data.moto_topic,'rightstop');
      wx.showToast({
        title: 'moto_right',
        icon: 'none',
      })
    }else {
      wx.showToast({
        title: '开关未打开',
        icon: 'none',
      })
    }
  },
  waterPumPub: function() {
    this.moto_publish('waterPopen','openwater')
  },
  
  moto_publish: function(topic,payload) {
    
    app.onClick_PubMsg(topic,payload);
    
  },
  sliderctl:function(e){
    var slidernum = e.detail.value;
    slidernum = slidernum + "";
    this.moto_publish(this.data.moto_topic_fast,slidernum);
  },

  bindMultPickerTempColumnChange: function(e) {
    var curColum = e.detail.column; // curColum 当前滑动的列数
    var curColumIdex = e.detail.value; // curColumIdex 选择某一列值的索引
    var tempSelectArr = this.data.tempSelectArr
    this.setData({
      tempCurColumIdex:curColumIdex
    });

  },

  bindMultPickerRhColumnChange: function(e) {
    var rhcurColum = e.detail.column; // curColum 当前滑动的列数
    var rhcurColumIdex = e.detail.value; // curColumIdex 选择某一列值的索引
    var rhSelectArr = this.data.rhSelectArr
    // console.log('a修改的列为',rhcurColum,', 值为',rhcurColumIdex);
    this.setData({
      rhCurColumIdex:rhcurColumIdex
    });
 
  },
  //未调用  （自动化次核心逻辑）
  paraComparePubMsg: function() {
    var tempSelectArr = this.data.tempCurColumIdex;
    var rhSelectArr = this.data.rhCurColumIdex;
    var ylStateValue = app.data.subpayload.senoyl69.payload 
    var arrbuf;
    var TEMPMAX;
    var TEMPMIN;
    var RHMAX;
    var RHMIN;
    var intTempMax;
    var intTempMin;
    var intRhMax;
    var intRhMin;
    

    setInterval(()=>{
      
     
    tempSelectArr = this.data.tempCurColumIdex;
    rhSelectArr = this.data.rhCurColumIdex;
  

    if (tempSelectArr[0] + 1 >= tempSelectArr[1] + 2 ) {
      TEMPMAX = tempSelectArr[0] + 1 ;
      TEMPMIN = tempSelectArr[1] + 2;
    }else {
      TEMPMAX = tempSelectArr[1] + 2;
      TEMPMIN = tempSelectArr[0] + 1;
    }
    intTempMax = parseFloat(TEMPMAX);
    intTempMin = parseFloat(TEMPMIN);
    app.onClick_PubMsg(this.data.temp_value_topic,intTempMax+'');
    app.onClick_PubMsg(this.data.temp_value_topic,intTempMin+'');
    if (rhSelectArr[0] + 1 >= rhSelectArr[1] + 2) {
      RHMAX = rhSelectArr[0] + 1;
      RHMIN = rhSelectArr[1] + 2;
    }else {
      RHMAX = rhSelectArr[1] + 2;
      RHMIN = rhSelectArr[0] + 1;
    }
    intRhMax = parseFloat(RHMAX);
    intRhMin = parseFloat(RHMIN);
    app.onClick_PubMsg(this.data.rh_value_topic,intRhMax+'');
    app.onClick_PubMsg(this.data.rh_value_topic,intRhMin+'');
  

    },2000)
   

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    var tempSelectStart = [];
    var tempSelectEnd = [];
    var tempSelectArr = [];
    var rhSelectStart = [];
    var rhSelectEnd = [];
    var rhSelectArr = [];

    for (var i = 1; i < 100; i++) {
      tempSelectStart.push(`${i}°`);
      tempSelectEnd.push(`${i + 1}°`);

      rhSelectStart.push(`${i}%`);
      rhSelectEnd.push(`${i + 1}%`);

    }

    tempSelectArr.push(tempSelectStart);
    tempSelectArr.push(tempSelectEnd);

    rhSelectArr.push(rhSelectStart);
    rhSelectArr.push(rhSelectEnd);
    _this.setData({
      tempSelectArr:tempSelectArr,
      rhSelectArr:rhSelectArr
    })

    // app.globalData.contrlPubParaL = this;
    this.paraComparePubMsg();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.switchCtl = this.selectComponent('.switch-Ctl'); //获取switch组件
   
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

