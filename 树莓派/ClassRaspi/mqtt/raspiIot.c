//ʵ�����ݵĶ����뷢�� ��emqx 
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "MQTTClient.h"
#include "m_dht11.h" //��ʪ������ 
#include "m_moto.h" // ��� 
#include "m_waterp.h" //shui beng
#include "m_YL69.h"  // tu rang shi du
#include "m_gear.h"   // duo ji  x
#include "m_gear_y.h"  // duo ji y
#if !defined(WIN32)
#include <unistd.h>
#else
#include <windows.h>
#endif
#ifndef WIRINGPI_H
#define WIRINGPI_H
#endif

#define NUM_THREADS 11
#define ADDRESS     "4.1.2.5:1883" //mqtt������ 


#define PAYLOAD     "Hello Man, Can you see me ?!" //
#define QOS         1
#define TIMEOUT     10000L
#define USERNAME    "name"
#define PASSWORD    "pwd"
#define DISCONNECT  "out"
#define MAX_SAVE_DATA 512

extern databuf;

int CONNECT = 1;
int waterPumpFlags = 0;
int motoFastValue = 1000;
int delayTime = 3000;
 int senoTempMax = 30,senoTempMin = 20,senoRhMax = 60, senoRhMin = 45;
 
volatile MQTTClient_deliveryToken deliveredtoken;
//�ǵ�����������Ϣ���ͻ���ʱ���ͻ����ڴ˴����ܷ������Ϣ���ݡ�
int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message);
void SUB_classMqttClient(char *clientid,char *topic,int msgarrvd); //���� ��װ 
void PUB_classMqttClient(char *clientid,char *topic,char *payload);//���� ��װ 

char *topic[] = {
    "motoLRF",
    "motoFAST",
    "seno/dhtView",
    "waterPopen",
    "seno/ylcheckview",
    "tempvalue",
    "rhvalue",
    "geardownctl",
    "seno/waterStatus"
    
    
    };//���� 


//������֤ 
void delivered(void *context, MQTTClient_deliveryToken dt)
{
    printf("Message with token value %d delivery confirmed\n", dt);
    deliveredtoken = dt;
}


//����ʧ�� 
void connlost(void *context, char *cause)
{
    printf("\nConnection lost\n");
    printf("     cause: %s\n", cause);
}

//������� �߳� 
void *motoSubClient(void *threadid) {
	long tid;
	tid = (long)threadid;
	printf("Hello World! It's me, thread #%ld!\n", tid);
    
	moto_init();

	char clientid[] ="motoCtl1"; //�ͻ���id 
	
	
	 int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message)
		{
		   // int i;
		   // char* payloadptr;
		
		    printf("     topic: %s\n", topicName);
		    printf("   message: %s\n",message->payload);
		
		    
		    if(strcmp((char*)message->payload, "left") == 0){
			    
			    moto_forward(motoFastValue);
			    
			}else if(strcmp((char*)message->payload, "right") == 0)
			{
			    moto_backward(motoFastValue);
			    
			    
			}
			else if(strcmp((char*)message->payload,"rightstop") == 0){
			    moto_backward(motoFastValue);
			    delay(delayTime);
			    moto_rest();
			    
			}else if(strcmp((char*)message->payload,"leftstop") == 0) {
			    moto_forward(motoFastValue);
			    delay(delayTime);
			    moto_rest();
			    
			} else {
    
			    moto_rest();
			}

		
		    MQTTClient_freeMessage(&message);
		    MQTTClient_free(topicName);
		    return 1;
		}
		
	SUB_classMqttClient(clientid,topic[0],msgarrvd);
	
}

void *motoFastSubClient(void *threadid) {
	long tid;
	tid = (long)threadid;
	printf("Hello World! It's me, thread #%ld!\n", tid);
	 float str;
	 
	    

	char clientid[] ="motoCtl";
	
	int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message) {
	    
		   
		    
		    printf("     topic: %s\n", topicName);
		    printf("   message: %s\n",message->payload);
		    
		    str = ((float)atoi(message->payload)) / 100;
		    
		    motoFastValue = str*1024;
		    printf("test %d",motoFastValue);
		    
	    
	}
	
	SUB_classMqttClient(clientid,topic[1],msgarrvd);
	
}



void *waterPumpSubClient(void *threadid) {
    long tid;
    tid = (long)threadid;
    printf("Hello World! It's me, thread #%ld!\n", tid);
    float str;
    
    
    char clientid[] ="waterpCtl";
    
     int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message)
		{
		  
		
		    printf("     topic: %s\n", topicName);
		    printf("   message: %s\n",message->payload);
		
		    
		    if(strcmp((char*)message->payload, "openwater") == 0){
			    
			   open_waterp();
			   waterPumpFlags = 1;
			   delay(4000);
			   close_waterp();
			   waterPumpFlags = 0;
			   
			    
		    }

		
		    MQTTClient_freeMessage(&message);
		    MQTTClient_free(topicName);
		    return 1;
		}
		
	SUB_classMqttClient(clientid,topic[3],msgarrvd);

    
}

void *gearSubClient(void *threadid) {
    
     long tid;
   
    tid = (long)threadid;
    
    char clientid[] ="gearaimctl";
    
    gearInit();
     gearInitY();
    
    int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message) {
	
	 printf("     topic: %s\n", topicName);
	 printf("   message--------->: %s\n",message->payload);
	 
	 
	if(strcmp((char*)message->payload, "geargoleft") == 0)
	{
	    gearCtrl('l');
	    
	}else if(strcmp((char*)message->payload, "geargoright") == 0) {
	     gearCtrl('r');
	} 
	else if (strcmp((char*)message->payload, "geargoup") == 0) {
	    gearCtrlY('u');

	}else if (strcmp((char*)message->payload, "geargodown") == 0) {
	    gearCtrlY('d');
	    
	}
		    MQTTClient_freeMessage(&message);
		    MQTTClient_free(topicName);
		    return 1;
	}
		
	SUB_classMqttClient(clientid,topic[7],msgarrvd);
}

int *tempValueSubClient(void* threadid) {
    long tid;
   
    tid = (long)threadid;
    
    char clientid[] ="tempvalueview";
    
    int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message)
		{
		  
		
		    printf("     topic: %s\n", topicName);
		    printf("   message--------->: %s\n",message->payload);
		    
		    int tempvaluestr = ((int)atoi(message->payload)) ;
		    
		    if ( senoTempMax <= tempvaluestr ){
			
			senoTempMax= tempvaluestr;
			
		    }else {
			
			senoTempMin = tempvaluestr;
		    }
		    
		    //printf("Max ====> %d, Min === > %d\n",senoTempMax,senoTempMin);
		    
		   
			       
		   
		    MQTTClient_freeMessage(&message);		
		    MQTTClient_free(topicName);
		    return 1;
		    }
		
	SUB_classMqttClient(clientid,topic[5],msgarrvd);
	
			       
	
    }
    
    
    int *rhValueSubClient(void* threadid) {
    long tid;
   
   
    tid = (long)threadid;
    
    char clientid[] ="rhvalueview";
    
    int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message)
		{
		  
		
		    printf("     topic: %s\n", topicName);
		    printf("   message--------->: %s\n",message->payload);
		    
		    int rhvaluestr = ((int)atoi(message->payload)) ;
		    
		    if ( senoRhMax <= rhvaluestr ){
			
			senoRhMax= rhvaluestr;
			
		    }else {
			
			senoRhMin = rhvaluestr;
		    }
		    
		   
			       
		   
		    MQTTClient_freeMessage(&message);		
		    MQTTClient_free(topicName);
		    return 1;
		    }
		
	SUB_classMqttClient(clientid,topic[6],msgarrvd);
	
			       
	
    }
    
    
    
void *waterPumpFlagsPubClient(void* threadid)  {
     long tid;
    tid = (long)threadid;
    
    char clientid[] ="pumpFlagPub";
    char waterpArr[1];
    char* newArr = NULL;
  
    
    while (1) {
	char pubStatus = waterPumpFlags + '0';
	memset(waterpArr,pubStatus,1);
	newArr = strncat(waterpArr,"\0",1);
	printf("pubstatus----->%s\n",newArr);
	PUB_classMqttClient(clientid,topic[8],newArr);
	
	sleep(1);
    }


    
}

void *senoDhtPubClient(void* threadid) {
    long tid;
    tid = (long)threadid;
    
    char clientid[] ="senoDhtCtl";
    
    extern pinNumber;
    
    
    
  
    if (-1 == wiringPiSetup()) {
        printf("Setup wiringPi failed!");
        return 1;
    }
    pinMode(pinNumber, OUTPUT); // set mode to output
    digitalWrite(pinNumber, 1); // output a high level 
 
   
    
    while(1) {
	pinMode(pinNumber, OUTPUT); // set mode to output
        digitalWrite(pinNumber, 1); // output a high level 
	delay(8000);
	if (readSensorData())
        {
            printf("Sensor data read ok!\n");
            //printf("RH:%d.%d\n", (databuf >> 24) & 0xff, (databuf >> 16) & 0xff); 
            //printf("TMP:%d.%d\n", (databuf >> 8) & 0xff, databuf & 0xff);
	    
	    char buff[MAX_SAVE_DATA];
	
	    sprintf(buff,"RH:%d.%d,TMP:%d.%d",(databuf >> 24) & 0xff, (databuf >> 16) & 0xff,(databuf >> 8) & 0xff, databuf & 0xff);
	    printf("buff----->%s\n",buff);
	    PUB_classMqttClient(clientid,topic[2],buff);
	    memset(buff,0,sizeof(buff));	
		
           
        }	
        else
        {
            printf("Sensor dosent ans!\n");
            
        }	
	
    }
    
    
}

// tu rang shi du jian che

void *yl69SenoPubClient(void* threadid) {
    long tid;
    char* ylstate = NULL;
    tid = (long)threadid;
    
    char clientid[] ="senoYl69Ctl";
    
    while(1){
	if(ylcheck()){
	ylstate = "1";
	open_waterp();
	    
	}else {
	    ylstate = "0";
	    close_waterp();
	    
	   
	}
	printf("waterstate---->%c\n",*ylstate);
	PUB_classMqttClient(clientid,topic[4],ylstate);
	delay(3000);
    }
    
    
    
    
}


//��װmqtt�Ļ�������

//1.����һ���ͻ��˶���
//??2.��������MQTT��������ѡ�
//??3.������̣߳��첽ģʽ��������ʹ�������ûص���������� Asynchronous >vs synchronous client applications����
//??4.���Ŀͻ�����Ҫ���յ����⻰�⣻
//??5.�ظ����²���ֱ��������
//????a.�����ͻ�����Ҫ��������Ϣ��
//????b.�������н��յ�����Ϣ��
//??6.�Ͽ��ͻ������ӣ�
//??7.�ͷſͻ���ʹ�õ������ڴ档


void SUB_classMqttClient(char *clientid,char *topic,int msgarrvd) {



    MQTTClient client;
    MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;
    int rc;
    int ch;

    MQTTClient_create(&client, ADDRESS, clientid,
        MQTTCLIENT_PERSISTENCE_NONE, NULL);
    conn_opts.keepAliveInterval = 20;
    conn_opts.cleansession = 1;
    conn_opts.username = USERNAME;
    conn_opts.password = PASSWORD;

    MQTTClient_setCallbacks(client, NULL, connlost, msgarrvd, delivered);

    if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
    {
        printf("Failed to connect, return code %d\n", rc);
        exit(EXIT_FAILURE);
    }
    printf("Subscribing to topic %s\nfor client %s using QoS%d\n\n"
           "Press Q<Enter> to quit\n\n", topic, clientid, QOS);
    MQTTClient_subscribe(client, topic, QOS);

    do 
    {
        ch = getchar();
    } while(ch!='Q' && ch != 'q');

    MQTTClient_unsubscribe(client, topic);
    MQTTClient_disconnect(client, 10000);
    MQTTClient_destroy(&client);

   pthread_exit(NULL);
}


    
void PUB_classMqttClient(char *clientid,char *topic,char *payload) {
	/*
		clientid: ָ���ͻ���id 
		payload: ָ����Ϣ���� 
		topic: ָ���������� 
	*/
	
	
	MQTTClient client; //�����ͻ��˱���	 
	MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;  //��ʼ���ͻ�������ѡ��
		
		//  ��ʼ��������Ϣ 
	MQTTClient_message pubmsg = MQTTClient_message_initializer;
			//�������� 
	MQTTClient_deliveryToken token;
	
	 int rc;
    //ʹ�ò�������һ��client�������丳ֵ��֮ǰ������client
    MQTTClient_create(&client, ADDRESS, client,
        MQTTCLIENT_PERSISTENCE_NONE, NULL);
    conn_opts.keepAliveInterval = 20;
    conn_opts.cleansession = 1;
    conn_opts.username = USERNAME;
    conn_opts.password = PASSWORD;
	
	if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
    {
      
        exit(EXIT_FAILURE);
    }
	
    pubmsg.payload = payload; //����Ϣ���ݸ�ֵ 
    pubmsg.payloadlen = strlen(payload); //���ݳ��� 
    pubmsg.qos = QOS;
    pubmsg.retained = 0;
   
	//while(CONNECT){
	    
	    MQTTClient_publishMessage(client, topic, &pubmsg, &token);
	    
	    printf("Waiting for up to %d seconds for publication of %s\n"
	            "on topic %s for client with ClientID: %s\n",
	            (int)(TIMEOUT/1000), payload, topic, clientid);
	            
	    rc = MQTTClient_waitForCompletion(client, token, TIMEOUT); //���� 
	    //printf("Message with delivery token %d delivered\n", token);
	    //usleep(3000000L);
	    //}
    MQTTClient_disconnect(client, 1000);
    MQTTClient_destroy(&client);
}


void *checkAuto(void* threadid) {
     float tempValueReal = 0,rhValueReal = 0;	
     
    // dianji 
    while (1){
	
	if (readSensorData())
	{
	    tempValueReal = (((databuf >> 8) & 0xff) + ((databuf & 0xff) * 0.1));
	    
	    rhValueReal = (((databuf >> 24) & 0xff) + (((databuf >> 16) & 0xff)*0.1));
	    //printf("RH:%d.%d\n", (databuf >> 24) & 0xff, (databuf >> 16) & 0xff); 
	    //printf("TMP:%d.%d\n", (databuf >> 8) & 0xff, databuf & 0xff);
	}
	
	
	 if (tempValueReal >= senoTempMax  || rhValueReal <= senoRhMin) {
	    
	    moto_backward(800);
	    delay(delayTime);
	    moto_rest();

	}else if(tempValueReal <= senoTempMin || rhValueReal >= senoRhMax) {
	    moto_forward(800);
	    delay(delayTime);
	    moto_rest();
	}
	printf("tempmax====>%d,min======>%d\n",senoTempMax,senoTempMin);	
	printf("rhmax====>%d,min======>%d\n",senoRhMax,senoRhMin);    
    
	delay(10000);
	
    }
    
   
   
	 
    
}

int main(int argc, char* argv[])
{
    
    pthread_t threads[NUM_THREADS];
    long t;
   
    pthread_create(&threads[0], NULL, motoSubClient, (void *)0);
    pthread_create(&threads[1], NULL, motoFastSubClient, (void *)1);
    pthread_create(&threads[2], NULL, senoDhtPubClient, (void *)2);
    pthread_create(&threads[3], NULL, waterPumpSubClient, (void *)3);
    pthread_create(&threads[4], NULL,  yl69SenoPubClient, (void *)4);
    pthread_create(&threads[5], NULL, tempValueSubClient, (void *)5);
    pthread_create(&threads[6], NULL, rhValueSubClient, (void *)6);
    pthread_create(&threads[7], NULL, checkAuto, (void *)7);
    pthread_create(&threads[8], NULL, gearSubClient, (void *)8);
    pthread_create(&threads[9], NULL,  waterPumpFlagsPubClient, (void *)9);
   
   
  
    pthread_exit(NULL);
    
    
}

