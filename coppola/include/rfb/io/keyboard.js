/**
 * Keyboard input using a textfield as an input proxy. 
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
    var KEY_F1 = 112, KEY_F12 = 123;
    var KEY_TRANSLATE_TABLE = {
	8 : 0xFF08,  // Backspace
	9 : 0xFF09,  // TAB
	13 : 0xFF0D, // Enter
	16 : 0xFFE1, // Shift
	17 : 0xFFE3, // Ctrl
	//18 : 0xFFE9, // ALT
	91 : 0xFFE7, // WIN
	33 : 0xFF55, // PAGE_UP
	34 : 0xFF56, // PAGE_DOWN
	35 : 0xFF50, // HOME
	36 : 0xFF57, // END
	37 : 0xFF51, // LEFT
	38 : 0xFF52, // UP
	39 : 0xFF53, // RIGHT
	40 : 0xFF54, // DOWN
	45 : 0xff63, // INSERT
	46 : 0xFF1B  // DELETE
    };
    
    return function(rfb) {
	
        var KEY_DOM_SHIM = document.createElement("input");
	KEY_DOM_SHIM.style.position = "absolute";
	KEY_DOM_SHIM.style.left = "-1024px";
	KEY_DOM_SHIM.style.top = "0";
        
	var KEY_STATE = {
	    SHIFT: false,
	    CTRL : false,
	    ALT  : false
	}
	
	this.startCapture = function(el) {
	    el.parentNode.appendChild(KEY_DOM_SHIM);
	    KEY_DOM_SHIM.focus();
	    el.addEventListener("mousemove",this.moveToPos);
	    el.addEventListener("click",this.moveToPos);
	    KEY_DOM_SHIM.addEventListener("keydown",this.onKeyDown);
	    KEY_DOM_SHIM.addEventListener("keyup",this.onKeyUp);
	    
	    clearAllSpecialKeys();
        }
	
	this.stopCapture = function(el) {
	   
	}
	
	this.moveToPos = function(ev) {
	    var sT = document.body.scrollTop+ev.pageY;
	    KEY_DOM_SHIM.style.top = (sT)+"px";
	    KEY_DOM_SHIM.focus();
	}
	this.onKeyUp = function(ev) {
	    return keyEv(ev,false);   
	}
	this.onKeyDown = function(ev) {
	    return keyEv(ev,true);   
	}
	var resetTextBoxCursor = function() {
	    KEY_DOM_SHIM.value = KEY_DOM_SHIM.value;
	}
	var translateSpecialChar = function(ev) {
	    var key = ev.keyCode;
	    if(key >= KEY_F1 && key <= KEY_F12) {
		resetTextBoxCursor();
		return 0xffbe + KEY_F12-KEY_F1;
	    }
	    if(KEY_TRANSLATE_TABLE[key]) {
		resetTextBoxCursor();
		return KEY_TRANSLATE_TABLE[key];
	    }
	    return -1;
	}
	
	var processSpecialKeys = function(ev,down) {
	    if(ev.ctrlKey != KEY_STATE.CTRL) {
		rfb.send.keyEvent(0xFFE3,!KEY_STATE.CTRL,down);
		KEY_STATE.CTRL = ev.ctrlKey;
	    }
	    /*if(ev.altKey != KEY_STATE.ALT) {
		rfb.send.keyEvent(0xFFE9,!KEY_STATE.ALT);
		KEY_STATE.ALT = ev.altKey;
	    }*/
	    if(ev.shiftKey != KEY_STATE.SHIFT) {
		rfb.send.keyEvent(0xFFE1,!KEY_STATE.SHIFT);
		KEY_STATE.SHIFT = ev.shiftKey;
	    }
	}
	
	var clearAllSpecialKeys = function() {
	    rfb.send.keyEvent(0xFFE1);
	    rfb.send.keyEvent(0xFFE3);
	    rfb.send.keyEvent(0xFFE9);
	}
	
	var keyEv = function(ev,down) {
	    var lastlength = KEY_DOM_SHIM.value.length;
	    var schar = translateSpecialChar(ev);
	    processSpecialKeys(ev,down);
	    if(schar >= 0) {
		rfb.send.keyEvent(schar,down);
	    } else  {
		setTimeout(function() {
		    var v = KEY_DOM_SHIM.value;
		    var key = v.charCodeAt(v.length-1)
		    if(v.length <= lastlength && down)
			key = ev.keyCode;
                    console.log("sending " +  (down ? "DOWN " : "UP "),down,key,String.fromCharCode(key));
		    rfb.send.keyEvent(key,down);
		},10);
	    }
	    return false;
	}	
    }
})