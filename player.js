//var AnimationControl = function(indices) {
//	var self = this;
//	self.frameIndices = indices.slice();
//	self.frameIndex = 0;
//	self.updateFrame = function() {
//		self.frameIndex = (self.frameIndex+1)%self.frameIndices.length;
//	}
//	self.currentFrame = function() {
//		return self.frameIndices[self.frameIndex];
//	}
//}

var Player = function(x,y) {
	var self = this;
	
	self.keys = new( function() { this.check = function( str ) { return false; } } );
	//self.animationStrip = new Image();
    //self.animationStrip.src = "graphics/Player1.png";
    //self.standingIndices = new AnimationControl([0]);
	//self.walkingIndices = new AnimationControl([1,2,3]);
	//self.jumpingIndices = new AnimationControl([4,5,6]);
	//self.dyingIndices = new AnimationControl([7,8]);
	//self.animationControl = self.standingIndices;
	//self.stripChoice = 0;
	
	self.x = x;
	self.y = y;
	self.ix = x;
	self.iy = y;
	self.vx = 0;
	self.vy = 0;
	self.speed = 200;
	self.drag = 0.04;
	self.accel = 0.1;
	self.w = 16;
	self.h = 16;
	self.frameCount = 9;
	self.currentFrame = 0;
	self.dts = 0;
	//self.gravityBlock = false;
	//self.gravityCap = 2;
	//self.jumpStrength = 1.15;
	//self.frameDelay = 100;
	//self.frameTimer = self.frameDelay;
	//self.lookingRight = true;
	
	self.complete = function() {
	//	if (!self.animationStrip.complete)
	//		return false;
		return true;
	}
	
	self.init = function () {
	//	self.prepareAnimationAngles();
	}
	
	self.update = function(dt) {
		self.dts = dt/1000;
		
		self.parseKeys();	
		
		var candidatePos = self.updatedPos();
		if (!collisions.checkWallCollisions(candidatePos.x,candidatePos.y,self.w,self.h)) {
			self.x = candidatePos.x;
			self.y = candidatePos.y;
		} else {
			self.vx = 0;
			self.vy = 0;
		}
		
		// animation
		//self.frameTimer -= dt;
		//if (self.frameTimer<=0) {
		//	self.updateFrame();
		//	self.frameTimer = self.frameDelay;
		//}
		
		//self.updateStripChoice();
	}
	
	//self.updateFrame = function() {
	//	if (self.standing()) {
	//		if (((GLOBAL.gravityDir==0||GLOBAL.gravityDir==1) && self.vx!=0) || 
	//			((GLOBAL.gravityDir==2||GLOBAL.gravityDir==3) && self.vy!=0)) {
	//			self.animationControl = self.walkingIndices;
	//		} else {
	//			self.animationControl = self.standingIndices;
	//		}
	//	} else {
	//		self.animationControl = self.jumpingIndices;
	//	}
	//	
	//	self.animationControl.updateFrame();
	//} 
	
	//self.updateStripChoice = function() {
	//	switch(GLOBAL.gravityDir) {
	//		case 0:
	//			if (self.vx>0) self.lookingRight = true;
	//			if (self.vx<0) self.lookingRight = false;
	//			self.stripChoice = self.lookingRight?0:1; 
	//		break;
	//		case 1: 
	//			if (self.vx>0) self.lookingRight = true;
	//			if (self.vx<0) self.lookingRight = false;
	//			self.stripChoice = self.lookingRight?2:3;
	//		break;
	//		case 2:
	//			if (self.vy>0) self.lookingRight = true;
	//			if (self.vy<0) self.lookingRight = false;
	//			self.stripChoice = self.lookingRight?4:5;
	//		break;
	//		case 3:
	//			if (self.vy>0) self.lookingRight = true;
	//			if (self.vy<0) self.lookingRight = false;
	//			self.stripChoice = self.lookingRight?6:7;
	//		break;
	//	}
	//}
	
	self.updatedPos = function() {
		var retVal = {}
		retVal.x = Math.floor(self.x + self.vx * self.speed * self.dts + 0.5);
		retVal.y = Math.floor(self.y + self.vy * self.speed * self.dts + 0.5);
		return retVal;
	}
	
	//self.standing = function() {
	//	switch(GLOBAL.gravityDir) {
	//	case 0:
	//		return GLOBAL.level.collided(self.x, self.y + self.speed*self.dts, self.w, self.h);
	//	case 1:
	//		return GLOBAL.level.collided(self.x, self.y - self.speed*self.dts, self.w, self.h);
	//	case 2:
	//		return GLOBAL.level.collided(self.x - self.speed*self.dts, self.y, self.w, self.h);
	//	case 3:
	//		return GLOBAL.level.collided(self.x + self.speed*self.dts, self.y, self.w, self.h);
	//	}
	//}
	
	//self.applyGravity = function() {
	//	switch(GLOBAL.gravityDir) {
	//		case 0: self.vy = Math.min(self.gravityCap, self.vy + self.dts * GLOBAL.gravity/self.speed); break;
	//		case 1: self.vy = Math.max(-self.gravityCap, self.vy - self.dts * GLOBAL.gravity/self.speed); break;
	//		case 2: self.vx = Math.max(-self.gravityCap, self.vx - self.dts * GLOBAL.gravity/self.speed); break;
	//		case 3: self.vx = Math.min(self.gravityCap, self.vx + self.dts * GLOBAL.gravity/self.speed); break;
	//	}
	//}
	
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
			ctxt.fillStyle = "#00FF00";
			ctxt.fillRect(self.ix, self.iy, self.w, self.h);
			graphics.mark(self.ix, self.iy, self.w, self.h);
			graphics.redraw();
		}
	
	}
	
//	self.prepareAnimationAngles = function() {
//		self.strips = [];
//		
//		for (var i=0;i<8;i++)
//			self.strips[i] = self.modifiedStrip(i);
//	}
	
		
//	self.modifiedStrip = function( stripIndex ) {
//		var canvas = document.createElement('canvas');
//		var ctx = canvas.getContext('2d');
//		
//		var fc = self.animationStrip.width / self.w;
//		for (var i=0;i<fc;i++) {
//			
//			switch (stripIndex) {
//			case 1: // dl
//				ctx.translate((i*2+1)*self.w, 0);
//				ctx.scale(-1, 1);
//				break;
//			case 2: // ur
//				ctx.translate(0, self.h);
//				ctx.scale(1, -1);
//				break;
//			case 3: // ul
//				ctx.translate((i*2+1)*self.w, self.h);
//				ctx.scale(-1, -1);
//				break;
//			case 4: // ld
//				ctx.translate((i+1)*self.w, -self.h*i);
//				ctx.rotate(GLOBAL.PI / 2);
//				break;
//			case 5: // lu
//				ctx.translate((i+1)*self.w, self.h*(i+1));
//				ctx.scale(1, -1);
//				ctx.rotate(GLOBAL.PI / 2);
//				break;
//			case 6: // rd
//				ctx.translate(i*self.w, -self.h*i);
//				ctx.scale(1, -1);
//				ctx.rotate(-GLOBAL.PI / 2);
//				break;
//			case 7: // ru
//				ctx.translate(i*self.w, self.h*(i+1));
//				ctx.rotate(-GLOBAL.PI / 2);
//				break;
//			
//			}
//			
//			ctx.drawImage(self.animationStrip, i*self.w,0,self.w,self.h, i*self.w,0,self.w,self.h);
//			
//			// reset (we don't want to acumulate transformations)
//			ctx.setTransform(1,0,0,1,0,0);
//		}
//		
//		return canvas;
//	}
	
}
