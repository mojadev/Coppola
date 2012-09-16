/**
 * Hextile, still buggy
 * @TODO: It should stop being buggy.
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
define([],function() {
    var TILESIZE = 16;
    var FLAGS = {
        RAW:                    1,
        BG_COLOR:               2,
        FG_COLOR:               4,
        ANY_SUBRECT:            8,
        SUBRECT_COLORED:        16
    };
    
    
    var readPixel = function(network,pxFormat) {
        var px;

        if(pxFormat.bpp == 32) {
            px = network.read32(1)[0];
        } else if(pxFormat.bpp == 16) {
            px = network.read16(1)[0];
        } else if(pxFormat.bpp == 8) {
            px = network.read8(1)[0];
        }
        var out = [0,0,0,0xff];
        out[0] = ((px >> pxFormat.blueShift) & (pxFormat.blueMax) )*pxFormat.blueMult;
        out[1] = ((px >> pxFormat.greenShift) & (pxFormat.greenMax) )*pxFormat.greenMult;                 
        out[2] = ((px >> pxFormat.redShift) & (pxFormat.redMax) )*pxFormat.redMult;
        out[3] = 0x00;
        
        return out;
    }
    
    
    /**
     * Expects an 16x16 hextile formatted tile being starting at the current network
     * read position and draws it.
     * 
     * This is implemented with an optimistic behaviour. The tile will be abandoned if
     * there's not enough data in the network buffer, no matter how far it has been written yet.
     * As this only happens with one tile or no tile, this is more efficient. Determing
     * how much data is needed for a tile is almost as cumbersome as drawing 
     * the actual tile. Here we only have to make sure we revert all read changes in case
     * an error occures, which only involves updating a counter and resetting the read
     * pointer. 
     */
    var processTile = function(fbUpdate,network,encoding,state) {
        var x_0 = (state.currentTile%state.tilesX)*16;
        var y_0 = (16*~~(state.currentTile/state.tilesX));
        var w = (x_0+16 > fbUpdate.width) ? (fbUpdate.width % 16) : 16,
            h = (y_0+16 > fbUpdate.height) ? (fbUpdate.height % 16) : 16,
            x = x_0 + fbUpdate.x,
            y = y_0 + fbUpdate.y;

        // read type flags
        if(network.bytesLeft() < 1)
            return false;
        var tileFlags = network.read8(1)[0];
        
        if(tileFlags & FLAGS.RAW) {
            return decodeRaw(state,network,encoding,{
                x:      x,
                y:      y,
                width:  w,
                height: h
            });
        }
        
        if(tileFlags & FLAGS.BG_COLOR) {
            if(network.bytesLeft() < state.bpp) {
                return false;
            }
            state.bgColor = readPixel(network,encoding.pixelFormat.format);
        }
        
        if(tileFlags & FLAGS.FG_COLOR) {
            if(network.bytesLeft() < state.bpp) {
                return false;
            }
            state.fgColor = readPixel(network,encoding.pixelFormat.format);
        }
        
        encoding.graphic.drawFillRect({
            x:      x,
            y:      y,
            width:  w,
            height: h,
            pixelData: state.bgColor
        });
        
        if(tileFlags & FLAGS.ANY_SUBRECT) {
            var nrOfSubrects = network.read8(1)[0];
            var subRectsColored = (tileFlags & FLAGS.SUBRECT_COLORED) !== 0;
            if(network.bytesLeft() < nrOfSubrects*(2+subRectsColored*state.bpp)) {
                return false
            }
            var color = state.fgColor;
            for(var i=0;i<nrOfSubrects;i++) {
                if(subRectsColored) 
                    color = readPixel(network,encoding.pixelFormat.format);
                var xy = network.read8(1)[0];
                var wh = network.read8(1)[0];
                encoding.graphic.drawFillRect({
                    x: x+(xy >> 4),
                    y: y+(xy & 0xf),
                    width: (wh >> 4)+1,
                    height: (wh & 0xf)+1,
                    pixelData: color
                });
            }       
        }
        return true;
    }
   
    
    var decodeRaw = function(state,network,encoding,update) {
        // pass this update to the raw decoder
        if(!encoding.decoders[0](update,network,encoding)) {
            return false;
        } else {
            return true;
        }
    }
    
    var readState = function(fbUpdate,network,encoding) {
        if(encoding.state.hextile) {
            return encoding.state.hextile;
        } else {
            network.seek(-16);
            var signature = network.read8(16); 

            return {
                bgColor: [0,0,0,0xff],
                fgColor: [0,0,0,0xff],
                bpp: encoding.pixelFormat.format.bpp/8,
                tilesX: Math.ceil(fbUpdate.width/TILESIZE),
                tilesY: Math.ceil(fbUpdate.height/TILESIZE),
                nrOfTiles : Math.ceil(fbUpdate.width/TILESIZE)*Math.ceil(fbUpdate.height/TILESIZE),
                currentTile: 0,
                pixelData: new Uint8Array(fbUpdate.width*fbUpdate.height*4),
                lastPos: -1,
                fbSignature: signature
            };
        }
    }
 
    return function(fbUpdate,network,encoding) {        
        var state = readState(fbUpdate,network,encoding);
        if(state.lastPos != -1)
            network.getRawBuffer().readPtr = state.lastPos;
        
        while(state.nrOfTiles > state.currentTile) {
            state.lastPos = network.getRawBuffer().readPtr;
            if(!processTile(fbUpdate,network,encoding,state)) {
                encoding.state.hextile = state;
                network.getRawBuffer().readPtr = state.lastPos-16;
                network.overwrite(state.fbSignature);
                network.seek(16);
                encoding.graphic.commitBatchUpdate();
                
                return false;
            }
            state.currentTile++;
        }
        encoding.state.hextile = null;
        return true;;
    }

});