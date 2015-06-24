function extend(subConstructor, superConstructor) {
	subConstructor.prototype = Object.create(superConstructor.prototype, {
		constructor: {
			value: subConstructor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
}

// Returns integer from <x, y>
function randInt(x, y) {
	var dif = y - x;
	return Math.random() * dif + x | 0;
}

// Returns float from (-x, x)
function rand(x) {
	return Math.random() * 2 * x - x;
}

function clone(src) {
	return Object.create(src);
}

function copy(dest, src) {
	for (var i in src) {
		if (src.hasOwnProperty(i)) {
			dest[i] = src[i];
		}
	}
	return dest;
}

function copyWithDash(dest, src) {
	for (var i in src) {
		if (src.hasOwnProperty(i)) {
			dest["_" + i] = src[i];
		}
	}
}