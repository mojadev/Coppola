/** 
 * Raw encoding
 * Simplest, uncompressed bitmap image update. Must be implemented by every
 * client, so it's also implemented here, though hextile (for high-bandwith
 * conections) or tight (for low-bandwith connections) are most of the 
 * time the better choice
 * 
 * @author Jannis Moßhammer <mojadev@gmail.com>
 * 
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
define([],function() {
   
    
    var cmap32Bit = function(bytesToRead,fbUpdate,network,pxFormat) {
        var img = new Uint8Array(fbUpdate.width*fbUpdate.height<<2);
        var px = network.read32(bytesToRead>>1);
        for(var i=0,ctr=0;i<px.length;i++) {
            var color = pxFormat.colorMap[px[i]];
            img[ctr++] = color>>8&0xff;
            img[ctr++] = color>>16&0xff;
            img[ctr++] = color>>24&0xff;
            img[ctr++] = 0xff;
        }
        return img;

    }

    var raw16Bit = function(bytesToRead,fbUpdate,network,pxFormat) {
        var img = new Uint8Array(fbUpdate.width*fbUpdate.height<<2);
        var px = network.read16(bytesToRead>>1);
        if(pxFormat.isTrueColor) {
            for(var i=0,ctr=0;i<px.length;i++) {
                img[ctr++] = ((px[i] >> pxFormat.blueShift) & (pxFormat.blueMax) )*pxFormat.blueMult;
                img[ctr++] = ((px[i] >> pxFormat.greenShift) & (pxFormat.greenMax) )*pxFormat.greenMult;                 
                img[ctr++] = ((px[i] >> pxFormat.redShift) & (pxFormat.redMax) )*pxFormat.redMult;
                img[ctr++] = 0x00;
            }
        } else {
            for(var i=0,ctr=0;i<px.length;i++) {
                var color = pxFormat.colorMap[px[i]];
                img[ctr++] = color>>8&0xff;
                img[ctr++] = color>>16&0xff;
                img[ctr++] = color>>24&0xff;
                img[ctr++] = 0xff;
            }
        }
        return img;
    }

    var raw8Bit = function(bytesToRead,fbUpdate,network,pxFormat) {
        var img = new Uint8Array(fbUpdate.width*fbUpdate.height>>2);
        var px = network.read8(bytesToRead);
        if(pxFormat.isTrueColor) {
            for(var i=0,ctr=0;i<px.length;i++) {
                img[ctr++] = ((px[i] >> pxFormat.blueShift) & (pxFormat.blueMax) )*pxFormat.blueMult;
                img[ctr++] = ((px[i] >> pxFormat.greenShift) & (pxFormat.greenMax) )*pxFormat.greenMult;                 
                img[ctr++] = ((px[i] >> pxFormat.redShift) & (pxFormat.redMax) )*pxFormat.redMult;
                img[ctr++] = 0x00;
            }
        } else {
            for(var i=0,ctr=0;i<px.length;i++) {
                var color = pxFormat.colorMap[px[i]];
                img[ctr++] = color>>8&0xff;
                img[ctr++] = color>>16&0xff;
                img[ctr++] = color>>24&0xff;
                img[ctr++] = 0xff;
            }
        }
        return img;
    }

    return function(fbUpdate,network,encoding) {

        var bytesToRead = 
            (fbUpdate.height)*
            (fbUpdate.width)*
            (encoding.pixelFormat.format.bpp>>3),
            img;
        var pxFormat = encoding.pixelFormat.format;
        if(network.bytesLeft() < bytesToRead) {
            return false;
        }
        if(pxFormat.bpp == 32 
            && pxFormat.isTrueColor) {
            img = network.read8(bytesToRead,pxFormat);
        } else if (pxFormat.bpp == 16) {
            img = raw16Bit(bytesToRead,fbUpdate,network,pxFormat);
        } else if (pxFormat.bpp == 8) {
            img = raw8Bit(bytesToRead,fbUpdate,network,pxFormat);
        } else if (pxFormat.bpp == 32 
            && !pxFormat.isTrueColor) {
            img = cmap32Bit(bytesToRead,fbUpdate,network,pxFormat);
        }


        encoding.graphic.drawPixelUpdate({
            pixelData: img,
            x: fbUpdate.x,
            y: fbUpdate.y,
            width: fbUpdate.width,
            height: fbUpdate.height
        });
        
        return true
    }
})

