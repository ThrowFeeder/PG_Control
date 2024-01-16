//单电机封装 mqtt版 
#include<wiringPi.h>
#include<stdio.h> 
#include"m_moto.h"

// 逻辑输入 动力部分 
#define pinNumF 7
#define pinNumB 2
// 使能输入  控速部分
#define en_1_A 1


// 以上是一个马达的初始化 分别控制顺逆转动 和转速

// 初始化 
void moto_init(void) {
	wiringPiSetup();
	pinMode(pinNumF,OUTPUT);
	pinMode(pinNumB,OUTPUT);
	pinMode(en_1_A,PWM_OUTPUT);
	printf("over\n");
	
} 


// 重置  停止 
void moto_rest(void) {
	digitalWrite(en_1_A,LOW);
	digitalWrite(pinNumF,LOW);
	digitalWrite(pinNumB,LOW);
} 

 
// 前 + 调速
void moto_forward(int value) {
	moto_init();
	digitalWrite(pinNumF,HIGH);
	digitalWrite(pinNumB,LOW);
	pwmWrite(en_1_A,value);
	
}


//后 + 调速
void moto_backward(int value) {
	moto_init();
	digitalWrite(pinNumB,HIGH);
	digitalWrite(pinNumF,LOW);
	pwmWrite(en_1_A,value);
} 





