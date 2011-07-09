// usage:

// first you have to define an array of pairs that are your key mappings
// first element of the pair is a string with the name you want to use to refer to the key
// second element is an integer with the key's ascii code

// example:
// var keyMappings = [
	// ["up", 38],
    // ["down", 40],
    // ["left", 37],
    // ["right", 39]
// ];

// they you use the key manager in the global namespace to pass it your list of keys
// and you'll get an object in return.  You can know if one of the keys you defined
// is pressed by calling check( keyName ), where keyName is your string.  The global
// key manager takes care of the rest.

// example:
// var playerKeys = GLOBAL.keyManager.appendMapping( keyMappings );
// playerKeys.check('up');


// ----------------------------------------------------------------
// implementation

// keyboard input
var KeyManager = function() {
	var self = this;
	self.keyMappings = [];
	self.keyFlags = [];
	
	// you pass a mapping array, returns an index you need for checking
	self.appendMapping = function(newMapping) {
		var newIndex = self.keyMappings.length;
		self.keyMappings.push(newMapping);
		// initialize empty flags
		self.keyFlags.push([]);
		for (var ii=0;ii<newMapping.length;ii++) {
			self.keyFlags[newIndex][newMapping[ii][0]] = false;
		}
		
		var km = self;
		
		return new( function() {
			var self = this;
			self.index = newIndex;
			self.check = function( keyName ) {
				return km.keyFlags[self.index][keyName];
			}
			self.clicked = function( keyName ) {
				if (km.keyFlags[self.index][keyName]) {
					km.keyFlags[self.index][keyName] = false;
					return true;
				}
				return false;
			}
		} );
	}

    document.onkeydown = function(event) { self.switchKey( event.keyCode, true ); }
	document.onkeyup = function(event) { self.switchKey( event.keyCode, false ); }
	self.switchKey = function( code, pressed ) {
		var setIndex, pairIndex;
		for(setIndex=0; setIndex<self.keyMappings.length; setIndex++) {
			var set = self.keyMappings[setIndex];
			for (pairIndex=0; pairIndex<set.length; pairIndex++)
				if (code == set[pairIndex][1]) {
					self.keyFlags[setIndex][set[pairIndex][0]] = pressed;
				}
		}
    }
}
