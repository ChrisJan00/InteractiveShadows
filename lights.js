var LightsManager = function () {
	var self = this;
	self.initLights = function() {
		graphics.background = graphics.createLayer();
		graphics.lights = [];
//		for (var ii=0; ii<lightSources.length; ii++)
//			graphics.lights.push( graphics.createLayer() );
		graphics.lightLayer = graphics.createLayer();
			
		var ctxt = graphics.background.getContext("2d");
		ctxt.fillStyle="#000000";
		ctxt.fillRect(0,0,graphics.width,graphics.height);
		
		self.computeLights();
		graphics.mark(0,0,graphics.width, graphics.height);
	}

	self.computeLights = function() {
		var baseCanvas = graphics.lightLayer;
		var baseCtxt = baseCanvas.getContext("2d");
	
		var canvas = document.createElement("canvas");
		canvas.width = graphics.width;
		canvas.height = graphics.height;
		var ctxt = canvas.getContext("2d");
			
		baseCtxt.clearRect(0,0,graphics.width,graphics.height);

		for (var ii=0; ii<lightSources.length; ii++) {
			var light = lightSources[ii];
			

//			var canvas = graphics.lights[ii];
//			var ctxt = canvas.getContext("2d");
	
			ctxt.clearRect(0,0,canvas.width,canvas.height);
			
			// first draw light circle
			var gradientActive = false;
			if (gradientActive) {
				var gradient = ctxt.createRadialGradient( light.x, light.y, 0, light.x, light.y, light.l);
				gradient.addColorStop(0, "#FFFFFF");
				gradient.addColorStop(1, "rgba(255,255,255,0)");
				ctxt.fillStyle = gradient;
			} else {
				ctxt.fillStyle = "rgba(255,255,255,0.4)";
			}
	
		    ctxt.beginPath();
	    	ctxt.arc(light.x, light.y, light.l, 0, Math.PI*2,true);
	    	ctxt.closePath();
	    	ctxt.fill();
	    	
	    	ctxt.globalCompositeOperation = "destination-out"
	    	ctxt.fillStyle = "#FFFFFF";
	    	
	    	// now cut the shadows
	    	for (var jj=0; jj<shapes.length; jj++) {
	    		var shape = shapes[jj];
	    		
	    		// 1. find the projections of the points
	    		var proj = [];
	    		var maxAngle = -Math.PI-1;
	    		var minAngle = Math.PI+1;
	    		var minPoint = -1;
	    		var maxPoint = -1;
	    		for (var kk=0; kk<shape.length; kk++) {
	    			var angle = Math.atan2(shape[kk][1] - light.y, shape[kk][0] - light.x);
	    			// 10 pixels extra radius
	    			proj.push([
	    					light.x + Math.cos(angle) * (light.l + 10),
	    					light.y + Math.sin(angle) * (light.l + 10),
	    					angle]);
	    			if (angle > maxAngle) {
	    				maxAngle = angle;
	    				maxPoint = kk;
	    			}
	    			if (angle < minAngle) {
	    				minAngle = angle;
	    				minPoint = kk;
	    			}
	    		}
	
	    		var distCCw = maxAngle - minAngle + Math.PI*2;
	    		while (distCCw > Math.PI*2) distCCw -= Math.PI*2;
	    		var distCw = minAngle - maxAngle + Math.PI*2;
	    		while (distCw > Math.PI*2) distCw -= Math.PI*2;
	    		
	    		ctxt.beginPath();
	    		ctxt.moveTo(proj[minPoint][0], proj[minPoint][1]);
	    		ctxt.arc(light.x, light.y, light.l, minAngle, maxAngle, (distCCw > distCw));
	    		ctxt.lineTo(shape[maxPoint][0], shape[maxPoint][1]);
	    		ctxt.lineTo(shape[minPoint][0], shape[minPoint][1]);
	    		ctxt.fill();
	    	}
	    	
	    	ctxt.globalCompositeOperation = "source-over";
	    	ctxt.fillStyle = "#FFFFFF";
	    	// put the light itself
	    	ctxt.beginPath();
	    	ctxt.arc(light.x, light.y, 3, 0, Math.PI*2,true);
	    	ctxt.fill();
	    	baseCtxt.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
		}
		graphics.mark(0,0,graphics.width, graphics.height);
	}

	self.drawShapes = function() {
		for (var ii=0;ii<shapes.length;ii++) {
			ctxt = graphics.shapesLayer.getContext("2d");
			
			ctxt.fillStyle = "#FF0000";
			ctxt.beginPath();
			ctxt.moveTo(shapes[ii][0][0], shapes[ii][0][1]);
			for (var jj=1; jj<shapes[ii].length; jj++) {
				ctxt.lineTo(shapes[ii][jj][0], shapes[ii][jj][1]);
			}
			ctxt.closePath();
			ctxt.fill();
		}
	}
	}
	