var graphics = new GraphicsManager();
var lightsManager = new LightsManager();

function startGame() {
	var canvas = document.getElementById("gameCanvas");
	var ctxt = canvas.getContext("2d");
	
	graphics.init();
	lightsManager.initLights();
	graphics.shapesLayer = graphics.createLayer();
	graphics.peopleLayer = graphics.createLayer();
	lightsManager.drawShapes();
	graphics.redraw();
}