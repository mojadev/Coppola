/**
 * Mouse input handler for rfb
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
    
    return function(rfb) {
        
        this.startCapture = function(el) {
            el.addEventListener("mousemove",this.mouseEv);
            el.addEventListener("mousedown",this.mouseEv);
            el.addEventListener("mouseup",this.mouseEv);
	    el.onmousewheel = this.mouseScrollEv;
        }
	
	this.stopCapture = function(el) {
	    el.removeEventListener("mousemove",this.mouseEv);
            el.removeEventListener("mousedown",this.mouseEv);
            el.removeEventListener("mouseup",this.mouseEv);
    	    el.removeEventListener("scroll",this.mouseScrollEv);
	}
	this.mouseScrollEv = function(ev) {
	    var btn = 5;
	    if(ev.wheelDelta > 0)
               btn = 4;

            rfb.send.pointerEvent(btn,ev.offsetX,ev.offsetY);
	    rfb.send.pointerEvent(0,ev.offsetX,ev.offsetY);
	    return false;
	    
	}
	this.mouseEv = function(ev) {
            if(ev.type == "mouseup")
                ev.which = 0;
            rfb.send.pointerEvent(ev.which,ev.offsetX,ev.offsetY);
	    return false;   
	}
    }
})