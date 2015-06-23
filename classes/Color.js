function Color() {
	var args = arguments;
	var len = args.length;
	var type = typeof args[0];

	if (type === 'object')
		return Color.apply(this, args[0]);

	if (len === 0)
		return Color.call(this, 0, 0, 0);

	if (len === 1) {
		if (type == 'string')
			this._createFromHex(args[0]);
		if (type == 'number')
			this._createFromNumber(args[0]);
	}
	if (len == 3 || len == 4)
		this._createFromRGB.apply(this, args);

	if (isNaN(this.red + this.blue + this.green + this.opacity))
		throw new Error("Something went wrong: " + [this.red, this.green, this.blue, this.opacity].join(', '));

	return this;
};

Color.prototype._hexArray = '0123456789ABCDEF'.split('');

Color.prototype._createFromHex = function(hex) {
	this.opacity = 255;
	if (hex.length === 4 || hex.length === 5 || hex.length === 7) {
		if (hex[0] === '#')
			hex = hex.slice(1);
	}
	if (hex.length === 3) {
		this.red = parseInt('' + hex[0] + hex[0], 16);
		this.green = parseInt('' + hex[1] + hex[1], 16);
		this.blue = parseInt('' + hex[2] + hex[2], 16);
		return;
	}
	if (hex.length === 4) { // my own quick format like #RGBA
		this.red = parseInt('' + hex[0] + hex[0], 16);
		this.green = parseInt('' + hex[1] + hex[1], 16);
		this.blue = parseInt('' + hex[2] + hex[2], 16);
		this.opacity = parseInt('' + hex[3] + hex[3], 16);
		return;
	}
	if (hex.length === 6) {
		this.red = parseInt('' + hex[0] + hex[1], 16);
		this.green = parseInt('' + hex[2] + hex[3], 16);
		this.blue = parseInt('' + hex[4] + hex[5], 16);
		return;
	} else throw new Error('Wrong Hex Code')
};

Color.prototype._createFromNumber = function(number) {
	this.opacity = number >> 24 & 255;
	this.blue = (number >> 16) & 255;
	this.green = (number >> 8) & 255;
	this.red =  number & 255;
};

Color.prototype._createFromRGB = function(red, green, blue, opacity) {
	this.red = red | 0;
	this.green = green | 0;
	this.blue = blue | 0;
	if (typeof opacity != 'undefined')
		this.opacity = opacity;
};

Color.prototype.toHex = function() {
	var hex = '#';
	var arr = this._hexArray;
	hex += arr[this.red / 16 | 0];
	hex += arr[this.red % 16];
	hex += arr[this.green / 16 | 0];
	hex += arr[this.green % 16];
	hex += arr[this.blue / 16 | 0];
	hex += arr[this.blue % 16];
	return hex;
};

Color.prototype.toShortHex = function() {
	var hex = '#';
	var arr = this._hexArray;

	hex += arr[this.red / 16 | 0];
	hex += arr[this.green / 16 | 0];
	hex += arr[this.blue / 16 | 0];
	return hex;
};