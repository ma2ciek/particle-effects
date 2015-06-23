function Vector() {
	var v = [];
	for (var i = 0; i < arguments.length; i++) {
		if (Array.isArray(arguments[i]))
			v = v.concat(arguments[i]);
		else if (typeof arguments[i] === 'number')
			v.push(arguments[i]);
	}
	v && this.createFrom(v)
}
Vector.prototype = Object.create(null);

Vector.prototype.createFrom = function(v) {
	this.dimensions = v.length;

	var quadSum = 0;
	for (var i = 0; i < v.length; i++) {
		quadSum += v[i] * v[i];
		this[i] = v[i];
	}

	this.size = Math.sqrt(quadSum);

	this.unit = [];

	for (var i = 0; i < v.length; i++) {
		this.unit[i] = v[i] / this.size;
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