/* 
 * Drawer implementation that uses the 2D Canvas (http://www.w3.org/TR/2dcontext/)
 * for framebuffer visualization. 
 *
 * Pixeldata is expected as RGBA 32BPP  data in an 
 * Uint8Array (although simple arrays can be used, too)
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

var canvasDrawer = function(canvas) {
    
    var MAX_BATCH_BUFFER = 128; 
    
    this.ctx = canvas.getContext("2d");
    this.beginBatchUpdate = function() {   
        this.inBatch = true;
    }
    this.getTarget = function() {
	return canvas;
    }
    this.getSubRect = function(x,y,w,h,data,rect) {
        var result = new Uint8Array(w*h*4), count = 0;
        for(var yOff=0;yOff<h;yOff++) {
            var yPos = (yOff+y)*rect.width*4;
            for(var xOff=0;xOff<w;xOff++) {
                var xPos = x*4+yPos+xOff*4;
                result[count++] = data[xPos+2]; 
                result[count++] = data[xPos+1];
                result[count++] = data[xPos];
                result[count++] = 0xff;
            }
        }
        return result;
    }
    
    this.addToBatch = function(update,isCopy,boundaryOnly) {
        if(isCopy) {
            update.copy = true;
        } else {
            update.copy = false;
        }
        
        if(this.batchArea == null) {
            this.batchArea = {
                l:update.x,
                t:update.y,
                r:update.x+update.width,
                b:update.y+update.height
            }
        } else { // recalculate dirty area 
            if(this.batchArea.l > update.x)
                this.batchArea.l = update.x;
            if(this.batchArea.r < update.x+update.width)
                this.batchArea.r = update.x+update.width;
            if(this.batchArea.t > update.y)
                this.batchArea.t = update.y;
            if(this.batchArea.b < update.y+update.height)
                this.batchArea.b = update.y+update.height;
        }
        if(boundaryOnly !== true) {
            this.batchUpdates.push(update);
            if(this.batchUpdates.length > MAX_BATCH_BUFFER) {
                this.commitBatchUpdate();
                this.beginBatchUpdate();
            }
        }

        
    }

    this.getDirtyRegion = function() {
        if(this.inBatch === false 
                || this.batchUpdates.length === 0 
                || this.batchArea===null) {
            return null;
        }
        return  {
            x : this.batchArea.l,
            y : this.batchArea.t,
            width :  this.batchArea.r-this.batchArea.l,
            height : this.batchArea.b-this.batchArea.t
        };
    }

    // contains the dirty area 
    this.batchArea = null;
    this.batchUpdates = [];
    this.locked = false;
    
    this.commitBatchUpdate = function() {
        var dirtyRegion = this.getDirtyRegion();
        var update ;

        if(dirtyRegion === null)
            return;

        var img = this.ctx.getImageData(
            dirtyRegion.x,dirtyRegion.y,
            dirtyRegion.width,dirtyRegion.height
        );

        for(var i=0;i<this.batchUpdates.length;i++) {
            update = this.batchUpdates[i];

            if(update.copy === true) {
                this.copyPartialData(update,img.data,dirtyRegion);
            } else if (update.fill == true)  {
                this.drawPartialFillRect(update,img.data,dirtyRegion)
            } else {
                this.drawPartialData(update,img.data,dirtyRegion);
            }
        }
        this.ctx.putImageData(img,dirtyRegion.x,dirtyRegion.y);
        
        this.batchUpdates = [];
        this.batchArea = null;
        this.inBatch = false;
    }

    this.copyPartialData = function(update,img,rect) {
        var srcX = update.copySrc.x-rect.x,
            srcY = update.copySrc.y-rect.y;
       
        update.pixelData = this.getSubRect(srcX,srcY,update.width,update.height,img,rect);
        this.drawPartialData(update,img,rect);
    }

    this.drawPartialFillRect = function(update,img,rect) {
        // translate the update coordinate system according to 
        // the rectangular marked as dirty
        
        update.x = update.x-rect.x,
        update.y = update.y-rect.y;
        var px = update.pixelData;
        var offset = (update.y*rect.width+update.x)<<2;
        var rightMost = update.width<<2;
        var length = update.width*update.height*4;
        for(var i=0,ctr=0;i<length;i+=4,ctr+=4) {
            img[offset+ctr] = px[2];
            img[offset+ctr+1] = px[1];
            img[offset+ctr+2] = px[0];
            img[offset+ctr+3] = 0xff;
            if((ctr+4) % rightMost)
                continue;
            offset += (rect.width)<<2;
            ctr = -4;
        }   
    }

    this.drawPartialData = function(update,img,rect) {
        // translate the update coordinate system according to 
        // the rectangular marked as dirty
        
        update.x = update.x-rect.x,
        update.y = update.y-rect.y;
        var px = update.pixelData;
            
        var offset = (update.y*rect.width+update.x)<<2;
        var rightMost = update.width<<2;
        for(var i=0,ctr=0;i<px.length-4;i+=4,ctr+=4) {
            img[offset+ctr] = px[i+2];
            img[offset+ctr+1] = px[i+1];
            img[offset+ctr+2] = px[i];
            img[offset+ctr+3] = 0xff;
            if((ctr+4) % rightMost)
                continue;
            offset += (rect.width)<<2;
            ctr = -4;
        }   
    }

    this.copyData = function(px,data) {
        for(var i=0;i<px.length+1;i+=4) {
            data[i] = px[i+2];
            data[i+1] = px[i+1];
            data[i+2] = px[i];
            data[i+3] = 0xff;
        }
    }

    this.drawPixelCopyUpdate = function(update) {
        var img = this.ctx.getImageData(update.copySrc.x,update.copySrc.y,update.width,update.height);
        if(!this.inBatch)
            this.ctx.putImageData(img,update.x,update.y);
        else {
            // add to batch as a copy update
            this.addToBatch(update,true);
            // also add the copy area as a 'phantom' update that
            // won't be processed, so the dirty area gets recalculated
            // correctly
            this.addToBatch({
                x:update.copySrc.x,
                y:update.copySrc.y,
                width: update.width,
                height: update.height
            },true,true);
        }
    }

    this.drawFillRect = function(update) {
        if(!this.inBatch) {
            
            this.ctx.fillStyle = "rgb("+update.pixelData[2]+","+update.pixelData[1]+","+update.pixelData[0]+")";
            this.ctx.fillRect(update.x,update.y,update.width,update.height);
        } else {
            update.fill = true;
            this.addToBatch(update);            
        }
    }
    this.inBatch = false;

    this.drawPixelUpdate = function(update) {
        var img = {};
        if(update.width <= 0 || update.height <= 0)
            return;

        if(!this.inBatch) {
            img = this.ctx.getImageData(update.x,update.y,update.width,update.height);
            this.copyData(update.pixelData,img.data);
            this.ctx.putImageData(img,update.x,update.y);
        } else { 
            this.addToBatch(update);
        }
    }
}
if(typeof define === "function") {
    define([],function() {    
        return canvasDrawer;
    })
}
if(typeof Testables === "object")
    Testables.canvasDrawer = canvasDrawer;
})()