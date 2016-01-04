window.onload = function() {
	TagCanvas.interval = 20;
	TagCanvas.textFont = 'Oswald, Impact,Arial Black,sans-serif';
	TagCanvas.textColour = '#00f';
	TagCanvas.textHeight = 25;
	TagCanvas.outlineColour = '#f96';
	TagCanvas.outlineThickness = 0;
	TagCanvas.maxSpeed = 0.06;
	TagCanvas.minBrightness = 0.1;
	TagCanvas.depth = 0.92;
	TagCanvas.pulsateTo = 0.2;
	TagCanvas.pulsateTime = 0.75;
	TagCanvas.initial = [0.1,-0.1];
	TagCanvas.decel = 0.98;
	TagCanvas.reverse = true;
	TagCanvas.hideTags = false;
	TagCanvas.shadow = '#ccf';
	TagCanvas.shadowBlur = 3;
	TagCanvas.weight = true;
	TagCanvas.weightFrom = 'data-weight';
  TagCanvas.fadeIn = 800;
	try {
		TagCanvas.Start('tagcanvas','taglist', { weightMode: 'both' });	
		
// var g1 = {
//  0:   'red',
//  0.5: 'orange',
//  1:   'rgba(0,0,0,0.1)'
// }
		// TagCanvas.Start('tagcanvas','weightTags', { weightMode: 'both', weightGradient: g1 });
	} catch(e) {
	}
};