var graphics = new GraphicsManager();
var lightsManager = new LightsManager();
var gameControl = new GameControl();
var keyManager = new KeyManager();
var player = new Player(200, 200);

function loaderProgress() {
	return player.complete() ? 100 : 0;
}

function prepareGame() {
	var canvas = document.getElementById("gameCanvas");
	var ctxt = canvas.getContext("2d");
	
	graphics.init();
	lightsManager.initLights();
	graphics.shapesLayer = graphics.createLayer();
	graphics.peopleLayer = graphics.createLayer();
	lightsManager.drawShapes();
	graphics.redraw();
	
	player.init();
	player.keys = keyManager.appendMapping([
		["up", 38],
		["down", 40],
		["left", 37],
		["right", 39],
		["space", 32]
	] );
}

function launchGame() {
	gameControl.start();
}

function update(dt) {
	player.update(dt);
}

function draw(dt) {
	player.undraw(dt);
	player.draw(dt);
	if (lightsManager.dirty) {
		lightsManager.computeLights();
		graphics.redraw();
		lightsManager.dirty = false;
	}
	
}
