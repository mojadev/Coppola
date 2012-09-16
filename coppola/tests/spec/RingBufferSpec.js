describe("A RingBuffer", function() {
  var RingBuffer = Testables.ringbuffer;
  var r;
  it("Can be created in various sizes", function() {
      var r1 = new RingBuffer(24); // min size
      var r2 = new RingBuffer(1024);
      var r3 = new RingBuffer(1024*1024);
      
      
      delete(r1);
      delete(r2);
      delete(r3);
  });
  
  it("Can be written to with numeric data without causing overflows",function() {
    var r = new RingBuffer(32);
    var _in=[];
    for(var i=0;i<1024;i++) {
        _in[i] = Math.random()*255;
    }
    r.write(_in);
    
  });
  
  it("Can be written to with string data without causing overflows",function() {
    var r = new RingBuffer(32);
    var _in=[];
    
    r.write("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam\n\
     nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed \n\
        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet\n\
     clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\
\n\
     Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod \n\
    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos \n\
    et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctu\n\
    s est Lorem ipsum dolor sit amet.");
  });
  
  it("Can be written and read from", function() {
    var r = new RingBuffer(32);
    for(var i=0;i<11;i++) {
        var n = Math.floor(Math.random()*255);
        r.write([n,n+1,n+3]);
        expect(r.read16(1)[0]).toBe(n|(n+1)<<8);
        expect(r.read8(1)[0]).toBe((n+3)%256);
    }

    for(var i=0;i<1;i++) {
        var n = Math.floor(Math.random()*255);
        var n2 = Math.floor(Math.random()*255);
        r.write([n,n2]);
        var p = r.read16(1);
        expect(p[0]).toBe(n|(n2)<<8);
    }
  });
});