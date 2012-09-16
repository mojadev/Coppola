/* 
 * Generic screen, reserves an area for remote control and provides
 * drawing functions. Acts as the interface for the host application.
 * 
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
define([
    "lib/signals",
    "include/graphics/canvasDrawer"], function(signals,drawer) {
    
    return function() {
        this.ready = false;
        this.protocol = {};
        this.canvas = document.createElement("canvas");
        this.graphic = null;
        this.password = "";
        var size = {
            height: 0,
            width: 0,
            resize: false
        }
        
        var construct = function(el, options) {
            this.el = el;
	    this.password = options.password;
            if(!isNaN(options.height) && !isNaN(options.width)) {
                this.setSize(options.height,options.width);
            } else {
                this.setSize(el.style.height,el.style.width);
            }
            if(typeof options.resize === "boolean") {
                this.setResize(options.resize);
            }
            if(typeof options.protocol !== "undefined") {
                this.setProtocol(options.protocol);
            }
            this.el.appendChild(this.canvas);
            this.graphic = new drawer(this.canvas);
        };
        
        this.updateCanvas = function(width,height) {
            this.canvas.height = height;
            this.canvas.width =width;
        }
        
        this.setSize = function(height,width) {
            size.height = height;
            size.width = width;
            this.events.sizechanged.dispatch(height,width);
            this.syncSize();
        }
        
        this.syncSize = function() {
            if(!size.resize)
                return;
            this.el.style.height = size.height;
	    this.el.style.width = size.width;
        }
        
        this.setResize = function(bool) {
            size.resize = bool;
            this.syncSize();
        }
        
        this.getSize = function() {
            return size;
        }

        this.onReady = function(fn,scope) {
            if(this.ready)
                fn.call(scope,this.protocol);
            else
                this.events.ready.addOnce(fn,scope);
        }
        
        this.setProtocol = function(protocol) {
            require(["include/"+protocol+"/protocol"],(function(protoHandler) {
                this.protocol = new protoHandler(this,{password: this.password});        
                this.protocol.onSizeChanged.add(this.updateCanvas,this);
                this.events.ready.dispatch(this.protocol);
                this.ready = true;
            }).bind(this));
        }
        
        this.events = {
            sizechanged: new signals.Signal(),
            ready: new signals.Signal(),
            error: new signals.Signal()
        }
        
        construct.apply(this,arguments)
      
    };
});
