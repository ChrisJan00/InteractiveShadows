// USAGE:  you have to overload these interface functions.  You will then get an object called gameControl.  Just call
// gameControl.start() to start the game, gameControl.stop() to finish it (it will just stop working, no restarting possible)
// at any time you can change the fps through gameControl.fps and the time per update in gameControl.updateStep

// Interface functions:

// This function is called periodically while the game is loading.  You should return an estimation of the percent loaded.
// The period is specified in gameControl.loadInterval.  You have to manually check that all content (images/sounds).
function loaderProgress()
{
    return 100;
}

// This function is called for you to display the load screen.  The percent returned by loaderProgress is given
function displayLoadScreen( progress )
{ }

// This function will be called when 100% content is loaded, once, at the start of the game.  You can assume that all content
// is available.
function prepareGame()
{ }

// Use this function to update the simulation.  dt will be the same as gameControl.updateStep, given in ms
function update(dt) 
{ }

// Use this function to update the graphics, using the game state computed in "update".  dt is given in milliseconds and represents
// elapsed time since the last call to dt.  Use it to interpolate the graphics and achieve a smoother simulation, although you can
// safely ignore it if you want (no interpolation at all).
function draw(dt)
{ }

//--------------------------------------------------------------------------------------------------
// control class
var GameControl = function() {
	var self = this;
    self.fps = 60;
    self.updateStep = 10; // ms
    self.loadInterval = 500; // ms
    
    // private parts
    self.startTime = new Date().getTime();
    self.stopTime = self.startTime;
    self.elapsed = 0;
    self.dt = 0; // ms
    self.skip = false;
    self.start = function() {
	var progress = loaderProgress();
	if (progress < 100) {
	    setTimeout(self.start,self.loadInterval); // wait 500ms
	    displayLoadScreen(progress);
	} else {
	    prepareGame();
	    self.runInterval = setInterval(self.mainLoop, 1000/self.fps);
	}
    }
    self.stop = function() {
        clearInterval( self.runInterval );
    }

    self.mainLoop = function() {
	if (self.skip)
	    return;
	else
	    self.skip = true

	// control the time
	self.stopTime = new Date().getTime();
	self.elapsed = self.stopTime - self.startTime;
	self.startTime = self.stopTime;
	self.dt = self.dt + self.elapsed;
	
	while(self.dt > self.updateStep) {
	    update( self.updateStep );
	    self.dt = self.dt - self.updateStep;
	}
    
	// dt is passed for interpolation
	draw(self.dt);
	
	self.skip = false
    }
}
