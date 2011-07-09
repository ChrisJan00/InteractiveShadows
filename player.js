var AnimationControl = function(indices) {
	var self = this;
	self.frameIndices = indices.slice();
	self.frameIndex = 0;
	self.updateFrame = function() {
		self.frameIndex = (self.frameIndex+1)%self.frameIndices.length;
	}
	self.currentFrame = function() {
		return self.frameIndices[self.frameIndex];
	}
}

var Player = function(x,y) {
	var self = this;
	
	self.keys = new( function() { this.check = function( str ) { return false; } } );
	self.animationStrip = new Image();
    self.animationStrip.src = "char_am_01.png";
    self.standingIndices = new AnimationControl([1]);
	self.walkingRightIndices = new AnimationControl([0,1,2,1]);
	self.walkingLeftIndices = new AnimationControl([0,1,2,1]);
	self.walkingUpIndices = new AnimationControl([0,1,2,1]);
	self.walkingDownIndices = new AnimationControl([0,1,2,1]);
	
	self.animationControl = self.standingIndices;
	self.stripChoice = 0;
	
	self.x = x;
	self.y = y;
	self.ix = x;
	self.iy = y;
	self.vx = 0;
	self.vy = 0;
	self.speed = 200;
	self.drag = 0.04;
	self.accel = 0.1;
	self.w = 13;
	self.h = 28;
	self.currentFrame = 0;
	self.dts = 0;
	self.frameDelay = 150;
	self.frameTimer = self.frameDelay;
	
	self.complete = function() {
		if (!self.animationStrip.complete)
			return false;
		return true;
	}
	
	self.init = function () {
	}
	
	self.update = function(dt) {
		self.dts = dt/1000;
		
		self.parseKeys();	
		
		var candidatePos = self.updatedPos();
		//if (!GLOBAL.level.collided(candidatePos.x,candidatePos.y,self.w,self.h)) {
		if (true) {
			self.x = candidatePos.x;
			self.y = candidatePos.y;
		} else {
			self.vx = 0;
			self.vy = 0;
		}
		
		// animation
		self.frameTimer -= dt;
		if (self.frameTimer<=0) {
			self.updateFrame();
			self.frameTimer = self.frameDelay;
		}
	}
	
	self.updateFrame = function() {
		if (self.vx > 0) {
			self.animationControl = self.walkingRightIndices;
		} else
		if (self.vx < 0) {
			self.animationControl = self.walkingLeftIndices;
		} else
		if (self.vy < 0) {
			self.animationControl = self.walkingUpIndices;
		} else
		if (self.vy > 0) {
			self.animationControl = self.walkingDownIndices;
		} else {
			self.animationControl = self.standingIndices;
		}
		
		self.animationControl.updateFrame();
	} 
	
	self.updatedPos = function() {
		var retVal = {}
		retVal.x = Math.floor(self.x + self.vx * self.speed * self.dts + 0.5);
		retVal.y = Math.floor(self.y + self.vy * self.speed * self.dts + 0.5);
		return retVal;
	}
	
	self.parseKeys = function() {
		var mx = 0;
		var my = 0;
		if (self.keys.check("up"))
			my = -1;
		if (self.keys.check("down"))
			my = 1;
		if (self.keys.check("left"))
			mx = -1;
		if (self.keys.check("right"))
			mx = 1;
				
		self.vx = self.vx + mx * self.accel;
		self.vy = self.vy + my * self.accel;
				
		if (self.vx-self.drag>0)
			self.vx -= self.drag;
		else if (self.vx+self.drag<0)
			self.vx += self.drag;
		else
			self.vx = 0;
					
		if (self.vy-self.drag>0)
			self.vy -= self.drag;
		else if (self.vy+self.drag<0)
			self.vy += self.drag;
		else
			self.vy = 0;
				
		if (self.vx>1) self.vx=1;
		if (self.vx<-1) self.vx=-1;
		if (self.vy>1) self.vy=1;
		if (self.vy<-1) self.vy=-1;
	}
	
	self.undraw = function(dt) {
		if ((self.ix >=0) && (self.ix+self.w<=graphics.width) && (self.iy>=0) && (self.iy+self.h<=graphics.height)) {
		//	GLOBAL.gameContext.drawImage(GLOBAL.bgCanvas, self.ix, self.iy, self.w, self.h, self.ix, self.iy, self.w, self.h);
			var ctxt = graphics.peopleLayer.getContext("2d");
			ctxt.clearRect(self.ix, self.iy, self.w, self.h);
			graphics.mark(self.ix, self.iy, self.w, self.h);
			//graphics.redraw();
		}
	}
	
    self.draw = function(dt) {
		self.dts = dt/1000;

		var candidatePos = self.updatedPos(); 
		self.ix = Math.round(candidatePos.x);
		self.iy = Math.round(candidatePos.y);
		
		if ((self.ix>=0) && (self.ix+self.w<=graphics.width) && (self.iy>=0) && (self.iy+self.h<=graphics.height)) {
			//GLOBAL.gameContext.drawImage(self.strips[self.stripChoice], 
			//	self.animationControl.currentFrame()*self.w, 0, self.w, self.h, self.ix, self.iy, self.w, self.h);
			var ctxt = graphics.peopleLayer.getContext("2d");
			//ctxt.fillStyle = "#00FF00";
			//ctxt.fillRect(self.ix, self.iy, self.w, self.h);
			ctxt.drawImage(self.animationStrip,
				self.animationControl.currentFrame()*self.w, 0, self.w, self.h, self.ix, self.iy, self.w, self.h);
			graphics.mark(self.ix, self.iy, self.w, self.h);
			graphics.redraw();
		}
	
	}
	
}
