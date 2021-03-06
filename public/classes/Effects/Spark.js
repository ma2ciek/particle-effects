function Sparks(point, vector) {
	"use strict";
	ParticularEffect.call(this);

	this._state = 'growing';
	this._particles = [];
	this._vector = vector;
	this._x = point.x;
	this._y = point.y;

	this._origX = this._x;
	this._origY = this._y;

	// OPTIONS
	copyWithDash(this, this.constructor.params);

	this._particlesParams = clone(this.constructor.particleParams);

	this._destinationX = 0;
	this._destinationY = 0;

	var arrSize = this._radius * this._radius << 2;
	this._temperature = new Uint32Array(arrSize);
	this._oldTemperature = new Uint32Array(arrSize);

	this.addEventListener('startMoving', this._finish.bind(this));

	Object.preventExtensions(this);
}
extend(Sparks, ParticularEffect);

Sparks.params = {
	speed: 0,
	radius: 200,
	maxParticles: Infinity,
	drawingThreshold: 10,
	particlesGrowth: 10,
	contrailFactor: 0.8,
};

Sparks.particleParams = {
	minSize: 7,
	maxSize: 11,
	maxExistTime: 500,
	speed: 10,
	visibilityTime: 7,
	randomization: 2,
	shapeFn: '10*size/(1 + x*y)'
};

Sparks.gradient = [
	[10, '#000'],
	[400, '#00F'],
	[1500, '#FFF']
];

Sparks.prototype.animate = function() {
	this._moveRandom();
	this._updateRadius();
	this._createParticles();
	this._moveParticlesStraight();
	this._changeParticlePower();
	this._destroyIfInvisible();
	this._calculateTemperature();
	this._draw();
};

Sparks.prototype._finish = function() {
	this._maxParticles = 0;
};

Sparks.prototype._transferTemperatureArray = function() {

	var oldTemp = this._oldTemperature;
	var newTemp = new Uint16Array(this._radius * this._radius * 4);
	var halfDelta = this._radius - this._oldRadius;

	for (var y = 0; y < this._oldRadius * 2; y++) {
		for (var x = 0; x < this._oldRadius * 2; x++) {
			newTemp[(y + halfDelta) * this._radius * 2 + x + halfDelta] = oldTemp[y * this._oldRadius * 2 + x];
		}
	}

	this._oldTemperature = newTemp;
};

Sparks.prototype._createParticle = function() {
	var p = new SparksParticle(this._radius, this._particlesParams);
	this._particles.push(p);
};

Sparks.prototype._changeParticlePower = function() {
	for(var i =0; i<this._particles.length; i++) {
		this._particles[i].reduce();
		this._particles[i].moveAround();
	}
};






function SparksParticle(maxRadius, params) {
	Particle.call(this);
	this._randomization = params.randomization;
	this._x = rand(5);
	this._y = rand(5);
	this._alive = true;

	this._maxRadius = maxRadius;
	if (Number.isFinite(params.maxExistTime))
		this._existTime = randInt(params.maxExistTime / 2, params.maxExistTime)
	else
		this._existTime = Infinity;

	this._time = 0;

	this._size = randInt(params.minSize, params.maxSize);

	this._speed = params.speed * Math.random();

	var v = new Vector(rand(1), rand(1)).unit;

	this._Vx = v[0] * this._speed;
	this._Vy = v[1] * this._speed;

	this._fadeOut = 1 - Math.pow(2, -params.visibilityTime);
}
extend(SparksParticle, Particle);

SparksParticle.prototype.reduce = function(x) {
	this._size *= this._fadeOut;
	if (this._size < 1)
		this._alive = false;
}