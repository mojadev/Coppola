describe("A CanvasDrawer", function() {

    var testSet1 = new Uint8Array([ 
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
    ]);
    var testSet2 = new Uint8Array([ 
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
    ]);
    var testSet3 = new Uint8Array([ 
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        7,8,9,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        7,8,9,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
    ]);
    var testSet4 = new Uint8Array([ 
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff,
        7,8,9,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff,
        7,8,9,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff
    ]);
    
    /**
     * copy x:1,y:1,w:2,h:3 to x:0,y:5
     * copy x:0,y:8,w:1,h:2 to x:2,y:8 and x:3,y:8
     */
    var copyTestSet1 = new Uint8Array([
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff,
        7,8,9,0xff, 0,0,0,0, 7,8,9,0xff, 7,8,9,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff,
        7,8,9,0xff, 0,0,0,0, 7,8,9,0xff, 7,8,9,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff, 10,11,12,0xff
        
    ]);
  
    var copyTestSet2 = new Uint8Array([
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 4,5,6,0xff, 4,5,6,0xff, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 10,11,12,0xff,
        0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 10,11,12,0xff,
        7,8,9,0xff, 0,0,0,0, 7,8,9,0xff, 7,8,9,0xff, 0,0,0,0, 0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 10,11,12,0xff,
        7,8,9,0xff, 0,0,0,0, 7,8,9,0xff, 7,8,9,0xff, 0,0,0,0, 0,0,0,0, 1,2,3,0xff, 1,2,3,0xff, 0,0,0,0, 10,11,12,0xff    
    ]);

    
    it("Can draw images immediately",function() {
        var canvas = new canvasMock(10,10);
        var drawer = new Testables.canvasDrawer(canvas);
        
        drawer.drawPixelUpdate({
            width: 2,
            height: 3,
            x: 1,
            y: 1,
            pixelData: [
                3,2,1,0xff, 3,2,1,0xff,
                3,2,1,0xff, 3,2,1,0xff,
                3,2,1,0xff, 3,2,1,0xff
            ]
        });
        
        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(testSet1[i]);
        }
        
        
        drawer.drawPixelUpdate({
            width: 2,
            height: 2,
            x: 3,
            y: 5,
            pixelData: [
                6,5,4,0xff, 6,5,4,0xff,
                6,5,4,0xff, 6,5,4,0xff,
            ]
        });


        area = canvas.getContext("2D").getImageData(0,0,10,10).data;

        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(testSet2[i]);
        }
        
        drawer.drawPixelUpdate({
            width: 1,
            height: 2,
            x: 0,
            y: 8,
            pixelData: [
                9,8,7,0xff,
                9,8,7,0xff
            ]
        });
        
        area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(testSet3[i]);
        }
        
        drawer.drawPixelUpdate({
            width: 2,
            height: 4,
            x: 8,
            y: 6,
            pixelData: [
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff
            ]
        });
        area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(testSet4[i]);
        }
    });

    it("Can draw images in batch mode", function() {
        var canvas = new canvasMock(10,10);
        var drawer = new Testables.canvasDrawer(canvas);
        drawer.beginBatchUpdate();
        expect(drawer.inBatch).toBe(true);
        
        drawer.drawPixelUpdate({
            width: 2,
            height: 3,
            x: 1,
            y: 1,
            pixelData: [
                3,2,1,0xff, 3,2,1,0xff,
                3,2,1,0xff, 3,2,1,0xff,
                3,2,1,0xff, 3,2,1,0xff
            ]
        });
        
        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(0);
        }
        
        
        drawer.drawPixelUpdate({
            width: 2,
            height: 2,
            x: 3,
            y: 5,
            pixelData: [
                6,5,4,0xff, 6,5,4,0xff,
                6,5,4,0xff, 6,5,4,0xff,
            ]
        });


        area = canvas.getContext("2D").getImageData(0,0,10,10).data;

        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(0);
        }
        
        drawer.drawPixelUpdate({
            width: 1,
            height: 2,
            x: 0,
            y: 8,
            pixelData: [
                9,8,7,0xff,
                9,8,7,0xff
            ]
        });
        
        area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(0);
        }
        
        drawer.drawPixelUpdate({
            width: 2,
            height: 4,
            x: 8,
            y: 6,
            pixelData: [
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff
            ]
        });
        area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(0);
        }
        
        // commit and check again
        drawer.commitBatchUpdate();
        area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect({px: area[i],idx:i}).toEqual({px: testSet4[i],idx:i});
        }
    });
    
    it("correctly determines the dirty area when using batch copies",function() {
        var canvas = new canvasMock(10,10);
        var drawer = new Testables.canvasDrawer(canvas);    
        drawer.beginBatchUpdate();
        expect(drawer.batchArea).toBe(null);
        drawer.drawPixelCopyUpdate({
            copySrc: {
                x: 1, 
                y: 1 
            },
            width: 2,
            height: 1,
            x: 6,
            y:6
        });
        expect(drawer.batchArea.l).toEqual(1);
        expect(drawer.batchArea.r).toEqual(8);
        expect(drawer.batchArea.t).toEqual(1);
        expect(drawer.batchArea.b).toEqual(7);
    });
    
    it("can handle copy updates in a batch (testset 1)", function() {
        var canvas = new canvasMock(10,10);
        var drawer = new Testables.canvasDrawer(canvas);
        canvas.dataSet = testSet3;
       
        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(testSet3[i]);
        }
        
        drawer.beginBatchUpdate();
        drawer.drawPixelCopyUpdate({
            copySrc: {
                x: 1, 
                y: 1 
            },
            width: 2,
            height: 1,
            x: 5,
            y:0
        });
        
        drawer.drawPixelUpdate({
            width: 2,
            height: 4,
            x: 8,
            y: 6,
            pixelData: [
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff,
                12,11,10,0xff, 12,11,10,0xff
            ]
        });
        
        drawer.drawPixelCopyUpdate({
            copySrc: {
                x: 0, 
                y: 8 
            },
            width: 1,
            height: 2,
            x: 2,
            y: 8
        });
        
        drawer.drawPixelCopyUpdate({
            copySrc: {
                x: 2, 
                y: 8 
            },
            width: 1,
            height: 2,
            x: 3,
            y: 8
        });
        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect({px: area[i], idx: i}).toEqual({px: testSet3[i],idx: i});
        }        
        drawer.commitBatchUpdate();
        
        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        console.log(area,copyTestSet1);
        for(var i=0;i<area.length;i++) {
            expect({px: area[i], idx: i}).toEqual({px: copyTestSet1[i],idx: i});
        }
        
    });
    
    
    it("can handle copy updates in a batch (testset 2)", function() {
        var canvas = new canvasMock(10,10);
        var drawer = new Testables.canvasDrawer(canvas);
        canvas.dataSet = copyTestSet1;
       
        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(copyTestSet1[i]);
        }
        
        drawer.beginBatchUpdate();
        drawer.drawPixelCopyUpdate({
            copySrc: {
                x: 0, 
                y: 0 
            },
            width: 4,
            height: 4,
            x: 5,
            y: 6
        });
        

        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {
            expect(area[i]).toBe(testSet3[i]);
        }        
        drawer.commitBatchUpdate();
        
        var area = canvas.getContext("2D").getImageData(0,0,10,10).data;
        for(var i=0;i<area.length;i++) {           
            expect(area[i]).toBe(copyTestSet2[i]);
        }
    });
    
    
    it("correctly draws a dot south",function() {
        var canvas = new canvasMock(32,32);
        var drawer = new Testables.canvasDrawer(canvas); 
        var dot = [
            0,0,0,0, 0,0,0,0, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0,0,0,0, 0,0,0,0
        ]
        // move dot south
        for(var i=0;i<27;i++) {
            drawer.beginBatchUpdate();

            drawer.drawPixelUpdate({
                x: 16,
                y: i,
                height: 5,
                width: 3,
                pixelData: dot
            });
            drawer.commitBatchUpdate();
        }
        var area = canvas.getContext("2D").getImageData(0,0,32,32).data;
        var sum = 0;
        for(var x=0;x<area.length;x++) {
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            //alpha channel is ignored
        }
        expect(sum).toEqual(9);   
        
    });
    
    it("correctly draws a dot north",function() {
        var canvas = new canvasMock(32,32);
        var drawer = new Testables.canvasDrawer(canvas); 
        var dot = [
            0,0,0,0, 0,0,0,0, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0,0,0,0, 0,0,0,0
        ]
        // move dot south
        for(var i=27;i>0;i--) {
            drawer.beginBatchUpdate();

            drawer.drawPixelUpdate({
                x: 16,
                y: i,
                height: 5,
                width: 3,
                pixelData: dot
            });
        }
        drawer.commitBatchUpdate();

        var area = canvas.getContext("2D").getImageData(0,0,32,32).data;
        var sum = 0;
        for(var x=0;x<area.length;x++) {
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            //alpha channel is ignored
        }
        expect(sum).toEqual(9);   
    });
    
    it("correctly draws a dot east",function() {
        var canvas = new canvasMock(32,32);
        var drawer = new Testables.canvasDrawer(canvas); 
        var dot = [
            0,0,0,0, 0,0,0,0, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0,0,0,0, 0,0,0,0
        ]
        // move dot south
        for(var i=0;i<27;i++) {
            drawer.beginBatchUpdate();

            drawer.drawPixelUpdate({
                x: i,
                y: 16,
                height: 5,
                width: 3,
                pixelData: dot
            });
        }
        drawer.commitBatchUpdate();

        var area = canvas.getContext("2D").getImageData(0,0,32,32).data;
        var sum = 0;
        for(var x=0;x<area.length;x++) {
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            //alpha channel is ignored
        }
        expect(sum).toEqual(9);   
        
    });
    
    it("correctly draws a dot west",function() {
        var canvas = new canvasMock(32,32);
        var drawer = new Testables.canvasDrawer(canvas); 
        var dot = [
            0,0,0,0, 0,0,0,0, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0xff,0xff,0xff,0xff, 0,0,0,0,
            0,0,0,0, 0,0,0,0, 0,0,0,0
        ]
        drawer.beginBatchUpdate();
        // move dot south
        for(var i=27;i>0;i--) {


            drawer.drawPixelUpdate({
                x: i,
                y: 16,
                height: 5,
                width: 3,
                pixelData: dot
            });
        }
        drawer.commitBatchUpdate();

        var area = canvas.getContext("2D").getImageData(0,0,32,32).data;
        var sum = 0;
        for(var x=0;x<area.length;x++) {
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            sum += area[x++] ? 1 : 0;
            //alpha channel is ignored
        }
        expect(sum).toEqual(9);   
        
    });
});