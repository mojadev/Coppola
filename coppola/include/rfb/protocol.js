/**
 * RFB Protocol implemented as in
 * http://www.realvnc.com/docs/rfbproto.pdf
 *
 * This is a protocol package and this class mainly acts as the controller.
 * Handshaking is done here, but afterwards server messages are forwarded to
 * the messages/server class and client messages are forged by using the 
 * messages/client class.
 * 
 * So after the handshake, this class only recognizes network updates and forwards
 * it to it's appropriate handler. The actual encodings can be found underneath 
 * the encodings/ folder, with encodings.js as the controller class
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
define(["require","include/net/io",
        "lib/signals",
        "include/rfb/auth/vnc",
        "include/rfb/auth/none",
        "include/rfb/pixelformat",
        "include/rfb/encodings/encodings",
        "include/rfb/messages/client",
        "include/rfb/messages/server",
        "include/rfb/io/mouse",
	"include/rfb/io/keyboard"
        ], function(require,net,signal,vncAuth,
                noneAuth,pixelFormat,encodings,
                clientMessages,serverMessages,mouse,keyboard) {

    var states = {
        "stopped"    : 0,
        "handshake"  : 1,
        "initialize" : 2,
        "running"    : 3,
        "error"      : 98
    },

    versions = {
        "RFB 000.000": 1.0, // UltraVNC repeater
        "RFB 003.003": 3.3,
        "RFB 003.006": 3.3,  // UltraVNC
        "RFB 003.889": 3.3,  // Apple Remote Desktop
        "RFB 003.007": 3.7,
        "RFB 003.008": 3.8,
        "RFB 004.000": 3.8,  // Intel AMT KVM
        "RFB 004.001": 3.8
    };
    
    
    return function(screen,options) {
        var network = new net();

        var securityHandler = null;

        /**
         * Error watchdog
         * counter that will be increased when a protocol handler can't
         * go on because of missing data. Because bugs in protocolhandlers 
         * can end up in infinite loops (because the protocol always says it 
         * needs more data...) this counter checks how many "need more data" requests
         * have been made. When WATHCDOG_ERROR_THRESHOLD is reached communication 
         * is aborted.
         **/
        var errorWatchdog = 0;
        var WATCHDOG_ERROR_THRESHOLD = 30;
        this.network = network;        
        this.screen = screen;
        this.version = 0.0;
        this.state = states["stopped"];
	this.cfg = {};
        this.pixelFormat = null;
        this.encodings = new encodings(network,pixelFormat,screen.graphic);
	this.io = {
	    mouse: new mouse(this),
	    keyboard: new keyboard(this)
	}
        this.screenRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
        /**
         * Client message handler that can be used for sending messages,
         * @see messages/client.js for available methods
         **/
        this.send = new clientMessages(network,this.encodings);

        /**
         * Server message handler that handles incoming messages
         * @see messages/server.js for available methods
         **/
        this.recv = new serverMessages(network,this.encodings);

        var messageReceived = function() {
            var continueRead = true;
            while(network.bytesLeft() && continueRead) {
                switch(this.state) {
                    case states['stopped']:
                        continueRead = this.readVersion();
                        break;
                    case states['handshake']:
                        continueRead = this.continueHandshake();
                        break;
                    case states['initialize']:
                        continueRead = this.initializePixelformat();
                        break;     
                    case states['running']:
                        continueRead = this.recv.onMessage();
                        if(continueRead)
                            this.send.framebufferUpdateRequest(this.screenRect,true);
                        break;
                    default:
                        continueRead = false;
                }
            }
        }
        
        var handleError = (function(e,critical) {
            console.log(e);
	    alert(e);
            if(critical) {
                this.state = states["stopped"];
                this.close();
		document.location.href = document.location.href;
            }
            this.onError.dispatch(e,critical);
        }).bind(this);

        /**
         * The ProtocolVersion message consists of 12 bytes interpreted as a string of ASCII
         * characters in the format "RFB xxx.yyy\n" where xxx and yyy are the major and
         * minor version numbers, padded with zeros.
         **/
        this.readVersion = function() {
            var versionString;
            if(network.bytesLeft() < 12) // we need more data
                return false;
            versionString = network.readString(11);
            network.seek(1); // skip the whitespace
            if(typeof versions[versionString] === "undefined") {
                handleError("Invalid server version ("+versionString+") received"+"|"+versionString+"|");
                return false;
            } 
            this.version = versions[versionString];

            console.log("Server has RFB version "+this.version+" ("+versionString+")");
            this.state = states["handshake"];
            network.send(versionString+"\n");
            return true;
        }

        this.continueHandshake = function() {

            if(securityHandler === null)
                return setupSecurityHandler();

            securityHandler.dataAvailable();
            if(!securityHandler.finished)
                return true; // securityHandler needs more data

            if(securityHandler.success) {
                this.state = states["initialize"];
                network.send(new Uint8Array(options.isExclusive ? [0] : [0]));
                console.log("Authentication succeeded");                
                return true;
            } else {
                if(this.version > 3.7) {
                    handleError("Authentication failed, reason: "+readErrorMessage(),true);
                } else { 
                    handleError("Authentication failed",true);
                }
                return false;
            }
        }
        
        this.initializePixelformat = function() {
            if(this.pixelFormat === null) {
                this.pixelFormat = new pixelFormat(network);
            }
            var continueRequest = this.pixelFormat.onDataAvailable();
            if(!this.pixelFormat.isSetup) {
                return continueRequest;
            }
            if(this.pixelFormat.isValid) {
                this.state = states["running"];
                this.send.setEncodings();
                this.screenRect = {
                    x: 0,
                    y: 0,
                    width: this.pixelFormat.format.width,
                    height: this.pixelFormat.format.height
                }
                this.encodings.pixelFormat = this.pixelFormat;
                this.onSizeChanged.dispatch(this.screenRect.width,this.screenRect.height);
		this.captureIO();
		
                //this.send.enableContinuousUpdates(this.screenRect, true);
                console.log("Update 159");
                this.send.framebufferUpdateRequest(this.screenRect,false);
                
                this.onPixelFormatChange.dispatch(this.encodings.pixelFormat);
            } else {
                this.state = states["error"];                
            }
            return continueRequest;
        }
	    
	this.captureIO = function() {
	    for(var i in this.io)
		this.io[i].startCapture(this.encodings.graphic.getTarget());
	}
	
        var readErrorMessage = function() {
            var errorLength = network.read32BE(1)[0];
            return network.readString(errorLength);
        }
        
        
        var setupSecurityHandler = (function() {
            var secType = 0;
            if(this.version >= 3.7) { // 3.7 let's us decide which type we want to use
                secType = chooseSecurityType();
                network.send(new Uint8Array([secType]));
            } else { // versions below 3.7 tell us what security type they accept
                secType = readSecurityType();
            }
            console.log("Server sends security type "+secType);
            
            /**
             * @TODO: When more than these 2 Authentication types are defined, the
             * auth handler should be resolved by a map instead of extending the
             * switch/case construct. Nobody likes big switch/case parts...
             */
            switch(secType) {
                case 0: // No connection possible
                    return false;
                case 1: // No authentication is used
                    if(this.version >= 3.8) { // 3.8 and later send a SecurityResult
                        securityHandler = new noneAuth(network);
                        
                    } else { // versions till 3.70 now just go on with the initialization
                        this.state = states["initialize"];
                    }
                    return true;
                case 2: // Use VNC auth, i.e. using DES for handshake
                    securityHandler = new vncAuth(network,this.cfg.password);
                    return true;
                default:
                    handleError("Server only allows unsupported security types, only None and VNC is supported ",true);
                    return false;
            }
        }).bind(this);
        
        
        var chooseSecurityType = (function() {
            var nrOfSecurityTypes = network.read8(1)[0],
            supported = {};
            
            if(nrOfSecurityTypes === 0) { // Supported type 0 is connection error
                handleError("Connect failed, reason: "+readErrorMessage(),true);
                return 0;
            }
            for(var i=0;i<nrOfSecurityTypes;i++) {
                supported[network.read8(1)[0]] = true;
            }
            console.log("Supported types ",supported);
            if(typeof supported[2] !== "undefined") {
                return 2;
            } else if(typeof supported[1] !== "undefined") {
                return 1;
            }
            return 99; // unknown value
        }).bind(this);
        
        
        var readSecurityType = (function() {
            // read supported security types
            var supportedType = network.read32(1)[0];
            if(supportedType === 0) { // Supported type 0 is connection error
                handleError("Connect failed, reason: "+readErrorMessage(),true);
            }
            return supportedType;
        }).bind(this);
        
        
        this.connect = function(server,port,options) {
            if(this.state !== states["stopped"])
                return;
	    this.cfg = options || {};
            network.connect(server,port);
        }

        this.close = function() {
            network.close();
        }
        
       
        network.onMessage.add(messageReceived,this);
        
        // Events
        this.onError = new signal.Signal();
        this.onSizeChanged = new signal.Signal();
        this.onReady = new signal.Signal();
        this.onPixelFormatChange = new signal.Signal();
    }
    
});