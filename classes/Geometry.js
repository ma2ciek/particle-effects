function Vector() {
	var v = [];
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] === 'number')
			v.push(arguments[i]);
		else if (Array.isArray(arguments[i]))
			v = v.concat(arguments[i]);
	}
	this.createFrom(v);
}
Vector.prototype = Object.create(null);

Vector.prototype.createFrom = function(v) {
	this.dim = v.length;

	var sqSum = 0;
	for (var i = 0; i < v.length; i++) {
		sqSum += v[i] * v[i];
		this[i] = v[i];
	}

	this.size = Math.sqrt(sqSum);

	this.unit = [];

	for (var i = 0; i < v.length; i++) {
		this.unit[i] = v[i] / this.size;
	}
};

Vector.prototype.toSize = function(x) {
	var sqSum = 0;
	for (var i = 0; i < this.dim; i++) {
		sqSum += this[i] * this[i];
	}
	this.length = Math.sqrt(sqSum);

	for (var i = 0; i < this.dim; i++) {
		this[i] = v[i] / this.size * x;
	}
};

Vector.prototype.multiplyByMatrix = function(matrix) {
	var v = [];

	for (var i = 0; i < matrix.length; i++) {
		var row = matrix[i];
		if (row.length !== this.dimensions)
			throw new Error('Wrong matrix. Expected ' + this.dimensions + ' rows in ' + (i + 1) + '. column');
		var sum = 0;
		for (var j = 0; j < row.length; j++) {
			sum += this[j] * row[j];
		}
		v[i] = sum;
	}
	this.createFrom(v);
	return this;
};

Vector.createFromFlapArray = function (radius, i) {
	var x = i % (radius<<1);
	var y = i / (radius<<1) | 0;
	return new Vector(radius - x, radius - y);
};

function AngleByPi(angle) {
	this.angle = angle;
}

AngleByPi.prototype.normalize = function() {
	this.angle = this.angle % 2;
	if(this.angle < 0) 
		this.angle += 2;
};

AngleByPi.prototype.distanceFrom = function(ang) { // angles are form 0 to 2
	var diff = (this.angle - ang) % 2;
	diff = Math.abs(diff);
	return diff <= 1 ?
		diff :
		2 - diff;
};

AngleByPi.prototype.add = function(angle) {
	this.angle += angle;
};

AngleByPi.prototype.valueOf = function() {
	return this.angle;
};


function Point(x, y) {
	this.x = x;
	this.y = y;
}
