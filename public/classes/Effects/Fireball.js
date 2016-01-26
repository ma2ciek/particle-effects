function Fireball(point, vector) {
	"use strict";
	ParticularEffect.call(this);

	this._state = 'growing';
	this._particles = [];
	this._vector = vector;
	this._x = point.x;
	this._y = point.y;

	// OPTIONS
	copyWithDash(this, this.constructor.params);

	this._particlesParams = clone(this.constructor.particleParams);

	this._destinationX = 0;
	this._destinationY = 0;

	var arrSize = this._radius * this._radius * 4;
	this._temperature = new Uint32Array(arrSize);
	this._oldTemperature = new Uint32Array(arrSize);

	this.addEventListener('movedToTarget', this._explode.bind(this));

	// Object.preventExtensions(this);
}
extend(Fireball, ParticularEffect);

Fireball.params = {
	speed: 10,
	radius: 20,
	maxRadius: 120,
	growingSpeed: 2,
	explodingRadius: 300,
	explosionSpeed: 5,
	maxParticles: 450,
	drawingThreshold: 15,
	particlesGrowth: 10,
	contrailFactor: 0.8,
};

Fireball.particleParams = {
	minSize: 7,
	maxSize: 11,
	maxExistTime: 200,
	orbitalSpeed: 0.5,
	shapeFn: '4*size*size/(1 + x*x + y*y)'
};

Fireball.gradient = [
	[10, '#000'],
	[100, '#F00'],
	[300, '#FF0'],
	[600, '#FFF'],
];

Fireball.prototype.animate = function() {
	if (this._state === 'growing') {
		this._move();
		this._updateRadius();
		this._createParticles();
		this._moveParticlesElliptical();
	} else if (this._state === 'exploding') {
		this._moveParticlesStraight();
		this._destroyIfInvisible();
	}
	this._calculateTemperature();
	this._draw();
};

Fireball.prototype._explode = function() {
	this._state = 'exploding';
	this._maxParticles = 0;
	for (var i = 0; i < this._particles.length; i++) {
		this._particles[i].calculateVelocity();
		this._particles[i].speedUpBy(this._explosionSpeed);
		this._particles[i]._maxRadius = this._explodingRadius;
	}
	this._oldRadius = this._radius;
	this._radius = this._explodingRadius;
	this._transferTemperatureArray();
};

Fireball.prototype._transferTemperatureArray = function() {

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

Fireball.prototype._createParticle = function() {
	var p = new EllipticalParticle(this._radius, this._particlesParams);
	this._particles.push(p);
};



function EllipticalParticle(maxRadius, params) {
	Particle.call(this);
	this._alive = true;
	this._x = 0;
	this._y = 0;
	if (Number.isFinite(params.maxExistTime))
		this._existTime = randInt(params.maxExistTime / 2, params.maxExistTime)
	else
		this._existTime = Infinity;

	this._time = 0;
	this._size = randInt(params.minSize, params.maxSize);

	// elliptical params:
	this._paramA = randInt(this._size / 2, maxRadius - this._size / 2);
	this._paramB = randInt(0, maxRadius / 2)
	this._speed = params.orbitalSpeed;
	this._shift = rand(Math.PI * 2);

	var rot = this._rotateAngle = rand(Math.PI * 2);
	this._rotCos = Math.cos(rot);
	this._rotSin = Math.sin(rot);
}
extend(EllipticalParticle, Particle);

EllipticalParticle.prototype.moveElliptical = function() {
	this._time++;

	var angle = Math.PI * this._time / 30 * this._speed;
	var x = Math.cos(this._shift + angle) * this._paramA;
	var y = Math.sin(this._shift + angle) * this._paramB;

	//rotate ellipse
	this._x = x * this._rotCos - y * this._rotSin;
	this._y = x * this._rotSin + y * this._rotCos;
};