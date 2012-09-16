/**
 * RingBuffer implementation based on ArrayBuffers, so it should be 
 * rather fast
 * 
 * @params Integer  The size of the ringbuffer, better choose it higher than too low
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
(function() {

    var ringbuffer = function() {
        "use strict";
        
        this.buffer = null;

        /**
        * The following variable contain the different ArrayBufferViews 
        * required for reading. 16 and 32 bit are available in different offset,
        * so every memory position can be accessed
        * 
        * TypedArrays share the same buffer, so this doesn't consume much memory
        */
        this.views = {}

        this.maxPos = 0;
        this.readPtr = 0;
        this.writePtr = 0;    

        var constructor = function(size) {

            this.maxPos = size;
            this.initBuffer();
        }

        this.initBuffer = function() {
            this.buffer = new ArrayBuffer(this.maxPos);
            this.views = {
                1 : new Uint8Array(this.buffer),
                2 : new Uint16Array(this.buffer),
                4 : new Uint32Array(this.buffer)
            }
        }

        var typedArray = function(size) {
            switch(size) {
                case 1: return Uint8Array;
                case 2: return Uint16Array;
                case 4: return Uint32Array;
            }
            throw ("Invalid size "+size+" specified");
        }

        this.memcopy = function(result,bytes,start,input) {
            var view = input || this.views[bytes];
            for(var i=0;i<result.length;i++) {
                var elem = 0;       
                for(var p=i*bytes,x=(bytes-1)*8;x>=0;x-=8,p++) {
                    var pos = (start+p)%view.length;
                    elem = (view[pos] << x) | elem;
                }
                result[i] = elem;            
            }
        }


        this.read = function(bytes,length,dontSeek) {
            var result;
            // if everything is correctly aligned we can directly access the data in the 
            // most efficient way
            if(this.readPtr+length*bytes < this.maxPos && this.readPtr % bytes === 0) {
                result = this.views[bytes].subarray(this.readPtr/bytes,this.readPtr/bytes+length);
            } else { 
                // if the alignment is incorrect or we're reading from the end to the start, it's
                // a copy-per element operation
                result = new (typedArray(bytes))(length);
                this.memcopy(result,bytes,this.readPtr);
            }
            if(!dontSeek) {
                this.readPtr = (this.readPtr+length*bytes)%this.maxPos;
            }
            return result;
        }

        this.writeAtReadPosition = function(data) {
            
            if(typeof data === "string") {
                var s = data;
                data = new Uint8Array(data.length);
                for(var i=0;i<s.length;i++) {
                    data[i] = s.charCodeAt(i);
                }
            }
            var length = data.length
            // writing is fast if we're not crossing boundaries or if data is correctly
            // aligned
            if(this.readPtr+length < this.maxPos) {
                this.views[1].set(data,this.readPtr);
            } else {
                console.debug("Buffer overflow r");
                this.memcopy(this.views[1],1,this.readPtr,data);
            }
            
        }
        
        // write only works with 8 byte data
        this.write = function(data) {
            if(typeof data === "string") {
                var s = data;
                data = new Uint8Array(data.length);
                for(var i=0;i<s.length;i++) {
                    data[i] = s.charCodeAt(i);
                }
            }
            var length = data.length
            // writing is fast if we're not crossing boundaries or if data is correctly
            // aligned
            if(this.writePtr+length < this.maxPos) {
                this.views[1].set(data,this.writePtr);
                this.writePtr = (this.writePtr + data.length) % this.maxPos;
            } else {
                var view = this.views[1];
                for(var i=0;i<length;i++) {
                    view[this.writePtr] = data[i];
                    this.writePtr = (this.writePtr+1)%this.maxPos;
                }
            }
        }


        this.read8 = function(len) {
            //console.log("Reading "+len+" bytes");
            return this.read(1,len);
        }
        this.read16BE = function(len) {
            var result = new Uint16Array(len);
            var hws = this.read8(len*2);
            for(var i=0;i<len;i++) {
                result[i] = hws[i*2]<<8 | hws[i*2+1];
            }
            return result;
        }    
        this.read32BE = function(len) {
            var result = new Uint32Array(len);
            var hws = this.read8(len*4);
            for(var i=0;i<len;i++) {
                result[i] = hws[i*4]<<24 | hws[i*4+1]<<16 | hws[i*4+2]<<8 | hws[i*4+3];
            }
            return result;
        }
        
        this.readS32BE = function(len) {
            //console.log("Reading "+len*4+" bytes /unsigned");
            var result = new Int32Array(len);
            var hws = this.read8(len*4);
            for(var i=0;i<len;i++) {
                result[i] = hws[i*4]<<24 | hws[i*4+1]<<16 | hws[i*4+2]<<8 | hws[i*4+3];
            }
            return result;    
        }

        this.read16 = function(len) {
            var result = new Uint16Array(len);
            var hws = this.read8(len*2);
            for(var i=0;i<len;i++) {
                result[i] = hws[i*2+1]<<8 | hws[i*2];
            }
            return result;
        }    
        this.read32 = function(len) {
            var result = new Uint32Array(len);
            var hws = this.read8(len*4);
            for(var i=0;i<len;i++) {
                result[i] = hws[i*4+3]<<24 | hws[i*4+2]<<16 | hws[i*4+1]<<8 | hws[i*4];
            }
            return result;
        }
        
        this.readS32 = function(len) {
            //console.log("Reading "+len*4+" bytes /unsigned");
            var result = new Int32Array(len);
            var hws = this.read8(len*4);
            for(var i=0;i<len;i++) {
                result[i] = hws[i*4+3]<<24 | hws[i*4+2]<<16 | hws[i*4+1]<<8 | hws[i*4];
            }
            return result;    
        }

        this.readString = function(len) {
            var slice = this.read8(len);
            return String.fromCharCode.apply(this,slice)
        }

        this.seekRead = function(pos) {
            //console.log("Seeking ",+pos,"@"+(this.readPtr+pos)%this.maxPos);
            this.readPtr = (this.readPtr+pos)%this.maxPos;
        }
        this.seekWrite = function(pos,rel) {            
            this.writePtr = (this.writePtr+pos)%this.maxPos;
        }

        this.bytesLeft = function() {
            if(this.writePtr >= this.readPtr)
                return this.writePtr-this.readPtr
            return this.maxPos-this.readPtr+this.writePtr; 

        }

        constructor.apply(this,arguments);
    }
    if(typeof define === "function") {
        define([],function() {return ringbuffer;});
    }
    if(typeof Testables === "object") {
        Testables.ringbuffer = ringbuffer;
    }
})()