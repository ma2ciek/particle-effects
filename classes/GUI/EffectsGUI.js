var $ = document.querySelectorAll.bind(document);

function EffectsGUI() {
	this._effects = [Fireball, Sparks];
}

EffectsGUI.prototype.init = function() {
	this._handleEffectsList();
	this._createLabels();
	this._showOptions();
	this._activateButtons();
};

EffectsGUI.prototype._handleEffectsList = function() {
	this._effectsList = $('ul')[0];
}

EffectsGUI.prototype._createLabels = function() {
	for (var i = 0; i < this._effects.length; i++) {
		var name = this._effects[i].name;
		this._createEffectsButtons(name);
	}
	this._effectsList.getElementsByTagName('a')[1].click();
};

EffectsGUI.prototype._createEffectsButtons = function(name) {
	var li = DOM.create('li');
	var a = DOM.create('a.button');
	a.href = '#';
	a.innerText = name;
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

EffectsGUI.prototype.getCurrentEffect = function() {
	return this._currentEffect;
}

EffectsGUI.prototype._showOptions = function() {
	this._drawOptionsRecords($('#effect-options')[0], 'params');
	this._drawOptionsRecords($('#particles-options')[0], 'particleParams');
	this._drawColorRecords($('#gradient')[0], 'gradient');
	this._addNewColorStopButton($('#gradient')[0], 'gradient');
}




EffectsGUI.prototype._drawOptionsRecords = function(div_options, _jsObject) {
	var effect = this._currentEffect;
	var params = effect[_jsObject];
	var self = this;
	DOM.empty(div_options);

	for (var paramName in params) {
		var pObj = new Pointer(params, paramName);
		var record = new ListRecord(effect, pObj);
		record.addEventListener('change', self._tryInitEffect.bind(self));
		div_options.appendChild(record);
	}
};

EffectsGUI.prototype._drawColorRecords = function(div_options, _jsObject) {
	var effect = this._currentEffect;
	var gradient = effect[_jsObject];

	DOM.empty(div_options)

	for (var i = 0; i < gradient.length; i++) {
		var record = this._createColorRecord(gradient[i]);
		div_options.appendChild(record);
	}
};

EffectsGUI.prototype._addNewColorStopButton = function(div_options, _jsObject) {
	var self = this;
	var effect = this._currentEffect;
	var gradient = effect[_jsObject];
	var button = DOM.create('button');
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

	var div = DOM.create('div');
	var valueInput = new Input('number', value).get()
	var colorInput = new Input('text', hexColor).get();
	var colorBox = DOM.create('div');

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
	$('#remove-effects')[0].addEventListener('click', function() {
		game.removeEffects();
	})
}

function ListRecord(effect, params, paramName) {
	var type = typeof params[paramName];
	var record;
	if (type == 'number')
		record = this._createNumberRecord(effect, params, paramName);
	else if (type == 'string')
		record = this._createTextRecord(effect, params, paramName);
	console.log(record);
	return record;
}

ListRecord.prototype._createNumberRecord = function(effect, params, paramName) {
	var value = params[paramName];
	var div = DOM.create('div');
	var label = DOM.create('label');
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

ListRecord.prototype._createTextRecord = function(effect, params, paramName) {
	var value = params[paramName];
	var div = DOM.create('div');
	var label = DOM.create('label');

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

ListRecord.prototype._tryInitEffect = function(value) {
	var currentEffect = effectsGUI.getCurrentEffect();
	try {
		ParticularEffectInit.call(this._currentEffect);
	} catch (err) {}
};