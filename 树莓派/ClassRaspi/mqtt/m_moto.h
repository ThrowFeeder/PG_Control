#ifndef M_MOTO_H
#define M_MOTO_H
#include<wiringPi.h>

// ��ʼ�� 
void moto_init(void);
// ����  ֹͣ 
void moto_rest(void);
// ǰ + ����
void moto_forward(int value);
//�� + ����
void moto_backward(int value);

#endif
