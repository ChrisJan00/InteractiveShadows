CollisionsManager = function(){
	var self = this;
	//replace this with actual gamedata
	self.wallShapes = [[200, 120, 40, 20], //[300,120,20,60],
	//[200,220,100,60]
	]
	 
	self.checkWallCollisions = function(x, y, width, height) {
		var collided = false;
		for (var n = 0; n < self.wallShapes.length; n++) {
			wallShape = self.wallShapes[n];
			//check if any part of the rect is inside the wall
			if (wallShape[0] > x + width ||
					wallShape[0] + wallShape[2] < x ||
					wallShape[1] > y + height ||
					wallShape[1] + wallShape[3] < y) {
				//was outside box
			}
			else {
				collided = true;
			}
		}
		
		//check collisions with screen border
		if ((x < 0) || x > graphics.width || y < 0 || y > graphics.height) {
			collided = true;
		}
		
		return collided;
	}
	
	self.isInShadow = function (x,y) {
		var inShadow = true;
		var screenPixelColour = 1.0;
		//check all light source canvas layers and check is in shadow in all of them
		for (var ii = 0; ii < lightSources.length; ii++) {
			var canvas = graphics.lights[ii];
			var ctxt = canvas.getContext("2d");
			var pixelColour = ctxt.getImageData(x, y, 1, 1);
			//shadow level is stored in alpha channel, so check it is black
			if (pixelColour.data[3] != 0) {
				inShadow = false;
			}
		}
		return inShadow;
	}
	
	self.getShadowAtPoint = function(x,y){
		var baseCanvas = graphics.lightLayer;
		var baseCtxt = baseCanvas.getContext("2d");
		var pixelColour = baseCtxt.getImageData(x, y, 1, 1);
		return (pixelColour.data[3]);
	}
	
}

collisions = new CollisionsManager();