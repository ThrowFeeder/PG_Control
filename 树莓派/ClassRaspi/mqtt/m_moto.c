//�������װ mqtt�� 
#include<wiringPi.h>
#include<stdio.h> 
#include"m_moto.h"

// �߼����� �������� 
#define pinNumF 7
#define pinNumB 2
// ʹ������  ���ٲ���
#define en_1_A 1


// ������һ�����ĳ�ʼ�� �ֱ����˳��ת�� ��ת��

// ��ʼ�� 
void moto_init(void) {
	wiringPiSetup();
	pinMode(pinNumF,OUTPUT);
	pinMode(pinNumB,OUTPUT);
	pinMode(en_1_A,PWM_OUTPUT);
	printf("over\n");
	
} 


// ����  ֹͣ 
void moto_rest(void) {
	digitalWrite(en_1_A,LOW);
	digitalWrite(pinNumF,LOW);
	digitalWrite(pinNumB,LOW);
} 

 
// ǰ + ����
void moto_forward(int value) {
	moto_init();
	digitalWrite(pinNumF,HIGH);
	digitalWrite(pinNumB,LOW);
	pwmWrite(en_1_A,value);
	
}


//�� + ����
void moto_backward(int value) {
	moto_init();
	digitalWrite(pinNumB,HIGH);
	digitalWrite(pinNumF,LOW);
	pwmWrite(en_1_A,value);
} 





