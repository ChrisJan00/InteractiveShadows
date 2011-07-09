CollisionsManager = function(){
	var self = this;
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
}

collisions = new CollisionsManager();
