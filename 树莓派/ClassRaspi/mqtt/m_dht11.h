#ifndef M_DHT11_H
#define M_DHT11_H

#include <wiringPi.h>
typedef unsigned char uint8;
  
// ��ȡ���������� 
wiringPiSetup();
void dht11SetMode(void);
uint8 readSensorData(void); 

#endif




