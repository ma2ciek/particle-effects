function Particle() {}

Particle.prototype.calculateVelocity = function() {
	var angle = Math.PI * (this._time + 1) / 30 * this._speed;
	var x = Math.cos(this._shift + angle) * this._paramA;
	var y = Math.sin(this._shift + angle) * this._paramB;

	var newX = x * this._rotCos - y * this._rotSin;
	var newY = x * this._rotSin + y * this._rotCos;

	this._velocity = new Vector(newX - this._x, newY - this._y);

	this._Vx = this._velocity[0];
	this._Vy = this._velocity[1];

};

Particle.prototype.speedUpBy = function(number) {
	this._velocity.multiplyByMatrix([
		[number, 0],
		[0, number]
	]);
	this._Vx = this._velocity[0];
	this._Vy = this._velocity[1];
};

Particle.prototype.moveStraight = function() {
	this._time++;
	this._x += this._Vx;
	this._y += this._Vy;
	if (this._maxRadius && this._x * this._x + this._y * this._y > this._maxRadius * this._maxRadius) {
		this._alive = false;
	}
};

Particle.prototype.isAlive = function() {
	if (this._time >= this._existTime) {
		return false;
	} else if (!this._alive) {
		return false;
	}
	return true;
};

Particle.prototype.getPosition = function() {
	return {
		x: Math.floor(this._x),
		y: Math.floor(this._y)
	};
};

Particle.prototype.getSize = function() {
	return this._size | 0;
};

Particle.prototype.moveAround = function() {
	this._x += rand(this._speed) * this._randomization;
	this._y += rand(this._speed) * this._randomization;
};