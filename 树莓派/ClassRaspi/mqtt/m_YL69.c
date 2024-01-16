#include<wiringPi.h>
#include<stdio.h> 
#include "m_YL69.h"

#define pinNumL 3


int ylcheck(void) {
	int value;
	wiringPiSetup();
	pinMode(pinNumL,INPUT);
	
	value = digitalRead(pinNumL);
	
	if (value == 1) {
		return 1;
	}else {
		return 0;
		
	}
			
	
	
}
