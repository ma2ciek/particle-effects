var ColorPicker = (function() {

	var exist;
	var canvas, ctx;
	var position = {}
	var radius;
	var currentColor;
	var currentInstance;
	var ee = new EventEmitter();


	function ColorPicker(_center, _radius, _currentColor) {
		EventEmitter.call(this);
		console.log(this);
		this.dispatch();
		position.x = _center.x;
		position.y = _center.y;
		radius = _radius;

		if (currentInstance) {
			moveToNewPosition();
		} else {
			currentInstance = this;
			createCanvas();
			moveToNewPosition();
			createRainbow();
		}
		showCanvas();

		this.setColor(_currentColor);
	};
	copy(Color.prototype, new EventEmitter);

	ColorPicker.prototype.setColor = function(_currentColor) {
		// to implement
		currentColor = _currentColor;
	}

	function createCanvas() {
		canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d');
		canvas.id = 'color-picker';
		canvas.width = radius * 2;
		canvas.height = radius * 2;
		document.body.appendChild(canvas);
	}

	function moveToNewPosition() {
		var style = canvas.style;
		style.left = (position.x - radius) | 0 + 'px';
		style.top = (position.y - radius) | 0 + 'px';
	}

	function angleDistance(ang1, ang2) { // angles are form 0 to 2
		diff = (ang1 - ang2) % 2;
		diff = Math.abs(diff);
		return diff <= 1 ?
			diff :
			2 - diff;
	}

	function createRainbow() {
		var diameter = radius * 2;
		var imageData = ctx.createImageData(diameter, diameter);
		var pixels = new Uint32Array(imageData.data.buffer);

		var ratio = 255 / diameter;


		for (var i = 0; i < pixels.length; i++) {
			var x = i % diameter;
			var y = i / diameter | 0;

			var v = new Vector([radius - x, radius - y]);

			var distRatio = v.size * 505 / diameter;
			if (distRatio > 255)
				continue;

			var angleByPi = Math.atan2(v[1], v[0]) / Math.PI + 1; // (from 0 to 2)

			var colors = [ //rgb;
				angleDistance(3 / 6, angleByPi),
				angleDistance(7 / 6, angleByPi),
				angleDistance(11 / 6, angleByPi),
			];

			for (var j = 0; j < colors.length; j++) {
				colors[j] *= 3;
				if (colors[j] < 1)
					colors[j] = 0;
				else if (colors[j] > 2)
					colors[j] = 1
				else {
					colors[j] = colors[j] - 1;
				}
			}

			pixels[i] =
				colors[0] * distRatio | // red
				colors[1] * distRatio << 8 | // green
				colors[2] * distRatio << 16 | // blue
				255 << 24; // opacity
		}

		ctx.putImageData(imageData, 0, 0);
	}

	function showCanvas() {
		canvas.style.visibility = 'visible';
		canvas.addEventListener('click', getColor);
		document.addEventListener('click', hideCanvas);
		document.addEventListener('contextmenu', hideCanvas);
	}

	function hideCanvas(e) {
		canvas.style.visibility = 'hidden';
		canvas.removeEventListener('click', getColor);
		document.removeEventListener('click', hideCanvas);
		document.removeEventListener('contextmenu', hideCanvas);
		e && e.preventDefault();
	}

	function getColor(e) {
		console.log(currentInstance);
		var point = new Point(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
		var px = ctx.getImageData(point.x, point.y, 1, 1).data;
		if (px[3] === 255) {
			currentInstance.trigger('color', px);
			e.stopPropagation();
		}
	}

	return ColorPicker;
})();