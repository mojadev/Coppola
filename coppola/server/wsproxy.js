/* 
 * WS Proxy bridging from websockets to VNC
 * 
 * @author Jannis Moßhammer <mojadev@gmail.com>
 */
/* [LICENCE START] */
/**
 * Copyright 2012 Jannis Mosshammer <mojadev@gmail.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 **/
/* [LICENCE END] */


var myport = process.argv[4] || 4430;
var WebSocketServer = require('websocket').server,
    net = require('net'),
    util = require('util'),
    http = require('http');

var vnchost = process.argv[2] || 'localhost';
var vncport = process.argv[3] || 5901;

var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});
server.listen(myport, function() {
    util.debug("Listening on port "+myport);
});

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    var connection = request.accept();
    var vnc = net.connect(vncport,vnchost).on("error",function(e) {
        util.error(e);
    });
    var useBinary = false;
    vnc.on("data", function(buffer) {
//        console.log("Server message ",buffer);
        if(useBinary == false) {
            connection.sendUTF(buffer.toString('base64'));
        } else {
            connection.sendBytes(buffer);
        }
    }).on("error",function(e) {
        util.error(e);
    }).on("close",function() {
        util.debug("VNC disconnected, closing websocket");
        connection.close();
    });
    connection.on('message',function(message) {
        console.log("in",message);
   //     console.log("Client message ",message);
        if(message.type === 'utf8') {
            useBinary = false; 
            vnc.write(new Buffer(message.utf8Data).toString('base64'));
        } else {
            useBinary = true;
            vnc.write(message.binaryData);            
        }
        
    }).on("error",function(e) {
        util.error(e);
    }).on("close",function() {
        util.debug("Websocket disconnected, closing VNC connection");
        vnc.end();
    })
});
