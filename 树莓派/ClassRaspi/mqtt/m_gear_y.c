
#include "m_gear_y.h"
#define pinGearY 21
#define rangeGearY 400
int initPwmY = 6;
void gearInitY(void) {
	wiringPiSetup();
	pinMode(pinGearY,OUTPUT);
	softPwmCreate(pinGearY,initPwmY,rangeGearY);
	
	
}

void stopGearPwmY(void) {
	softPwmStop(initPwmY );
	
} 

void gearCtrlY(char ctl) {
	
	if (ctl == 'u') {
		
		if (initPwmY < 21) {
			initPwmY = initPwmY + 1;
			softPwmWrite(pinGearY,initPwmY);
			printf("jiaodu --->%d\n",initPwmY);
		}
		
	}
	
	if (ctl == 'd') {
		
		
		if (initPwmY > 3) {
			initPwmY = initPwmY - 1;
			softPwmWrite(pinGearY,initPwmY);
			printf("jiaodu --->%d\n",initPwmY);
		}
		
		
	}   
	
}



