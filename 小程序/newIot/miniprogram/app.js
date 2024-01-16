//app.js
import mqtt from "./utils/mqtt.js";
//连接配置 mqtt服务器
const host = 'wxs://url:8084/mqtt';

App({
  data: {
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId:'wx_' + parseInt(Math.random() * 100 + 800, 10),  //随机生成ID
      clean: false,
      password: 'public',
     
      username: 'admin',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    },
    topicName:[
      "dhtView",
      "ylcheckview",
      "seno/#"
    ],
    subpayload:{
      senodht:{
        payload:''
      },
      senoyl69:{
        payload:''
      },
      waterPStatus:{
        payload:''
      }
    }
  },
  // globalData:{
  //   contrlPubParaL:''
  // },
  onLaunch: function () {
    this.onClick_connect();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-0gl2cg1gd9922792',
        traceUser: true,
      })
    }
    //this.globalData.contrlPubParaL.paraComparePubMsg();
    // this.globalData = {}
  },
  onClick_connect: function() {
    var that = this;
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
    this.data.client.on('connect', function(connack) {
      console.log('mqtt服务器连接成功');
    })
    //服务器下发消息的回调
    that.data.client.on("message", function(topic, payload) {
     console.log(payload + '');

      if (topic === "seno/dhtView") {
        that.data.subpayload.senodht.payload = payload + ''    //转字符串 得到dht数据
      }

      if (topic == "seno/ylcheckview") {
        that.data.subpayload.senoyl69.payload = payload + ''
      }
      if (topic == "seno/waterStatus") {
        that.data.subpayload.waterPStatus.payload = payload + ''
       
      }

    })

    //服务器连接异常的回调
    that.data.client.on("error", function(error) {
      console.log(" 服务器 error 的回调" + error)

    })

    //服务器重连连接异常的回调
    that.data.client.on("reconnect", function() {
      console.log(" 服务器 reconnect的回调")

    })


    //服务器连接异常的回调
    that.data.client.on("offline", function(errr) {
      console.log(" 服务器offline的回调")

    })


  },
  onClick_SubOne: function() {
    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe(this.data.topicName[2], function(err, granted) {
        if (!err) {
        //  console.log("订阅成功");
       
        } else {
          wx.showToast({
            title: '订阅主题失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // onClick_SubMany: function(Topic) {

  //   if (this.data.client && this.data.client.connected) {
  //     //仅订阅多个主题
  //     this.data.client.subscribe({
  //       'Topic/dhtView': {
  //         qos: 0
  //       },
  //       'Topic/ylcheckview': {
  //         qos: 0
  //       }
  //     }, function(err, granted) {
  //       if (!err) {
  //         wx.showToast({
  //           title: '订阅多主题成功'
  //         })
  //         // console.log(TopicYl);
  //       } else {
  //         wx.showToast({
  //           title: '订阅多主题失败',
  //           icon: 'fail',
  //           duration: 2000
  //         })
  //       }
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '请先连接服务器',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   }
  // },
  onClick_PubMsg: function(topic,payload) {
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish(topic, payload);
      console.log('发布成功',topic,payload);
 
     
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onClick_unSubOne: function() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe('Topic1');
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onClick_unSubMany: function() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe(['Topic1', 'Topic2']);
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  }

})
