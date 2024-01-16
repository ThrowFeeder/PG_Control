// dht11 mqtt��װ�� 
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
  
// ��ȡ���������� 
uint8 readSensorData(void)
{
    uint8 crc; 
    uint8 i;
  
    pinMode(pinNumber, OUTPUT); // �������ģʽ 
    digitalWrite(pinNumber, 0); // д��͵�ƽ 
    delay(25);
    digitalWrite(pinNumber, 1); // д��ߵ�ƽ 
    pinMode(pinNumber, INPUT); // ��������ģʽ 
    pullUpDnControl(pinNumber, PUD_UP); // �������赽3.3v 
 
    delayMicroseconds(27);
    
    if (digitalRead(pinNumber) == 0) //���Ϊ�͵�ƽ 
    {
        while (!digitalRead(pinNumber))
            ; //�ȵ�ƽ��� 
 
        for (i = 0; i < 32; i++)
        {
            while (digitalRead(pinNumber))
                ; //����ʱ�ӿ�ʼ 
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
                ; //����ʱ�ӿ�ʼ 
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


  

