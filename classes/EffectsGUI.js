var $ = document.querySelectorAll.bind(document);


function EffectsGUI() {
	this._effects = [Fireball, Sparks];
}

EffectsGUI.prototype.init = function() {
	this._effectsList = this._getEffectsList();
	this._createLabels();
	this._showOptions();
	this._activateButtons();
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
	a.classList.add('button');
	a.addEventListener('click', function(e) {
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
	this._addNewColorStopButton($('#gradient')[0], 'gradient');
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
	var textInput = new Input('text', value).get();
	var rangeInput = new Input('range', value).get();

	label.innerText = paramName + ':';

	var self = this;
	rangeInput.onchange = rangeInput.oninput = function() {
		var val = Number(this.value);
		textInput.value = val;
		params[paramName] = val;
		self._tryInitEffect();
	};

	textInput.onchange = function() {
		var val = Number(this.value);
		rangeInput.value = val;
		params[paramName] = val;
		self._tryInitEffect();
	};

	div.appendChild(label);
	div.appendChild(rangeInput);
	div.appendChild(textInput);

	div.classList.add('range');

	return div;
}

EffectsGUI.prototype._createTextRecord = function(effect, params, paramName) {
	var value = params[paramName];
	var div = document.createElement('div');
	var label = document.createElement('label');

	var input = new Input('text', value).get();

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

DOM = {
	clear: function(elem) {
		while (elem.firstChild)
			elem.removeChild(elem.firstChild)
	}
}

EffectsGUI.prototype._drawGradient = function(div_options, _jsObject) {
	var effect = this._currentEffect;
	var gradient = effect[_jsObject];

	DOM.clear(div_options)

	for (var i = 0; i < gradient.length; i++) {
		var record = this._createColorRecord(gradient[i]);
		div_options.appendChild(record);
	}
};

EffectsGUI.prototype._addNewColorStopButton = function(div_options, _jsObject) {
	var self = this;
	var effect = this._currentEffect;
	var gradient = effect[_jsObject];
	var button = document.createElement('button');
	button.innerText = 'Add Color Stop';
	button.addEventListener('click', function(e) {
		var cs = [0, '#000'];
		gradient.push(cs);
		var record = self._createColorRecord(cs);
		div_options.insertBefore(record, button);
	});
	div_options.appendChild(button);
}


EffectsGUI.prototype._createColorRecord = function(colorStop) {
	var valueIndex = 0;
	var colorIndex = 1;

	var value = colorStop[valueIndex];
	var hexColor = colorStop[colorIndex];

	var div = document.createElement('div');
	var valueInput = new Input('number', value).get()
	var colorInput = new Input('text', hexColor).get();
	var colorBox = document.createElement('div');

	colorBox.classList.add('color-box');

	function fillBox(color) {
		colorBox.style.backgroundColor = color;
	}

	fillBox(hexColor);

	var self = this;
	valueInput.onchange = function() {
		var val = this.value;
		colorStop[valueIndex] = val;
		self._tryInitEffect();
	};

	colorInput.onchange = function() {
		hexColor = this.value;
		colorStop[colorIndex] = hexColor;
		fillBox(hexColor);
		self._tryInitEffect();
	};

	function colorBoxColorChange(color) {
		hexColor = color.toHex();
		colorStop[colorIndex] = hexColor;
		colorInput.value = hexColor;
		fillBox(hexColor);
		self._tryInitEffect();
	}

	colorBox.onclick = function(e) {
		$('.color-box.active')[0] &&
			$('.color-box.active')[0].classList.remove('active');
		this.classList.add('active');
		var radius = 150;
		var center = {
			x: this.offsetLeft + this.offsetWidth / 2,
			y: this.offsetTop - radius - 5
		}
		var cp = new ColorPicker(center, radius, hexColor);
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
	} catch (err) {}
};


EffectsGUI.prototype._activateButtons = function() {
	document.getElementById('remove-effects').addEventListener('click', function() {
		game.removeEffects();
	})
}



function Input(type, value) {
	var args = Array.prototype.slice.call(arguments, 1);
	this._input = document.createElement('input');
	this._input.type = type;
	type in Input && Input[type].apply(this, args);
	this._input.value = value;
}

Input.range = function(value) {
	var input = this._input;

	if (!Number.isInteger(value)) {
		input.step = 0.01;
		input.min = 0;
		input.max = 1;
	} else {
		input.min = 0;
		input.max = value * 2;
	}
};

Input.prototype.get = function() {
	return this._input;
}