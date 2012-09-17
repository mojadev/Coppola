Coppola - HTML5 VNC like native
================================

Coppola is a HTML5 Remote viewer (currently it only supports VNC) with one goal: To be as fast as a classic native remote desktop.

Current features (16.09.2012)
------------------------
- Uncompressed encodings (raw, copyrect)
- Uses your desktop character set, which makes it very comfortable 
- It's fast
- No plugins needed in current browsers
- Works with every RFB-compatible VNC server
- Supports requireJS

Upcoming features
--------------------------
- More and Low bandwidth encodings: ZRLE, Hextile
- Custom cursor support
- Better documentation
- WSS support for encrypted communication
- Non-VNC Authentication (VNC authentication only uses DES) 
- And more !

Installation
------------------------
NOTICE: This is alpha, compressed encodings are not supported yet and some features like secured websockets (wss:) support are not implemented yet.
Also, you might encounter a few bugs, open issues or start coding by yourself (that would be great)! 

This is not a warning, but an encouragement: Test it, use it, give feedback, help making it better!

- You need NodeJS and a fast browser (I'm currently only developing using Chrome and recent Firefox versions).
- Run node coppola/server/ws_proxy.js %public port% %vnc host% %vnc port%. Now there's a proxy running that allows you to connect to your vnc server via the coppola web frontend
- Just copy the testbench to your webserver and try it

(Yep, that's very brief, I know)

FAQ
-------------------------------

**Where's the name coming from**

In E.T.A Hofmanns short-story 'Der Sandmann' Copolla (ital. eye cavities) is trader specialized in lenses and wheather glasses. He sells the protagonist a lens which, in short, causes a outbreak of his schizophrenia.
When you develop a few days on vnc-encoding problems you sometimes think you're going crazy, too.


**Why not participating in, for example guacamole or noVNC**

I started looking at the noVNC sourcecode and why it was rather slow when connecting to a local vm while native viewers were very fast. I quickly realized that fixing most issues on the noVNC code would end up in a rewrite, so I started from scratch. 
(That's not meant to be FUD, Joel did a great job, he knows what he's doing and noVNC supports almost any browser out there). I also started a VNC viewer in 2010 called FuzzyKitten, but this was more a C# programming practice and handled VNC on the server side, so I already have some experience in VNC client programming. 
And last but not least, cappola is designed to be easily embedabble in your application!
 

**Whats the current development state?**

Currently I'm working on further encodings, namely hextile (support is almost finished, but there are some bugs) and ZRLE. But before I'm going to start this, I will setup improve the test-enviromnent (and I'm thinking hardly about how to properly test the encodings). 

**Does it work in IE?**

I havent tested it in IE10 yet, but it won't work in version < 9 ever. Those browsers are slow, and there are viewers like noVNC that support those browsers if you dare to use flash.
IE10 support and maybe IE9 (there's a websocket bridge plugin for this and maybe I'll use the flash websocket emulation)

**Were those questions really asked frequently**

No.
