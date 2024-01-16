#ifndef M_GEAR_Y_H
#define M_GEAR_Y_H

#include "wiringPi.h"
#include "stdio.h"
#include "softPwm.h"







void gearInitY(void) ;

void stopGearPwmY(void);

void gearCtrlY(char ctl);

#endif
