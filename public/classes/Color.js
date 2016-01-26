function Color(red, green, blue, opacity) {
	this.red = red | 0;
	this.green = green | 0;
	this.blue = blue | 0;
	this.opacity = opacity == 'undefined' ? 255 : opacity;

	if (isNaN(this.red + this.blue + this.green + this.opacity))
		throw new Error("Something went wrong: " + [this.red, this.green, this.blue, this.opacity].join(', '));
};

Color.prototype._hexArray = '0123456789ABCDEF'.split('');

Color.fromHex = function(hex) {
	var red, green, blue, opacity=255;
	if (hex.length === 4 || hex.length === 5 || hex.length === 7) {
		if (hex[0] === '#')
			hex = hex.slice(1);
	}
	if (hex.length === 3) {
		red = parseInt('' + hex[0] + hex[0], 16);
		green = parseInt('' + hex[1] + hex[1], 16);
		blue = parseInt('' + hex[2] + hex[2], 16);
	}
	else if (hex.length === 4) { // my own quick format like #RGBA
		red = parseInt('' + hex[0] + hex[0], 16);
		green = parseInt('' + hex[1] + hex[1], 16);
		blue = parseInt('' + hex[2] + hex[2], 16);
		opacity = parseInt('' + hex[3] + hex[3], 16);
	}
	else if (hex.length === 6) {
		red = parseInt('' + hex[0] + hex[1], 16);
		green = parseInt('' + hex[2] + hex[3], 16);
		blue = parseInt('' + hex[4] + hex[5], 16);
	} else throw new Error('Wrong Hex Code');
	return new Color(red, green, blue, opacity);
};

Color.fromNumber = function(number) {
	return new Color(number >> 24 & 255, number >> 16 & 255, number >> 8 & 255, number & 255);
};

Color.fromArr = function(arr) {
	var o = Object.create(Color.prototype)
	Color.apply(o, arr);
	return o;
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

Color.prototype.getRGB = function() {
	return [this.red, this.green, this.blue];
};

Color.prototype.getRGBA = function() {
	return [this.red, this.green, this.blue, this.opacity];
};