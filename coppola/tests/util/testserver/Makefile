GCC=/usr/bin/gcc
CFLAGS  = -Wall -g -D_REENTRANT -O3 -Iinclude
LDFLAGS = -Iinclude
OUT = vnctestserver
SRC = vnctestserver.c
OBJ = vnctestserver.o
DEPENDFILE = .depend

all: 
	make dep
	make prog

prog: $(OBJ)
	$(CC) $(CFLAGS) -o $(OUT) $(OBJ) $(LDFLAGS)
clean: 
	rm *.o 
	rm .depend

dep: 
	$(CC) -MM $(SRC) > $(DEPENDFILE)

-include $(DEPENDFILE)
	
%.o: %.c
	$(CC) $(CFLAGS) -c $(SRC)