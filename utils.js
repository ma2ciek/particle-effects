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


var DOM = {
	empty: function(elem) {
		while (elem.firstChild)
			elem.removeChild(elem.firstChild)
	},
	create: function(string) {
		// TODO: Implement '>', '*', '()' etc.
		var elName = string.match(/[a-zA-Z]+/);
		var el = document.createElement(elName);

		var hash = string.match(/#[a-zA-Z][a-zA_Z0-9-]*/);
		if (hash) el.id = hash[0].slice(1);

		var dots = string.match(/\.[a-zA-Z][a-zA-Z0-9-]*/g);

		if(dots)
			while (dots.length > 0) 
				el.classList.add(dots.shift().slice(1));
		return el;
	}
}



function Pointer(parent, child) {
	this.parent = parent;
	this.child = child;
	this.value = parent[child];
}

Pointer.prototype.valueOf = function() {
	return this.value;
};

Pointer.prototype.set = function(value) {
	this.value = value
	this.parent[this.child] = value;
};

Pointer.prototype.setChild = function(child) {
	this.child = child;
	this.value = this.parent[child];
};