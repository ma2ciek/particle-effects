function ParticularEffect() {
	EventEmitter.call(this);
}

extend(ParticularEffect, EventEmitter);

ParticularEffect.prototype.moveTo = function(point) {
	if (this._state !== 'growing')
		return;

	this._destinationX = point.x;
	this._destinationY = point.y;
	this._vector = new Vector(point.x - this._x, point.y - this._y);
	this.emit('startMoving');
};

ParticularEffect.prototype._move = function() {
	if (!this._vector)
		return;

	var w = this._width || this._radius;
	var h = this._height || this._radius;

	var dx = this._x - this._destinationX;
	var dy = this._y - this._destinationY;

	if (dx * dx + dy * dy < this._speed * this._speed) {
		this._x = this._destinationX;
		this._y = this._destinationY;
		this.emit('movedToTarget');
	} else {
		this._x += this._vector.unit[0] * this._speed;
		this._y += this._vector.unit[1] * this._speed;
	}
};

ParticularEffect.prototype._moveRandom = function() {
	var v = new Vector(rand(1), rand(1)).unit;

	this._x = this._origX + v[0] * this._speed;
	this._y = this._origY + v[1] * this._speed;
}


ParticularEffect.prototype._moveParticlesStraight = function() {
	for (var i = 0; i < this._particles.length; i++) {
		var particle = this._particles[i];
		particle.moveStraight();

		if (!particle.isAlive()) {
			this._particles.splice(i, 1);
			i--;
		}
	}
};

ParticularEffect.prototype._updateRadius = function() {
	if (this._radius < this._maxRadius) {
		this._radius += this._growingSpeed;
		this._oldTemperature = new Uint16Array(this._radius * this._radius * 4);
	}
};

ParticularEffect.prototype._createParticles = function() {
	var radius = this._radius;
	var max = Math.min(this._maxParticles - this._particles.length, this._particlesGrowth);
	for (var i = 0; i < max; i++) {
		this._createParticle();
	}
};

ParticularEffect.prototype._moveParticlesElliptical = function() {
	for (var i = 0; i < this._particles.length; i++) {
		var particle = this._particles[i];
		particle.moveElliptical();

		if (!particle.isAlive()) {
			this._particles.splice(i, 1);
			i--;
		}
	}
};

ParticularEffect.prototype._destroyIfInvisible = function() {
	if (this._particles.length !== 0)
		return;

	var arrSize = this._radius * this._radius * 4;
	var threshold = this._gradient.getThreshold(0).value;
	for (var i = 0; i < arrSize; i++) {
		if (this._oldTemperature[i] > threshold) {
			return;
		}
	}
	this.emit('dead');
};


ParticularEffect.prototype._calculateTemperature = function() {
	this._temperature = new Uint32Array(this._radius * this._radius << 2);
	for (var i = 0; i < this._particles.length; i++) {
		this._addTempFromParticle(this._particles[i]);
	}
};

ParticularEffect.prototype._addTempFromParticle = function(particle) {
	var pos = particle.getPosition();
	var origX = pos.x + this._radius;
	var origY = pos.y + this._radius;
	var size = particle.getSize();
	var memoryTempDist = this._tempDistribution[size];
	var xEnd = Math.min(origX + size, this._radius << 1);
	var yEnd = Math.min(origY + size, this._radius << 1);
	for (var x = Math.max(origX - size, 0); x <= xEnd; x++) {
		var MathAbsDiffX = Math.abs(origX - x);
		for (var y = Math.max(origY - size, 0); y <= yEnd; y++) {
			var MathAbsDiffY = Math.abs(origY - y);
			this._addTempFromPixel(memoryTempDist, MathAbsDiffX, MathAbsDiffY, x, y);
		}
	}
};

ParticularEffect.prototype._addTempFromPixel = function(mem, MathAbsDiffX, MathAbsDiffY, x, y) {
	var add = mem[MathAbsDiffX][MathAbsDiffY];
	if (add < this._drawingThreshold)
		return;
	var pixelPos = +(y * this._radius << 1) + x;
	this._temperature[pixelPos] +=add;
};

ParticularEffect.prototype._draw = function() {
	"use strict";
	var radius = this._radius;
	var diameter = radius * 2;
	var x = Math.floor(this._x);
	var y = Math.floor(this._y);

	var imageData = ctx.getImageData(x - radius, y - radius, diameter, diameter); // - override visible pixels
	// var imageData = ctx.createImageData(diameter, diameter); - override all pixels
	var pixelsView = new Uint32Array(imageData.data.buffer);

	var threshold = this._gradient.getThreshold(0).value;
	var size = diameter * diameter;
	var whiteColour =  255 | 255 << 8 | 255 << 16 | 255 << 24;

	for (var pixelPos = 0; pixelPos < size; pixelPos++) {
		this._drawPixel(pixelsView, pixelPos, threshold);
	}

	this._oldTemperature = this._temperature;
	ctx.putImageData(imageData, x - radius, y - radius);
};

ParticularEffect.prototype._drawPixel = function(arrView, pixelPos, threshold) {
	"use strict";
	this._temperature[pixelPos] += this._oldTemperature[pixelPos] * this._contrailFactor | 0; //efekt smugi;
	var value = this._temperature[pixelPos];
	if (value < threshold)
		return;
	arrView[pixelPos] = this.constructor._globalTempArray[value];
}



// must be called form another context
ParticularEffectInit = function() {
	ParticularEffectInit._setTempGradient.call(this);
	ParticularEffectInit._setTempDistribution.call(this);
};

ParticularEffectInit._setTempGradient = function() {
	var g = this.prototype._gradient = new Gradient();

	for (var i = 0; i < this.gradient.length; i++) {
		var grad = this.gradient[i];
		g.addColorStop(grad[0], grad[1])
	}

	var minValue = 0;
	var maxValue = 3000;

	var tempArr = this._globalTempArray = {};

	for (var i = minValue; i <= maxValue; i++) {
		var c = g.getColor(i);
		tempArr[i] = 
			(c.red) |
			(c.green << 8) |
			(c.blue << 16) |
			(c.opacity << 24);
	}
}

ParticularEffectInit._setTempDistribution = function() {
	var arr = this.prototype._tempDistribution = [];
	var shapeFn = new Function('size', 'x', 'y', 'return ' + this.particleParams.shapeFn);
	for (var particleSize = 0; particleSize < this.particleParams.maxSize; particleSize++) {
		arr[particleSize] = [];
		for (var x = 0; x <= particleSize; x++) {
			var diffX = particleSize - x;
			arr[particleSize][x] = new Uint16Array(particleSize + 1);
			for (var y = 0; y <= particleSize; y++) {
				var diffY = particleSize - y;
				arr[particleSize][x][y] = shapeFn(particleSize, x, y);
			}
		}
	}
};