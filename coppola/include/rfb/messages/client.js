/**
 * Client message implementations and message flags. Use or extend this 
 * class to send data to a vnc server
 * 
 * @author Jannis Moßhammer <mojadev@gmail.com>
 * 
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
define([],function() {
    return function(network,encodings) {
        this.flags = {
            continuousUpdates: false
        }
            
        // Message skeletons for frequently used messages, as ArrayBuffer creation 
        // is quite expensive compared to write/read operations
        var framebufferUpdateRequestMsg = new ArrayBuffer(10),
            framebufferUpdateRequest8 = new Uint8Array(framebufferUpdateRequestMsg),
            framebufferUpdateRequest16 = new Uint16Array(framebufferUpdateRequestMsg);
        framebufferUpdateRequest8[0] = 3;

        var keyEventMsg = new ArrayBuffer(8),
            keyEventMsg8 = new Uint8Array(keyEventMsg),
            keyEventMsg32= new Uint32Array(keyEventMsg);
        keyEventMsg8[0] = 4;
        
        var pointerEventMsg = new ArrayBuffer(6),
            pointerEventMsg8 = new Uint8Array(pointerEventMsg),
            pointerEventMsg16= new Uint16Array(pointerEventMsg);
        pointerEventMsg8[0] = 5;
        
        
        
        this.setPixelFormat = function(pixelFormat) {
            var msg = new ArrayBuffer(20),
                msg8 = new Uint8Array(msg),
                msg16 = new Uint16Array(msg);
            msg8[0]  = 0;
            msg8[4]  = pixelFormat.format.bpp;
            msg8[5]  = pixelFormat.format.depth;
            msg8[6]  = pixelFormat.format.isBigEndian ? 1 : 0;
            msg8[7]  = pixelFormat.format.isTrueColor ? 1 : 0;
            msg16[3] = leToBe(pixelFormat.format.redMax,2);
            msg16[4] = leToBe(pixelFormat.format.greenMax,2);
            msg16[5] = leToBe(pixelFormat.format.blueMax,2);
            msg8[14] = pixelFormat.format.redShift; 
            msg8[15] = pixelFormat.format.greenShift;
            msg8[16] = pixelFormat.format.blueShift;
            network.send(msg8);
        };

        /**
         * Converts a len-byte value from little to big endian
         */
        var leToBe = function(multibyte,len) {
            var res = 0;
            for(var i=0;i<len;i++) {
                res |= ((multibyte >> (((len-1)*8)-(i*8))) & 0xff) << (8*i);
            }
            return res;
        }
        
        this.setEncodings = function() {
            var nrOfEncodings = encodings.supported.length,
                msg = new ArrayBuffer(4+(nrOfEncodings*4)),
                msg8 = new Uint8Array(msg),
                msg16 = new Uint16Array(msg),
                msgS32 = new Int32Array(msg);

            msg8[0] = 2;
            msg16[1] = leToBe(nrOfEncodings,2);
            for(var i=0;i<nrOfEncodings;i++) {
                msgS32[i+1] = leToBe(encodings.supported[i],4);
            }
            console.log("Updating encodings",msg8);
            network.send(msg8);
        };
        
        this.framebufferUpdateRequest = function(rect,incremental) {
            framebufferUpdateRequest8[1] = incremental ? 1 : 0;
            framebufferUpdateRequest16[1] = leToBe(rect.x,2);
            framebufferUpdateRequest16[2] = leToBe(rect.y,2);
            framebufferUpdateRequest16[3] = leToBe(rect.width,2);
            framebufferUpdateRequest16[4] = leToBe(rect.height,2);
            network.send(framebufferUpdateRequest8);
        };
        
        this.keyEvent = function(key,down) {
            keyEventMsg8[1] = down == true;
            keyEventMsg32[1] = leToBe(key,4);
            network.send(keyEventMsg8);
        };
        
        this.pointerEvent = function(btn,x,y) {
            pointerEventMsg8[1] = 1<<(btn-1);
            pointerEventMsg16[1] = leToBe(x,2);
            pointerEventMsg16[2] = leToBe(y,2);
            network.send(pointerEventMsg8);
        };
        
        this.clientCutText = function(text) {
            var msg = new ArrayBuffer(8+(text.length)),
                msg8 = new Uint8Array(msg),
                msg32 = new Uint32Array(msg);
            msg8[0] = 6;
            msg32[1] = leToBe(text.length);
            for(var i=0;i<text.length;i++) {
                msg8[8+i] = text.charCodeAt(i);
            }
            network.send(msg8);
        };
        
        this.enableContinuousUpdates = function(rect, enable) {
            var msg = new ArrayBuffer(10),
                msg8 = new Uint8Array(msg),
                msg16 = new Uint16Array(msg);
            msg8[0] = 150;
            msg8[1] = enable == true;
            msg16[1] = leToBe(rect.x,2);
            msg16[2] = leToBe(rect.y,2);
            msg16[3] = leToBe(rect.width,2);
            msg16[4] = leToBe(rect.height,2);
            console.log((enable ? "Enabling" : "Disabling")+ " continuous updates (might be ignored by your server)");
            network.send(msg8);
        };
        
        this.clientFence = function(blockBefore,blockAfter,syncNext,payload) {
            if(payload.length > 64) {
                console.error("Ignoring clientfence: Payload > 64")
                return;
            }
            var msg = new ArrayBuffer(9+payload.length),
                msg8 = new Uint8Array(msg),
                msg32 = new Uint32Array(msg);

            msg8[0]      = 248;
            msg32[1] = leToBe(
                (blockBefore ? 1 : 0) |
                (blockAfter ? 1 : 0) << 1 |
                (syncNext ? 1 : 0) << 2);
            msg8[9] = payload.length;
            for(var i=0;i<payload.length;i++)
                msg8[10+i] = payload.charCodeAt(i);
            network.send(msg8);
        }
    }
});