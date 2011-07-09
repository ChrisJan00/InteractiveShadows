var shapes = [
 [ [200, 120], [200, 140], [240, 140], [240, 120] ],
 [ [300, 120], [300, 180], [320, 180], [320, 120] ],
 [ [200, 220], [300, 280], [330, 240] ],
];

var lightSources = [
	{ x: 260, 
	  y: 200, 
	  l: 650 },
	{ x: 360, 
	  y: 150, 
	  l: 650 }
	  
];
 

function startGame() {
	var canvas = document.getElementById("gameCanvas");
	var ctxt = canvas.getContext("2d");
	
	graphics.init();
	initLights();
	graphics.shapesLayer = graphics.createLayer();
	graphics.peopleLayer = graphics.createLayer();
	drawShapes();
	graphics.redraw();
}

function initLights() {
	graphics.background = graphics.createLayer();
	graphics.lights = [];
	for (var ii=0; ii<lightSources.length; ii++)
		graphics.lights.push( graphics.createLayer() );
		
	var ctxt = graphics.background.getContext("2d");
	ctxt.fillStyle="#000000";
	ctxt.fillRect(0,0,graphics.width,graphics.height);
	
	computeLights();
	graphics.mark(0,0,graphics.width, graphics.height);
}

function computeLights() {
	for (var ii=0; ii<lightSources.length; ii++) {
		var light = lightSources[ii];
		var canvas = graphics.lights[ii];
		var ctxt = canvas.getContext("2d");

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

	}
}

function drawShapes() {
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

GraphicsManager = function() {
	var self = this;
	
	self.init = function() {
		self.gameCanvas = document.getElementById("gameCanvas");
		self.gameContext = self.gameCanvas.getContext("2d");
		self.width = self.gameCanvas.width;
		self.height = self.gameCanvas.height;
		
		self.layers = [];
		self.rect = false;
	}
	
	self.createLayer = function() {
		var newLayer = document.createElement("canvas");
		newLayer.width = self.width;
		newLayer.height = self.height;
		self.layers.push( newLayer );
		return newLayer;
	}
	
	self.getContext = function(layer) {
		return layer.getContext("2d");
	}
	
	self.mark = function(x,y,w,h) {
		if (!self.rect)
			self.rect = {
				x : x,
				y : y,
				width : w,
				height : h };
		else {
			var x1 = self.rect.x + self.rect.width;
			var y1 = self.rect.y + self.rect.height;
			self.rect.x = Math.min(x, self.rect.x);
			self.rect.y = Math.min(y, self.rect.y);
			self.rect.width = Math.max(x1, x+w) - self.rect.x;
			self.rect.height = Math.max(y1, y+h) - self.rect.y;
		}
			
		if (self.rect.x < 0) {
			self.rect.width = self.rect.width + self.rect.x;
			self.rect.x = 0;
		}
		if (self.rect.y < 0) {
			self.rect.height = self.rect.height + self.rect.y;
			self.rect.y = 0;
		}
		
		if (self.rect.x + self.rect.width > self.width)
			self.rect.width = self.width - self.rect.x;
		if (self.rect.y + self.rect.height > self.height)
			self.rect.height = self.height - self.rect.y;
	}
	
	self.redraw = function() {
		if (!self.rect)
			return;
		for (var ii=0; ii < self.layers.length; ii++)
			self.gameContext.drawImage(self.layers[ii], self.rect.x, self.rect.y, self.rect.width, self.rect.height, 
					self.rect.x, self.rect.y, self.rect.width, self.rect.height);
		self.rect = false;
	}
	
	self.clearBackground = function() {
		for (var ii=0; ii < self.layers.length; ii++)
			self.getContext(self.layers[ii]).clearRect(0, 0, self.width, self.height);
		self.bgContext.fillStyle = G.colors.white;
		self.bgContext.fillRect(0,0,self.width,self.height);
		self.mark(0,0, self.width, self.height);
	}
}


var graphics = new GraphicsManager();
