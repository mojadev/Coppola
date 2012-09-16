
var canvasMock = function(w,h) {

    this.height = h;
    this.width = w;
    this.dataSet = new Uint8Array(w*h*4);

    this.getSubRect = function(x,y,w,h) {
        var result = new Uint8Array(w*h*4), count = 0;
        for(var yOff=0;yOff<h;yOff++) {
            var yPos = (yOff+y)*this.width*4;
            for(var xOff=0;xOff<w;xOff++) {
                var xPos = x*4+yPos+xOff*4;
                result[count++] = this.dataSet[xPos]; 
                result[count++] = this.dataSet[xPos+1];
                result[count++] = this.dataSet[xPos+2];
                result[count++] = this.dataSet[xPos+3];
            }
        }
        return result;
    }

    this.setSubRect = function(x,y,w,h,data) {
        var count = 0;
        for(var yOff=0;yOff<h;yOff++) {
            var yPos = yOff*this.width*4+y*this.width*4;
            for(var xOff=0;xOff<w;xOff++) {
                var xPos = x*4+yPos+xOff*4;
                this.dataSet[xPos]      = data[count++]; 
                this.dataSet[xPos+1]    = data[count++];
                this.dataSet[xPos+2]    = data[count++];
                this.dataSet[xPos+3]    = data[count++];
            }
        }
    }

    this.getImageData = function(x,y,w,h) {
        return {
            width: w,
            height: h,
            data: this.getSubRect(x,y,w,h)
        }
    }
    this.putImageData = function(img,x,y) {
        this.setSubRect(x||0,y||0,img.width,img.height,img.data);
    }
    
    
    
    this.getContext = function() {
        return this;
        
    }
};