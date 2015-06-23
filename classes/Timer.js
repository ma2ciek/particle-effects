function Timer(element) {
	this._atSum = 0;
	this._atArr = [];
	this._lastTime = performance.now();
	this._maxLen = 100;
	this._drawingElement = document.querySelector(element);
}

Timer.prototype.start = function() {
	this._lastTime = performance.now();
};

Timer.prototype.end = function() {
	var t = performance.now();
	var at = t - this._lastTime;
	this._atSum += at;
	this._atArr.push(at);
	if (this._atArr.length > this._maxLen) {
		this._atSum -= this._atArr.shift();
	}
	this._lastTime = t;
};

Timer.prototype.getAPS = function() {
	return 1000 / (this._atSum / this._atArr.length) | 0;
};

Timer.prototype.getAT = function() {
	return this._atSum / this._atArr.length | 0;
}

Timer.prototype.drawAPS = function() {
	this._drawingElement.innerText = this.getAPS();
};

Timer.prototype.drawAT = function() {
	this._drawingElement.innerText = this.getAT() + 'ms';
}