/**
 * @author Jannis Moßhammer <mojadev@gmail.com>
 * @TODO: This is not yet implemented or even started
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
define(["include/rfb/encodings/raw"],function(raw) {
    return function(fbUpdate,network,encoding) {
        var length = network.read32(1)[0];
        if(network.bytesLeft() < length) {
            network.seek(-4);
            return false;
        }
        var t = network.read8(length);
        
        console.debug("Read "+length+" bytes of funky zip data");

        console.log("Unzip",Zlib.Deflate.compress(t));

        return true;
    }
  

})