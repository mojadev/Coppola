struct vnc_if_options {
    char* host;
};

struct http_if_options {
    char* host;
    int port;
};

struct if_options {
    struct vnc_if_options vnc;
    struct http_if_options http;
} if_config;
