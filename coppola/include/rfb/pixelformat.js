/**
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
define([],function() {
    /**
     * Determine pixelformat from ServerInit Message:
     * "6.3.2 ServerInit
     * After receiving the ClientInit message, the server sends a ServerInit message. This
     * tells the client the width and height of the server’s framebuffer, its pixel format and the
     * name associated with the desktop"  
     */
    return function(network) {
        this.isValid = true;
        this.isSetup = false;
        
        this.format = {
            width: 0,
            height: 0,
            name: "",
            bpp: 32,
            depth: 24,
            isBigEndian: false,
            isTrueColor: false,
            redMax: 0,
            greenMax: 0,
            blueMax: 0,
            redMult: 0,
            greenMult: 0,
            blueMult: 0,
            redShift: 0,
            greenShift: 0,
            blueShift: 0,
            padding: 0,
            colorMap: null
        };
        
        
        this.onDataAvailable = function() {
            var strLen = 0;
            // 24 bytes are needed at least to determine the size
            if(network.bytesLeft() < 24) {
                console.log("Not enough bytes for reading left, need at least 24, have "+network.bytesLeft());
                return false;
            } 
            network.seek(20); // got to string length definition
            strLen = network.read32BE(1)[0];
            network.seek(-24);
            if(network.bytesLeft() < 24+strLen) {
                console.log("Not enough bytes for reading left, need at least "+(24+strLen)+", have "+network.bytesLeft());
                return false; 
            } 
            readPixelFormat(strLen);
            validatePixelFormat();
            this.isSetup = true;
            return this.isValid;
        } 
        
        var readPixelFormat = (function(strlen) {
            this.format.width = network.read16BE(1)[0];
            this.format.height = network.read16BE(1)[0];
            this.format.bpp = network.read8(1)[0];
            this.format.depth = network.read8(1)[0];
            this.format.isBigEndian = (network.read8(1)[0] > 0);
            this.format.isTrueColor = (network.read8(1)[0] > 0);
            this.format.redMax = network.read16BE(1)[0];
            this.format.greenMax = network.read16BE(1)[0];
            this.format.blueMax = network.read16BE(1)[0];
            if(this.format.redMax) {
                this.format.redMult = Math.floor(0xff/(this.format.redMax));
                this.format.greenMult = Math.floor(0xff/(this.format.greenMax));
                this.format.blueMult = Math.floor(0xff/(this.format.blueMax));
            }
            this.format.redShift = network.read8(1)[0];
            this.format.greenShift = network.read8(1)[0];
            this.format.blueShift = network.read8(1)[0];
            network.seek(7); // skip padding and string length
            this.format.name = network.readString(strlen);
            console.log("Setup pixel format",this);
        }).bind(this);

        var validatePixelFormat = (function(strlen) {
            /**
             *  Bits-per-pixel is the number of bits used for each pixel value on the wire. This must
             *  be greater than or equal to the depth which is the number of useful bits in the pixel
             *  value. Currently bits-per-pixel must be 8, 16 or 32 — less than 8-bit pixels are not yet
             *  supported
             */
            if(this.format.bpp !== 8 && this.format.bpp !== 16 && this.format.bpp !== 32) {
                console.error("[Pixelformat] Server uses unsupported nr of bytes-per-pixel: "+this.format.bpp);
                this.isValid = false;
                return false;
            }           
        }).bind(this);
    }
})