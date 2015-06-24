function Gradient() {
	this._thresholds = [];
}

Gradient.prototype.getColor = function(value) {
	var c1, c2;
	for (var i = 0; i < this._thresholds.length; i++) {
		var th = this._thresholds[i];
		if (value < th.value)
			break;
		if (value === th.value)
			return th.color;
	}
	if (i === 0)
		return this._thresholds[0].color;
	if (i === this._thresholds.length)
		return this._thresholds[this._thresholds.length - 1].color;

	var c1 = this._thresholds[i - 1];
	var c2 = this._thresholds[i];
	var diff = c2.value - c1.value;
	var factor1 = (c2.value - value) / diff;
	var factor2 = (value - c1.value) / diff;

	var color1 = c1.color;
	var color2 = c2.color;

	var red = factor1 * color1.red + factor2 * color2.red;
	var green = factor1 * color1.green + factor2 * color2.green;
	var blue = factor1 * color1.blue + factor2 * color2.blue;
	var opacity = factor1 * color1.opacity + factor2 * color2.opacity;
	return new Color(red, green, blue, opacity);
};

Gradient.prototype.addColorStop = function(value, hexColor) {
	var color = Color.fromHex(hexColor);

	for (var i = 0; i < this._thresholds.length; i++) {
		if (value < this._thresholds[i].value)
			break;
		else if (value === this._thresholds[i].value) {
			this._thresholds[i] = {
				value: value,
				color: color
			};
			return;
		}
	}
	this._thresholds.splice(i, 0, {
		value: value,
		color: color
	});
};

Gradient.prototype.getThreshold = function(x) {
	return this._thresholds[x];
}
