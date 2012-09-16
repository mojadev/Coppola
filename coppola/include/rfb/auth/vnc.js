/**
 * VNC Authentication, using the buggy DES Encryption vnc provides 
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

define(['lib/des'],function() {
    return function(network,userpass) {
        this.finished = false;
        this.success = false;
        var challengeRead = false;
        
        
        var readChallenge = (function() {
            if(network.bytesLeft() < 16)
                return true;
            
            // read encrypt and send the challenge
            var plain = new Array(16), 
                pass = new Array(userpass.length),
                str = network.read8(16)
               
            for(var i=0;i<16;i++) {
                plain[i] = str[i];
            }
            for(var i=0;i<userpass.length;i++) {
                pass[i] = userpass.charCodeAt(i);
            }
            
            var encryptedChallenge = DES(pass).encrypt(plain);
            network.send(new Uint8Array(encryptedChallenge));
            challengeRead = true;
            return true;
        }).bind(this);
        
        this.dataAvailable = function() {

            if(!challengeRead) 
                return readChallenge();
            else if(network.bytesLeft < 4) 
                return true;
            
            this.success = network.read32(1)[0] === 0;
            this.finished = true;
            return this.success;
        }
        
        console.log("intitated vncAuth");        
    }
})