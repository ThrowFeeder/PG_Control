// dht11 mqtt封装版 
#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include "m_dht11.h"

#define HIGH_TIME 32
 
typedef unsigned char uint8;
typedef unsigned int  uint16;
typedef unsigned long uint32;
 

 
int pinNumber = 0;
uint32 databuf;
void dht11SetMode(void){
    pinMode(pinNumber,OUTPUT);
    digitalWrite(pinNumber,1);
    
}
  
// 读取传感器数据 
uint8 readSensorData(void)
{
    uint8 crc; 
    uint8 i;
  
    pinMode(pinNumber, OUTPUT); // 设置输出模式 
    digitalWrite(pinNumber, 0); // 写入低电平 
    delay(25);
    digitalWrite(pinNumber, 1); // 写入高电平 
    pinMode(pinNumber, INPUT); // 设置输入模式 
    pullUpDnControl(pinNumber, PUD_UP); // 上拉电阻到3.3v 
 
    delayMicroseconds(27);
    
    if (digitalRead(pinNumber) == 0) //针脚为低电平 
    {
        while (!digitalRead(pinNumber))
            ; //等电平变高 
 
        for (i = 0; i < 32; i++)
        {
            while (digitalRead(pinNumber))
                ; //数据时钟开始 
            while (!digitalRead(pinNumber))
                ; 
                
            delayMicroseconds(HIGH_TIME);
            
            databuf *= 2;
            if (digitalRead(pinNumber) == 1) //1
            {
                databuf++;
            }
        }
 
        for (i = 0; i < 8; i++)
        {
            while (digitalRead(pinNumber))
                ; //数据时钟开始 
            while (!digitalRead(pinNumber))
                ; 
                
            delayMicroseconds(HIGH_TIME);
            crc *= 2;  
            if (digitalRead(pinNumber) == 1) //1
            {
                crc++;
            }
        }
        return 1;
    }
    else
    {
        return 0;
    }
}


  

