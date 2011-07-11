var LightsManager = function () {
	var self = this;
	self.candlePic = new Image();
    self.candlePic.src = "graphics/objects/candle-20x26.png";
	
	self.complete = function() {
		return self.candlePic.complete;
	}
	
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

	self.computeLights0 = function() {
		var baseCanvas = graphics.lightLayer;
		var baseCtxt = baseCanvas.getContext("2d");
	
		var canvas = document.createElement("canvas");
		canvas.width = graphics.width;
		canvas.height = graphics.height;
		var ctxt = canvas.getContext("2d");
			
		baseCtxt.clearRect(0,0,graphics.width,graphics.height);

		for (var ii=0; ii<lightSources.length; ii++) {
			var light = lightSources[ii];
			
			if (!light.active) 
				continue;

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
	    	if (false) {
		    	ctxt.beginPath();
		    	ctxt.arc(light.x, light.y, 3, 0, Math.PI*2,true);
		    	ctxt.fill();
	    	} 
	    	baseCtxt.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
		}
		
		if (true) {
			for (var ii=0; ii<lightSources.length; ii++) {
				if (lightSources[ii].active)
	    		baseCtxt.drawImage(self.candlePic, lightSources[ii].x - self.candlePic.width/2, lightSources[ii].y-self.candlePic.height/2);
	    	}
	   	}
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
			
			if (!light.active) 
				continue;

			ctxt.fillStyle = "rgba(255,255,255,0.4)";
			ctxt.clearRect(0,0,canvas.width, canvas.height);
			ctxt.fillRect(0,0,canvas.width,canvas.height);
		    
	    	
	    	ctxt.globalCompositeOperation = "destination-out"
	    	ctxt.fillStyle = "#FFFFFF";
	    	
	    	var dist1 = -1;
	    	var index1 = -1;
	    	// now cut the shadows
	    	for (var jj=0; jj<shapes.length; jj++) {
	    		var shape = shapes[jj];
	    		
	    		// 1. find the projections of the points
	    		var proj = [];
	    		var minPoint = -1;
	    		var maxPoint = -1;
	    		for (var kk=0; kk<shape.length; kk++) {
	    			var dx = shape[kk][0] - light.x;
	    			var dy = shape[kk][1] - light.y;
	    			
	    			var xp, yp;
	    			if (dx < 0) {
	    				yp = light.y - light.x * dy / dx; 
	    			} else if (dx > 0) {
	    				yp = light.y + (graphics.width - light.x) * dy / dx;
	    			} else yp = dy<=0? 0 : graphics.height;
	    			
	    			if (dy < 0) {
	    				xp = light.x - light.y * dx / dy;
	    			} else if (dy > 0) {
	    				xp = light.x + (graphics.height - light.y) * dx / dy;
	    			} else xp = dx<=0? 0 : graphics.width;
	    			
	    			var xp2 = xp, yp2 = yp;
	    			
	    			if (yp < 0 || yp > graphics.height) {
	    				xp = dx<=0? 0 : graphics.width;
	    				yp2 = yp<0? 0 : graphics.height; 
	    			}
	    			if (xp < 0 || xp > graphics.width) {
	    				yp = dy<=0? 0: graphics.height;
	    				xp2 = xp<0? 0 : graphics.width;
	    			}
	    			proj.push([xp, yp, xp2, yp2]);
	    			
	    			if (kk > 0) {
	    				dx = (xp2-proj[0][2]);
	    				dy = (yp2-proj[0][3]);
	    				var dist = dx*dx+dy*dy;
	    				if (dist > dist1) {
	    					dist1 = dist;
	    					index1 = kk;
	    				}
	    			}
	    		}
	    		
	    		// find point 2
	    		var dist2 = -1;
	    		var index2 = -1;
	    		for (var kk=0; kk<proj.length; kk++) {
	    			if (kk==index1) continue;
	    			var dx = proj[kk][2] - proj[index1][2];
	    			var dy = proj[kk][3] - proj[index1][3];
	    			var dist = dx*dx+dy*dy;
	    			if (dist > dist2) {
	    				dist2 = dist;
	    				index2 = kk;
	    			}
 	    		}
 	    		
 	    		index1 = -1;
 	    		dist1 = -1;
 	    		for (var kk=0; kk<proj.length; kk++) {
 	    			if (kk == index2) continue;
	    			var dx = proj[kk][2] - proj[index2][2];
	    			var dy = proj[kk][3] - proj[index2][3];
	    			var dist = dx*dx+dy*dy;
	    			if (dist > dist1) {
	    				dist1 = dist;
	    				index1 = kk;
	    			}
 	    		}
	    		
	    		ctxt.beginPath();
	    		ctxt.moveTo(proj[index1][0], proj[index1][1]);
				ctxt.lineTo(proj[index2][0], proj[index2][1]);
				ctxt.lineTo(shape[index2][0], shape[index2][1]);
	    		ctxt.lineTo(shape[index1][0], shape[index1][1]);
	    		ctxt.fill();
	    	}
	    	
	    	ctxt.globalCompositeOperation = "source-over";
	    	ctxt.fillStyle = "#FFFFFF"; 
	    	baseCtxt.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
		}
		
		for (var ii=0; ii<lightSources.length; ii++) {
			if (lightSources[ii].active)
	    	baseCtxt.drawImage(self.candlePic, lightSources[ii].x - self.candlePic.width/2, lightSources[ii].y-self.candlePic.height/2);
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
	