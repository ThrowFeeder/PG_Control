
#include "m_gear.h"
#define pinGear 28
#define rangeGear 200
int initPwm = 16;
void gearInit(void) {
	wiringPiSetup();
	pinMode(pinGear,OUTPUT);
	softPwmCreate(pinGear,initPwm,rangeGear);

	
}

void stopGearPwm(void) {
	softPwmStop(initPwm );
	
} 

void gearCtrl(char ctl) {
	
	if (ctl == 'l') {
		
		if (initPwm < 25) {
			initPwm = initPwm + 3;
			softPwmWrite(pinGear,initPwm);
			printf("jiaodu --->%d\n",initPwm);
		}
		
	}
	
	if (ctl == 'r') {
		
		
		if (initPwm > 7) {
			initPwm = initPwm - 3;
			softPwmWrite(pinGear,initPwm);
			printf("jiaodu --->%d\n",initPwm);
		}
		
	}   
	
}




/*
int main() {
	gearInit();
	
	char a;
	while(1)
	{
	printf("shuru  <----->\n");
	scanf("%c",&a);
	gearCtrl(a);
		
	}

	
	
}
* 
* 
* */
