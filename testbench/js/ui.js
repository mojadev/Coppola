
var uiController = function($scope) {
    $scope.rfb = null;
    $scope.inputFields = [{
        pxField: 'redShift', lbl: 'Redshift',type: 'number',value: 0
    },{
        pxField: 'greenShift', lbl: 'Greenshift',type: 'number',value: 0
    },{
        pxField: 'blueShift',lbl: 'Blueshift',type: 'number',value: 0
    },{
        pxField: 'redMax',lbl: 'Redmax',type: 'number',value: 0
    },{
        pxField: 'greenMax',lbl: 'Greenmax',type: 'number',value: 0
    },{
        pxField: 'blueMax',lbl: 'Bluemax',type: 'number',value: 0
    },{
        pxField: 'redMult',lbl: 'Redmult',type: 'number',value: 0
    },{
        pxField: 'greenMult',lbl: 'Greenmult',type: 'number',value: 0
    },{
        pxField: 'blueMult',lbl: 'Bluemult',type: 'number',value: 0
    }];

    $scope.connectionInfo = {
        host : 'ws-jmosshammer',
        port: 4430,
        pass: 'testtest',
        disabled:false
    };
    
    $scope.change = function() {
        if(!$scope.rfb.pixelFormat)
            return;
        
        var px = $scope.rfb.pixelFormat;
        for(var i=0;i<$scope.inputFields.length;i++) {
           if(f.pxField == "enableBatch") {
               px.graphics.enableBatch = f.value;
           } else {
               var f = $scope.inputFields[i];
               px.format[f.pxField] = f.value;
           }
        }
        $scope.rfb.send.framebufferUpdateRequest($scope.rfb.screenRect,false);
    }
    
    $scope.connect = function() {
        $scope.rfb.connect(
            $scope.connectionInfo.host,
            $scope.connectionInfo.port
        );
        $scope.connectionInfo.disabled=true;
    }
    
    $scope.dump = function() {
        
        
        console.log($scope.rfb.network.getDump(50))
    }
    var updatePixelFormat = function(px) {
        $scope.$apply(function() {
           for(var i=0;i<$scope.inputFields.length;i++) {
               var f = $scope.inputFields[i];
               f.value = px.format[f.pxField]
           }
        });
    }

    require(["coppola"],function(noVNC) {
        window.mainScreen = noVNC.allocateScreen(document.getElementById('main'),{
            height: 500,
            width:500,
            resize:true,
            protocol: 'rfb',
	    password: $scope.connectionInfo.pass
        });
        
        window.mainScreen.onReady(function(rfb) {
            $scope.rfb = rfb;
            $scope.net = rfb.network;
            rfb.onPixelFormatChange.add(updatePixelFormat);
        });
        
    });
}


var logController = function($scope) {
    $scope.log = [];
    $scope.filter = {
        log: false,
        error: true,
        debug: true
    }
    $scope.messageFilter = function(obj) {
        return $scope.filter[obj.type] === true;
    }
    window.console.debug = function() {
        var args = arguments;
        $scope.$apply(function() {
            $scope.log.push({
                time: (new Date()).getTime(),
                message: JSON.stringify(args),
                type: 'debug'
            });
        });
    }
    var ce = window.console.error;
    window.console.error = function() {
        var args = arguments;
        $scope.$apply(function() {
            $scope.log.push({
                time: (new Date()).getTime(),
                message: JSON.stringify(args),
                type: 'error'
            });
        });
    //    ce.apply(this,arguments);
    }
    var cl = window.console.log;
    window.console.log = function() {
        var args = arguments;
        $scope.$apply(function() {
            $scope.log.push({
                time: (new Date()).getTime(),
                message: JSON.stringify(args),
                type: 'log'
            });
        });
        cl.apply(this,arguments);
    
    }
}
function fallbackConnect() {
    require(["coppola"],function(noVNC) {
        window.mainScreen = noVNC.allocateScreen('#main',{
            height: 500,
            width:500,
            resize:true,
            protocol: 'rfb'
        });

        window.mainScreen.onReady(function(rfb) {
            rfb.connect('localhost',4430);
        });
    });

}