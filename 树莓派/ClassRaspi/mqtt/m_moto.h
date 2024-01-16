#ifndef M_MOTO_H
#define M_MOTO_H
#include<wiringPi.h>

// 初始化 
void moto_init(void);
// 重置  停止 
void moto_rest(void);
// 前 + 调速
void moto_forward(int value);
//后 + 调速
void moto_backward(int value);

#endif
