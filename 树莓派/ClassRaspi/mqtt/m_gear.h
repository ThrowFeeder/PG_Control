#ifndef M_GEAR_H
#define M_GEAR_H

#include "wiringPi.h"
#include "stdio.h"
#include "softPwm.h"







void gearInitY(void) ;

void stopGearPwmY(void);

void gearCtrl(char ctl);

#endif
