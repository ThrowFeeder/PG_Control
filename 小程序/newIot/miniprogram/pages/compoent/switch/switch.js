// pages/compoent/switch/switch.js
const app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    switchtitle:{
      type:"string",
      value:"( )"
    },
    selectvalue:{
      type:"string",
      value:false 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    switch1Checked: true,
    switch2Checked: false,
    switch1Style: '',
    switch2Style: 'text-decoration: line-through'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pt:function(e){
     var  switch_value = e.detail.value;
     if (e.detail.value == "0") {
      app. onClick_PubMsg('motoLRF','off');
     }
      console.log(e.detail.value);
    
    }
  },
    observers: {
    'selectvalue': function (val) {
    
    }
  },

})

