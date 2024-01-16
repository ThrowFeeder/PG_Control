TARGET=raspi_iot
RELYON=raspiIot.c m_moto.c m_dht11.c m_waterp.c m_YL69.c m_gear.c m_gear_y.c
LIBS=-lwiringPi -lpthread -lpaho-mqtt3c -lpaho-mqtt3a 

$(TARGET):$(RELYON)
	$(CC) $^ -o $@ $(LIBS)

clean:
	$(RM) $(TARGET)
.PHONY: clean *clean

