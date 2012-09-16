describe("A canvas mockup class", function() {
    /**
     * This is a small 10x10 bitmap for testing the modification of rectangular
     * areas.
     */
    var testDataSet = new Uint8Array([ 
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,1,1,1, 1,1,1,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,1,1,1, 1,1,1,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,1,1,1, 1,1,1,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 2,2,2,2, 2,2,2,2, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 2,2,2,2, 2,2,2,2, 0,0,0,0, 0,0,0,0, 0,0,0,0, 4,4,4,4, 4,4,4,4,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 4,4,4,4, 4,4,4,4,
        3,3,3,3, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 4,4,4,4, 4,4,4,4,
        3,3,3,3, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 4,4,4,4, 4,4,4,4
    ]);
  
    it("can be created in different sizes", function() {
        var mockup1 = new canvasMock(200,200);
        var mockup2 = new canvasMock(100,100);
      
        expect(mockup1.getContext("2d").dataSet.length).toBe(200*200*4);
        expect(mockup2.getContext("2d").dataSet.length).toBe(100*100*4);
    });

    it("returns correct rectangular subareas", function() {
        var mockup1 = new canvasMock(10,10).getContext("2d");
        mockup1.dataSet = testDataSet;
        var subRect = mockup1.getSubRect(0,0,10,10);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(testDataSet[i]);
        }
        
        subRect = mockup1.getSubRect(1,1,2,3);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(1);
        }
        subRect = mockup1.getSubRect(5,5,2,3);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(0);
        }        
        subRect = mockup1.getSubRect(3,5,2,2);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(2);
        }

        subRect = mockup1.getSubRect(0,8,1,2);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(3);
        }

        subRect = mockup1.getSubRect(8,6,2,4);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(4);
        }
    });
    
    it("can modify rectangular subareas", function() {
        var mockup1 = new canvasMock(10,10).getContext("2d");
        mockup1.dataSet = testDataSet;
        var overwrite = [];

        for(var i=0;i<3*3*4;i++) {
            overwrite[i] = Math.floor(Math.random()*255);
        }
        mockup1.setSubRect(0,0,3,3,overwrite);
        var subRect = mockup1.getSubRect(0,0,3,3);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(overwrite[i]);
        }

        for(var i=0;i<2*6*4;i++) {
            overwrite[i] = Math.floor(Math.random()*255);
        }
        mockup1.setSubRect(4,3,2,6,overwrite);        
        subRect = mockup1.getSubRect(4,3,2,6);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(overwrite[i]);
        }
        
        
        for(var i=0;i<400;i++) {
            overwrite[i] = Math.floor(Math.random()*255);
        }
        mockup1.setSubRect(0,0,10,10,overwrite);
        subRect = mockup1.getSubRect(0,0,10,10);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect[i]).toBe(overwrite[i]);
        }         
    });
    
    it("supports getImageData()", function() {
        var mockup1 = new canvasMock(10,10).getContext("2d");
        mockup1.dataSet = testDataSet;
        var img = mockup1.getImageData(0,0,10,10);
        for(var i=0;i<testDataSet.length;i++) {
            expect(img.data[i]).toBe(testDataSet[i]);
        }
        expect(img.height).toBe(10);
        expect(img.width).toBe(10);
    });

    it("supports putImageData()", function() {
        var mockup1 = new canvasMock(10,10).getContext("2d");
        var img = mockup1.getImageData(4,4,3,3);
        var overwrite = [];
        for(var i=0;i<3*3*4;i++) {
            overwrite[i] = Math.floor(Math.random()*255);
            img.data[i] = overwrite[i];
        }
        mockup1.putImageData(img,4,4);
        var subRect = mockup1.getImageData(4,4,3,3);
        for(var i=0;i<subRect.length;i++) {
            expect(subRect.data[i]).toBe(overwrite[i]);
        }
    });
});