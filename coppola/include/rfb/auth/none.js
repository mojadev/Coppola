/**
 * No authentication, that's easy! 
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

define(function() {
    return function(network) {
        this.finished = false;
        this.success = false;
        
        this.dataAvailable = function() {
            // Await SecurityResult, which is one 32 bit word
            if(network.bytesLeft < 4) 
                return true;
            this.success = network.read32(1)[0] === 0;
            this.finished = true;
            return this.success;
        }
    }
})