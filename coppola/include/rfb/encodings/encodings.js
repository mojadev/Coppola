/**
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
define([
    "lib/signals",
    "include/rfb/encodings/raw",
    "include/rfb/encodings/copyrect",
    "include/rfb/encodings/hextile",
    "include/rfb/encodings/zlib"],function(signal,raw,copyrect,hextile,zlib) {
    


    return function(network,pixelFormat,graphic) {
        
        /**
         * References the graphic engine used for drawing
         *
         **/
        this.graphic = graphic;
        
        /**
         * Here encodings can store their state if needed. For example, hextile
         * uses this object to store it's last position if it has to wait for further
         * packages in order to complete drawing
         **/
        this.state = {};
        this.pixelFormat = pixelFormat;
        
        /**
         * Supported encodings, in the order they will be sent to the server
         * According to the RFB protocol a server SHOULD priorize encodings accroding
         * to the order they come from the client, so this matters.
         **/
        this.supported = [
            1, // RAW            
            0, // CopyRect Encoding
        //    5, // Hextile
            
       
        //  2, // RRE [NOT Implemented] as this is encoding has no advantage over hextile
        //  4, // CoRRE [NOT Implemented] Hextile is similar, but better, so it's not implemented
        //  6, // zlib [NOT Implemented] as tight or ZRLE are better alternatives and supported by most servers
        //  7, // tight 
        //  8, // zlibhex
        // 16, // ZRLE
        //-23, // JPEG-High Quality
        //-32, // JPEG-Low Quality
        //-223,// DesktopSize Pseudo-Encoding
        //-224,// LastRec Pseudo-Encoding
        //-239,// Cursor Pseudo-Encdoing
        //-240,// X Cursor Pseudo-Encdoing
        //    -312,// Fence Pseudo-Encoding
        //    -313 // Continous update-Pseudo Encdoing*/
        ];
        this.decoders = {
            0: raw,
            1: copyrect,
            5: hextile,
            16: zlib
        };
        
        this.decodeMessage = function(fbUpdate) {
            
            return this.decoders[fbUpdate.encoding](fbUpdate,network,this);

        };
        
        
        
    };
    
});