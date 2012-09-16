/**
 * Network communication layer using WebSockets (either binary or base64 encoded)
 * 
 * @author Jannis Moßhammer <mojadev@gmail.com>
 **/

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

define(["include/data/ringbuffer","lib/signals"], function(ringbuffer,signal) {
    return function() {
        var bufferSize = 8192200; // can contain a 1600*1280*32 framebuffer
        var buffer = new ringbuffer(bufferSize);
        
        this.useBinary = true;
        this.msgReceived = false;
        
        this.onMessage = new signal.Signal();
        this.onError = new signal.Signal();
        this.onConnect = new signal.Signal();
        this.onClose = new signal.Signal();
        
        this.socket = {}
        this.state = "closed";
        
        var str2ab = function(str) {
            var buf = new ArrayBuffer(str.length);
            var bufView = new Uint8Array(buf);
            for (var i=0, strLen=str.length; i<strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }   
        
        this.connect = function(server,port,secure) {
            var URI = "ws"+(secure ? "s" : "")+"://"+server+":"+port
            this.socket = new WebSocket(URI);
            this.socket.binaryType = 'arraybuffer';
            this.socket.onopen = this.onConnect.dispatch;
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.onClose.dispatch;
            this.socket.onerror = this.handleError.bind(this);
            
            this.onConnect.add(function() {
                this.state = "open";
            },this);
            this.onClose.add(function() {
                this.state = "closed";
            },this);
        }
        
        this.close = function() {
            this.socket.close();
        }

        this.handleMessage = function(/*MessageEvent*/ message) {
            var msgBuffer;        
            if(!this.msgReceived || !this.useBinary) {
                
                msgBuffer = new Uint8Array(str2ab(atob(message.data)));
            } else {
                msgBuffer = new Uint8Array(message.data);
            }
            buffer.write(msgBuffer);
            this.onMessage.dispatch(message.byteLength);
            this.msgReceived = true;
        }
        
        this.read8 = function(nr) {
            return buffer.read8(nr);
        }
        this.read16 = function(nr) {
            return buffer.read16(nr);
        }
        this.read32 = function(nr) {
            return buffer.read32(nr);
        }        
        this.readS32 = function(nr) {
            return buffer.readS32(nr);
        }  
        this.read16BE = function(nr) {
            return buffer.read16BE(nr);
        }
        this.read32BE = function(nr) {
            return buffer.read32BE(nr);
        }        
        this.readS32BE = function(nr) {
            return buffer.readS32BE(nr);
        }   
        this.overwrite = function(byteArray) {
            buffer.writeAtReadPosition(byteArray);
        }
        this.getRawBuffer = function() {
            return buffer;
        }
        
        this.readString = function(len) {
            return String.fromCharCode.apply(null,this.read8(len));
        }

        this.send = function(msg) {
            if(!this.useBinary) { // non binary data is base64 encoded
                if(typeof msg === "string") {
                    this.socket.send(btoa(msg));
                } else { // convert to base64 decoded data 
                    this.socket.send(btoa(String.fromCharCode.apply(null,msg)));
                }
            } else { // binary data makes it easier, just send the buffer
                if(typeof msg === "string") {
                    this.socket.send(str2ab(msg));
                } else {
                    this.socket.send(msg.buffer);    
                }                 
            }            
        }
        
        this.handleError = function(e) {
            this.onEror.dispatch(e);
        }
        
        this.canRead = function() {
            return buffer.bytesLeft() != 0;
        }
        this.bytesLeft = function() {
            return buffer.bytesLeft();
        }
        
        this.seek = function(nr) {
            buffer.seekRead(nr);
        }
        
        this.getDump = function(offsetLeft) {
            this.seek(-offsetLeft);
            var dataSet = buffer.read8(offsetLeft+30);
            this.seek(-30);
            var dump = "";
            for(var i=0;i<offsetLeft+30;i++) {
                dump += dataSet[i].toString(16)+" ";
                if(i==offsetLeft)
                    dump+="|";
            }
            return dump;
        };
        
        this.readPtrSnapshot = null;
        this.snapshot = function() {
            this.readPtrSnapshot = buffer.readPtr;
        }
        this.toSnapshot = function() {
            buffer.readPtr = this.readPtrSnapshot;
        }
        
    }
});

