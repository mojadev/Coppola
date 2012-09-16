/* 
 * Simple vnc server that can be controlled via a seperate
 * http interface
 */

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>

#include "./include/config.h"

extern struct if_options if_config;

int parseOpts(int argc,char **argv);
void open_http_server();

void printUsage() {
    fprintf(stdout,"\nUsage: -P HTTP_PORT [-H HTTP_HOST -V VNC_HOST] \n");
}


int main(int argc, char **argv) {
    if(parseOpts(argc,argv)) {
        printUsage();
        return 1;
    }
    
    open_http_server();
    
    return 0;
}

void open_http_server() {
    int http_socket = socket(PF_INET,SOCK_STREAM,0);
    if (http_socket == -1) {
	perror("socket() failed");
	abort();
    }
    
    struct sockaddr_in = get_http_adress();
}



int parseOpts(int argc,char **argv) {
    int c;
    if_config.http.host = "127.0.0.1"; 
    if_config.vnc.host = "127.0.0.1";
    int requiredMissing = 1;
    while ((c = getopt (argc, argv, "H:P:V:")) != -1) {
        switch(c) {
            case 'H':
                if_config.http.host = optarg;
                break;
            case 'P':
                requiredMissing--;
                if_config.http.port = atoi(optarg);
                break;
            case 'V':
                if_config.vnc.host = optarg;
                break;
            case '?':
                if (optopt == 'P' || optopt == 'H' || optopt == 'V')
                    fprintf (stderr, "Option -%c requires an argument.\n", optopt);
                if (isprint (optopt))
                    fprintf (stderr, "Unknown option `-%c'.\n", optopt);
                else
                    fprintf (stderr,
                                "Unknown option character `\\x%x'.\n",
                                optopt);
                    return 1;
            default:
                abort();
        }
    }
    
    if(requiredMissing)
        return 1;
    return 0;
}




