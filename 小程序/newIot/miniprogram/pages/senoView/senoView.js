// pages/senoView/senoView.js
import * as echarts from '../../ec-canvas/echarts';
var util = require('../../utils/util.js');
const app =  getApp();


function line_set(chart, xdata, yrhdata,ytempdata){
  var option = {
    title: {
      text: '实时图',
      left: 'center'
    },
    legend: {
      name: ['TEMP','RH'],
      top: 50,
      left: 'center',
    },
    grid: {
      // containLabel: true,
      top: 100
    },
    tooltip: {     
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      axisLabel: {  //因为日期太长，显示不全，于是让横坐标斜着显示出来
        interval:0,  
        rotate:40  
     } ,
      boundaryGap: false,
      data: xdata,
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'TEMP',
      type: 'line',
      smooth: true,
      data: ytempdata
    }, {
      name: 'RH',
      type: 'line',
      smooth: true,
      data: yrhdata
    },
  ]
  };

  chart.setOption(option);
  // return chart; 
}

Page({
    
  /**
   * 页面的初始数据
   */
  data: {

    currentTab: 0, //顶部导航栏切换
    senostyle: {
      dht11height: "400", //温湿传感器
      dhtechartheight: "600",//dht echart
      soilMheight:"400" ,//土壤湿度
      soilMechartheight:"400" ,//
      cameraheight:"800"//摄像头
    },
    submsg:{
      sub_dht_mg:{
       "RHtitle":'RM',
        "RHvalue":'50',
        "TEMPtitle":'TEMP',
        "TEMPvalue":'28'
      },
      sub_yl69_mg:{
        "YLStateTitle":'当前湿度',
        "YLvalue":'适中'
      },
      sub_waterP_status:{
        "waterStatus":"关闭"
      },
      
    },
    ec: {
      lazyLoad: true,
      
    },
    timer:'',
    temp: new Array(10).fill(0),
    rhData: new Array(10).fill(0),
    isInit: false,
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


//  选取导航栏
swichNav: function (e) {

 
   
  var that = this;
   
  if (this.data.currentTab === e.target.dataset.current) {
 

   return false;
   
  } else {
  
  that.setData({
  
   currentTab: e.target.dataset.current,
   
   
  })

   
  }
 
   
  },
 
  swiperChange: function (e) {
     
    this.setData({
    
     
    currentTab: e.detail.current,
     
    })
     
     
    },
    
//温湿度数据订阅
  dhtSeno_sub:function() {
    //每秒执行订阅
      setInterval(()=>{
        //调用订阅函数
        app.onClick_SubOne();
        var dhtpalayvalue = app.data.subpayload.senodht.payload + ''; //处理订阅到的数据类型
        var yl69value = app.data.subpayload.senoyl69.payload //处理土壤湿度数据
        var waterPumStatValue = app.data.subpayload.waterPStatus.payload //处理水泵状态
    
        
        //判断是否为空数据
        if(dhtpalayvalue.length !== 0){
          //进行格式化分割
          var arr = dhtpalayvalue.split(":");
          console.log(arr);
          var value = arr[1].split(',');
          // 更新数据
          arr.splice(1,1,value[0],value[1]);
          this.setData({
           'submsg.sub_dht_mg.RHtitle':arr[0],
           'submsg.sub_dht_mg.RHvalue':arr[1],  
           'submsg.sub_dht_mg.TEMPtitle':arr[2],
           'submsg.sub_dht_mg.TEMPvalue':arr[3]
            
          })
        }
        //判断是否为空数据（土壤湿度）
        if(yl69value.length !== 0) {
        //判断土壤状态
          if (yl69value === '1') {
            this.setData({
              'submsg.sub_yl69_mg.YLvalue':'干燥'
            })
          }else {
            this.setData({
              'submsg.sub_yl69_mg.YLvalue':'潮湿'
            })
          }
        }
        if (waterPumStatValue === '1') {
          this.setData({
            'submsg.sub_waterP_status.waterStatus':'开启'
          })
        }else {
          this.setData({
            'submsg.sub_waterP_status.waterStatus':'关闭'
          })
        }
      }, 1000)

      // 判断水泵状态  waterPumStatValue
      
     
  },
 getTimeData: function() {
    var _that = this;
    this.getOption();
    this.setData({
      timer: setInterval(function() {
        _that.getOption();
      }, 2000)
    })
 },
 

 //初始化图
 init_chart: function (xdata,yrhdata,ytempdata) {
  if(!this.data.isInit){
    this.componentEchart.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
      });
      line_set(chart, xdata, yrhdata,ytempdata);
      this.chart = chart;
    });
    this.data.isInit = true
  }else{
    line_set(this.chart, xdata, yrhdata,ytempdata);
  }
 },

 getOption: function() {
    var timeData = [];
    timeData = util.getTimes(new Date())
    this.data.temp.shift();
    this.data.rhData.shift();
    this.data.temp.push(this.data.submsg.sub_dht_mg.TEMPvalue)
    let rh = this.data.submsg.sub_dht_mg.RHvalue
    this.data.rhData.push(rh)
    this.init_chart(timeData,this.data.rhData,this.data.temp);
 },

  /**
  * 页面的初始数据
  */

 
  onLaunch: function(){

  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.dhtSeno_sub();
    this.componentEchart = this.selectComponent('#mychartDome');
    this.getTimeData();
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