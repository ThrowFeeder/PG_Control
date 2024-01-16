#include<wiringPi.h>
#include<stdio.h> 
#include "m_waterp.h"
#define pinNumW 4

//luoji  gaoweidianpin cufa jidianqi kai fanzhi

wiringPiSetup();

// zhi xing 4sec
void open_waterp(void) {
	pinMode(pinNumW,OUTPUT);
	digitalWrite(pinNumW,HIGH);
	
}


void close_waterp(void) {
	
	digitalWrite(pinNumW,LOW);
	
}
