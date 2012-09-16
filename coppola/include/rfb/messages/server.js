/**
 * ClieServernt message implementations and message flags. Use or extend this 
 * class to decode and handle data from a vnc server
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
        var messageHandler =  []

    
        this.onMessage = function() {
            var messageType = network.read8(1)[0];
            if(typeof messageHandler[messageType] === "undefined") {
                network.seek(network.bytesLeft());
                return false;
            }
            network.seek(-1); // perhaps there are not enough bytes in the channel
            return messageHandler[messageType]();
        }
        
      
        var handleFramebufferUpdate = function() {
            if(network.bytesLeft()<4)
                return false;
            var nrOfRects = network.read16BE(2)[1];
            
            if(network.bytesLeft()<4) {
                network.seek(-4);
                return false;
            }
            encodings.graphic.beginBatchUpdate();
            for(var i=0;i<nrOfRects;i++) {
                if(network.bytesLeft()<16) { // at least 16 bytes are needed
                    network.seek(-4);
                    if(i > 0) // allow progressive update
                        network.overwrite(new Uint8Array([0,0,(nrOfRects-i)>>8,(nrOfRects-i)&0xff]));            
                    return false;
                }
                
                var fbUpdate = readFramebufferUpdateRect();
                if(typeof encodings.decoders[fbUpdate.encoding] === "undefined") {
                    console.error("Unknown encoding "+fbUpdate.encoding+" given, expect bugs");
                    console.log(network.getDump(128));
                    network.close();
                    network.seek(network.bytesLeft()); //clear buffer
                    return false;
                }
                if(encodings.decodeMessage(fbUpdate) === false) {
                    network.seek(-16);
                    if(i > 0) // allow progressive update
                        network.overwrite(new Uint8Array([0,0,(nrOfRects-i)>>8,(nrOfRects-i)&0xff]));            
                    return false;            
                }
            }
            encodings.graphic.commitBatchUpdate();
            return true;
        }
        
        var readFramebufferUpdateRect = function() {
            var fbUpdate = {
                x:0,
                y:0,
                width:0,
                height:0,
                encoding: -1,
                pixelData: 0
            };
            var rectBuffer = network.read16BE(4);
            fbUpdate.x = rectBuffer[0];
            fbUpdate.y = rectBuffer[1];
            fbUpdate.width = rectBuffer[2];
            fbUpdate.height = rectBuffer[3];
            fbUpdate.encoding = network.readS32BE(1)[0];
            return fbUpdate;
        }
        
        var setColourMapEntries = function() {
            var format = encodings.pixelFormat.format;
            network.seek(2);
            if(network.bytesLeft<4) {                
                network.seek(-2);
                return false;
            }
            var firstColor = network.read16(1)[0];
            var nrOfColors = ((network.read16BE(1)[0]));
            if(network.bytesLeft<nrOfColors*6) {  
                network.seek(-6);
                return false;
            }
            var colorMap = new Uint32Array(nrOfColors);
            console.debug("Using "+nrOfColors+" colors")
            for(var i=0;i<nrOfColors;i++) {
                colorMap[i] =   (network.read16BE(1)[0]&0xff)<<24; 
                colorMap[i] |=  (network.read16BE(1)[0]&0xff)<<16; 
                colorMap[i] |=  (network.read16BE(1)[0]&0xff)<<8; 
                colorMap[i] |=  0xff;
            }
            
            console.debug("setting colormap: "+colorMap,network.bytesLeft())
            format.colorMap = colorMap;
            return true;
        }
        var bell = function() {
            network.seek(1);
            console.debug("Bell ring");
            return true;
            // ignore, nobody likes bells
        }
        var serverCutText = function() {
	    
	    network.seek(4);
	    var length = network.read32BE(1)[0];
	    if(length == 0)
		return true;
	    if(network.bytesLeft() < length) {
		
		network.seek(-7);
		return false;
	    }
	    var text = network.readString(length);
	    return true;
        }
        var endOfContinuousUpdates = function() {
            
            // ignore
        }
        var serverFence = function() {
            console.debug("Fence");
            // ignore
        }
        
        messageHandler[0]   = handleFramebufferUpdate.bind(this);
        messageHandler[1]   = setColourMapEntries.bind(this);
        messageHandler[2]   = bell.bind(this);
        messageHandler[3]   = serverCutText.bind(this);
        messageHandler[150] = endOfContinuousUpdates.bind(this);
        messageHandler[248] = serverFence.bind(this);
        
    }
    
})