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
	create: function(string, obj) {
		// TODO: Implement '>', '*', '()' etc.
		var elName = string.match(/[a-zA-Z]+/);
		var el = document.createElement(elName);

		var hash = string.match(/#[a-zA-Z][a-zA_Z0-9-]*/);
		if (hash) el.id = hash[0].slice(1);

		var dots = string.match(/\.[a-zA-Z][a-zA-Z0-9-]*/g);
		if (dots)
			while (dots.length > 0)
				el.classList.add(dots.shift().slice(1));

		// queries syntax:
		// ?prop1=value1&prop2=value2 (...)
		var queries = string.match(/[\?|&][a-zA-Z-]*=[a-zA-Z-#]*/g);
		if (queries)
			for (var i = 0; i < queries.length; i++) {
				console.log(queries[i]);
				var prop = queries[i].match(/[\?|&][a-zA-Z-]*/)[0].slice(1);
				var value = queries[i].match(/=[a-zA-Z-#]*/)[0].slice(1);

				if(prop in this)
					this[prop].call(el, el, value);
				else 
					el[prop] = value;
			}

		for(var prop in obj) {
			if(prop in this)
					this[prop].call(el, el, obj[prop]);
				else 
					el[prop] = obj[prop]

		}

		return el;
	},
	text: function(elem, text) {
		navigator.browserInfo.browser == 'Firefox' ?
			elem.textContent = text :
			elem.innerText = text;
		return elem;
	}
}
var _Q = DOM.create.bind(DOM);

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

// http://stackoverflow.com/users/80860/kennebec
navigator.browserInfo = (function() {
	var ua = navigator.userAgent,
		tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE ' + (tem[1] || '');
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	return {
		browser: M[0],
		version: M[1]
	};
})();