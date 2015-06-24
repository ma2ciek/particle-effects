var ColorPicker = (function() {

	var canvas, ctx;
	var position = {}
	var radius;
	var currentInstance;
	var rainbow;

	function ColorPicker(_center, _radius, _currentColor) {
		EventEmitter.call(this);

		position.x = _center.x;
		position.y = _center.y;
		radius = _radius;

		currentInstance = this;

		if (canvas) {
			moveToNewPosition();
		} else {
			createCanvas();
			moveToNewPosition();
			rainbow = new Rainbow();
		}
		rainbow.draw();
		checkRainbowPixel(_currentColor);

		// To be sure that events bubble up:
		setTimeout(showCanvas, 0);
	};
	ColorPicker.prototype = new EventEmitter();
	ColorPicker.prototype.constructor = ColorPicker;

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
		style.left = ((position.x - radius) | 0) + 'px';
		style.top = ((position.y - radius) | 0) + 'px';
	}


	function Rainbow() {
		this.imgData = ctx.createImageData(radius << 1, radius << 1);
		this.pixels = new Uint32Array(this.imgData.data.buffer);
		var ratio = 255 / radius;

		for (var i = 0; i < this.pixels.length; i++) {
			var v = Vector.createFromFlapArray(radius, i);
			if (v.size > radius)
				continue;

			var distRatio = v.size * ratio;
			var RGB = this.createRGBFromVector(v);
			this.setPixel(i, RGB, distRatio);
		}
	}

	Rainbow.prototype.draw = function() {
		ctx.putImageData(this.imgData, 0, 0);
	};



	Rainbow.prototype.createRGBFromVector = function(vector) {
		var angleByPi = this.calculateAngle(vector);
		var RGB = this.createPrimaryColorsFromAngle(angleByPi);
		this.separatePrimaryColors(RGB);
		return RGB;
	};

	// returns values from 0 to 2
	Rainbow.prototype.calculateAngle = function(vector) {
		return new AngleByPi(Math.atan2(vector[1], vector[0]) / Math.PI + 1);
	};

	Rainbow.prototype.createPrimaryColorsFromAngle = function(angleByPi) {
		return [
			angleByPi.distanceFrom(3 / 6),
			angleByPi.distanceFrom(7 / 6),
			angleByPi.distanceFrom(11 / 6)
		];
	};

	Rainbow.prototype.separatePrimaryColors = function(RGB) {
		for (var j = 0; j < RGB.length; j++) {
			RGB[j] *= 3;
			if (RGB[j] < 1)
				RGB[j] = 0;
			else if (RGB[j] > 2)
				RGB[j] = 1;
			else {
				RGB[j] = RGB[j] - 1;
			}
		}
	};

	Rainbow.prototype.setPixel = function(i, RGB, distRatio) {
		this.pixels[i] =
			RGB[0] * distRatio | // red
			RGB[1] * distRatio << 8 | // green
			RGB[2] * distRatio << 16 | // blue
			255 << 24; // opacity
	}

	function checkRainbowPixel(color) {
		var c = Color.fromHex(color).getRGB();
		var min = Math.min.apply(null, c);
		var max = Math.max.apply(null, c);

		if(min === max) {
			addCheck(new Point(radius | 0, radius | 0));
			return;
		}

		var minIndex = c.indexOf(min);

		var r = max / 255 * radius;

		var afterMin = (minIndex + 1) % 3;
		var beforeMin = (minIndex + 2) % 3;

		var a = new AngleByPi(3 / 2 - minIndex * 2 / 3);
		a.add((c[afterMin] - c[beforeMin]) / max / 3);
		a.normalize();

		var x = r * Math.cos(a.angle * Math.PI);
		var y = -r * Math.sin(a.angle * Math.PI);

		addCheck(new Point(x+radius | 0, y+radius | 0), c);
	}

	function addCheck(p, color) {
		var c = color || ctx.getImageData(p.x, p.y, 1, 1).data;
		var r = 25;

		var imgData = ctx.getImageData(p.x - r, p.y - r, 2 * r, 2 * r);
		var pixels = new Uint32Array(imgData.data.buffer);
		for (var i = 0; i < pixels.length; i++) {
			var v = Vector.createFromFlapArray(r, i);
			if (v.size > r || v.size < r * 3/4)
				continue;

			pixels[i] = c[0] | (c[1] << 8) | (c[2] << 16) | (255 << 24);	
		}
		ctx.putImageData(imgData, p.x - r, p.y - r);
	}

	var clicked = false;

	function mouseDown () {
		clicked = true;
	}

	function mouseUp() {
		clicked = false;
	}

	function showCanvas() {
		canvas.style.visibility = 'visible';
		canvas.addEventListener('click', getColor);
		document.addEventListener('click', hideCanvas);
		document.addEventListener('contextmenu', hideCanvas);

		document.addEventListener('mousemove', mouseMove);
		canvas.addEventListener('mousedown', mouseDown);
		canvas.addEventListener('mouseup', mouseUp);
	}

	function hideCanvas(e) {
		canvas.style.visibility = 'hidden';
		canvas.removeEventListener('click', getColor);
		document.removeEventListener('click', hideCanvas);
		document.removeEventListener('contextmenu', hideCanvas);

		document.removeEventListener('mousemove', mouseMove);
		canvas.removeEventListener('mousedown', mouseDown);
		canvas.removeEventListener('mouseup', mouseUp);

		e && e.preventDefault();
	}

	function getColor(e) {
		var point = new Point(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
		var px = ctx.getImageData(point.x, point.y, 1, 1).data;
		if (px[3] === 255) {
			var color = Color.fromArr(px);

			rainbow.draw();
			addCheck(point);

			currentInstance.emit('color', color);
			e.stopPropagation();
		}
	}

	function mouseMove(e) {
		var point = new Point(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);

		if(clicked) {
			getColor.call(e.target, e);
		}


	}

	return ColorPicker;
})();