function Particle() {
}

Particle.prototype.calculateVelocity = function() {
	var angle = Math.PI * (this._time+1) / 30 * this._speed;
	var x = Math.cos(this._shift + angle) * this._paramA;
	var y = Math.sin(this._shift + angle) * this._paramB;

	var newX = x * this._rotCos - y * this._rotSin;
	var newY = x * this._rotSin + y * this._rotCos;

	this._velocity = new Vector(newX - this._x, newY - this._y);

	this._Vx = this._velocity[0];
	this._Vy = this._velocity[1];

};

Particle.prototype.speedUpBy = function(number) {
	this._velocity.multiplyByMatrix([[number,0],[0,number]]);
	this._Vx = this._velocity[0];
	this._Vy = this._velocity[1];
};

Particle.prototype.moveStraight = function() {
	this._time++;
	this._x += this._Vx;
	this._y += this._Vy;
	if(this._maxRadius && this._x * this._x + this._y * this._y > this._maxRadius * this._maxRadius) {
		this._alive = false;
	}
}

Particle.prototype.isAlive = function() {
	if (this._time >= this._existTime) {
		return false;
	} else if(!this._alive) {
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
}

Particle.prototype.moveAround = function() {
	this._x += rand(this._speed) * this._randomization;
	this._y += rand(this._speed) * this._randomization;
}



function EllipticalParticle (maxRadius, params) {
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



function SparksParticle (maxRadius, params) {
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

	this._reducePower = params.reducePower;
}
extend(SparksParticle, Particle);

SparksParticle.prototype.reduce = function(x) {
	this._size *= this._reducePower;
	if(this._size < 1) 
		this._alive = false;
}

