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
    var getXY = function(e,el) {
        return {
            x: e.pageX - el.offsetLeft,
            y: e.pageY - el.offsetTop
        }
    };
    
    return function(rfb) {
     
        this.targetEl;
        this.btnState = 0;
        this.startCapture = function(el) {
            this.targetEl = el;
            el.addEventListener("mousemove",this.mouseEv.bind(this));
            el.addEventListener("mousedown",this.mouseEv.bind(this));
            el.addEventListener("mouseup",this.mouseEv.bind(this));
	    el.onmousewheel = this.mouseScrollEv.bind(this);
        }
	
	this.stopCapture = function(el) {
	    el.removeEventListener("mousemove",this.mouseEv,this);
            el.removeEventListener("mousedown",this.mouseEv,this);
            el.removeEventListener("mouseup",this.mouseEv,this);
    	    el.removeEventListener("scroll",this.mouseScrollEv,this);
	}
	this.mouseScrollEv = function(ev) {
	    var btn = 5;
	    if(ev.wheelDelta > 0)
               btn = 4;

            rfb.send.pointerEvent(btn,ev.offsetX,ev.offsetY);
	    rfb.send.pointerEvent(0,ev.offsetX,ev.offsetY);
	    return false;
	    
	}
        
        this.setButtonState = function(ev) {
            if(ev.type == "mousedown") {    
                this.btnState = ev.button+1;
            } if (ev.type == "mouseup") {
                this.btnState = 0;
            }
        }
        
	this.mouseEv = function(ev) {
            this.setButtonState(ev);
            var xy = getXY(ev,this.targetEl)
            rfb.send.pointerEvent(this.btnState,xy.x,xy.y);
	    return false;   
	}
    }
})