var $ = document.querySelectorAll.bind(document);


function EffectsGUI() {
	this._effects = [Fireball, Sparks];
}

EffectsGUI.prototype.init = function() {
	this._effectsList = this._getEffectsList();
	this._createLabels();
	this._showOptions();
};

EffectsGUI.prototype._getEffectsList = function() {
	return $('ul')[0];
}

EffectsGUI.prototype._createLabels = function() {
	for (var i = 0; i < this._effects.length; i++) {
		var name = this._effects[i].name;
		this._createEffectsButtons(name);
	}
	this._effectsList.getElementsByTagName('a')[1].click();
};

EffectsGUI.prototype._createEffectsButtons = function(name) {
	var li = document.createElement('li');
	var a = document.createElement('a');
	a.href = '#';
	a.innerText = name;
	a.addEventListener('click', function(e) {
		console.log(e, this);
		var prevActive = this._effectsList.getElementsByClassName('active')[0];
		prevActive && prevActive.classList.remove('active');
		e.target.classList.add('active');
		this._currentEffect = window[name];
		ParticularEffectInit.call(this._currentEffect);
		this._showOptions();
	}.bind(this));
	li.appendChild(a);
	this._effectsList.appendChild(li);
}

EffectsGUI.prototype._showOptions = function() {
	this._drawOptionsRecord($('#effect-options')[0], 'params');
	this._drawOptionsRecord($('#particles-options')[0], 'particleParams');
	this._drawGradient($('#gradient')[0], 'gradient');
}

EffectsGUI.prototype._drawOptionsRecord = function(div_options, _jsObject) {
	var effect = this._currentEffect;
	var params = effect[_jsObject];

	while (div_options.firstChild) 
		div_options.removeChild(div_options.firstChild);

	var record;
	for (var paramName in params) {

		var param = params[paramName];

		if (typeof param === 'number') 
			record = this._createNumberRecord(effect, params, paramName);
		else if (typeof param === 'string') 
			record = this._createTextRecord(effect, params, paramName);

		div_options.appendChild(record);
	}
};

EffectsGUI.prototype._createNumberRecord = function(effect, params, paramName) {
	var value = params[paramName];
	var div = document.createElement('div');
	var label = document.createElement('label');
	var textInput = this._createTextInput(value);
	var input = this._createRangeInput(value);

	label.innerText = paramName + ':';

	var self = this;
	input.onchange = input.oninput = function() {
		var val = Number(this.value);
		textInput.value = val;
		params[paramName] = val;
		self._tryInitEffect();
	};

	textInput.onchange = function() {
		var val = Number(this.value);
		input.value = val;
		params[paramName] = val;
		self._tryInitEffect();
	};

	div.appendChild(label);
	div.appendChild(input);
	div.appendChild(textInput);

	div.classList.add('range');

	return div;
}

EffectsGUI.prototype._createTextRecord = function(effect, params, paramName) {
	var value = params[paramName];
	var div = document.createElement('div');
	var label = document.createElement('label');
	
	var input = this._createTextInput(value);

	label.innerText = paramName + ':';
	
	var self = this;
	input.onchange = function() {
		var val = this.value;
		params[paramName] = val;
		self._tryInitEffect();
	};

	div.appendChild(label);
	div.appendChild(input);

	div.classList.add('text');

	return div;
};

EffectsGUI.prototype._drawGradient = function(div_options, _jsObject) {
	var effect = this._currentEffect;
	var gradient = effect[_jsObject];

	while (div_options.firstChild) 
		div_options.removeChild(div_options.firstChild);

	for (var i=0; i<gradient.length; i++) {
		var record = this._createColorRecord(effect, gradient, gradient[i]);
		div_options.appendChild(record);
	}
};


EffectsGUI.prototype._createColorRecord = function(effect, gradient, colorStop) {
	var valueIndex = 0;
	var colorIndex = 1;

	var value = colorStop[valueIndex];
	var color = colorStop[colorIndex];

	var div = document.createElement('div');
	var valueInput = this._createNumberInput(value);
	var colorInput = this._createTextInput(color);
	var colorBox = document.createElement('div');

	colorBox.classList.add('color-box');

	function fillBox (color) {
		colorBox.style.backgroundColor = color;
	}

	fillBox(color);

	valueInput.value = value;
	colorInput.value = color;
	
	var self = this;
	valueInput.onchange = function() {
		var val = this.value;
		colorStop[valueIndex] = val;
		self._tryInitEffect();
	};

	colorInput.onchange = function() {
		var val = this.value;
		colorStop[colorIndex] = val;
		fillBox(val);
		self._tryInitEffect();
	};

	function colorBoxColorChange (color) {
		var color = new Color(color);
		var hex = color.toHex();
		colorStop[colorIndex] = hex;
		colorInput.value = hex;
		fillBox(hex);
		self._tryInitEffect();
	}

	colorBox.onclick = function (e) {
		var radius = 150;
		var center = {
			x: this.offsetLeft + this.offsetWidth/2,
			y: this.offsetTop - radius -5
		}
		e.stopPropagation();
		var cp = new ColorPicker(center, radius, color);
		cp.addEventListener('color', colorBoxColorChange);
	}


	div.appendChild(valueInput);
	div.appendChild(colorBox);
	div.appendChild(colorInput);

	div.classList.add('color');

	return div;
};

EffectsGUI.prototype._tryInitEffect = function(value) {
	try {
		ParticularEffectInit.call(this._currentEffect);
	} catch(err) {}
};

EffectsGUI.prototype._createTextInput = function(value) {
	var input = document.createElement('input');
	input.type = 'text';
	input.value = value; 
	return input;
};

EffectsGUI.prototype._createNumberInput = function(value) {
	var input = document.createElement('input');
	input.type = 'number';
	input.value = value; 
	return input;
};

EffectsGUI.prototype._createRangeInput = function(value) {
	var input = document.createElement('input');
	input.type = 'range';

	var isInteger = Number.isInteger(value);

	if (isInteger) {
		input.min = 0;
		input.max = 500;
	} else {
		input.min = 0;
		input.max = 1;
		input.step = 0.01;
	}
	input.value = value;

	return input;
}