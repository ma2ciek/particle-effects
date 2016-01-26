var $ = document.querySelectorAll.bind(document);

function EffectsGUI() {
	this._effects = [Fireball, Sparks, Vortex];
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
	var li = _Q('li');
	var a = _Q('a.button', {
		text: name,
		href: '#'
	});

	a.addEventListener('click', function(e) {
		var prevActive = this._effectsList.getElementsByClassName('active')[0];
		prevActive && prevActive.classList.remove('active');
		e.target.classList.add('active');
		this._currentEffect = window[name];
		ParticularEffectInit.call(this._currentEffect);
		this._showOptions();
	}.bind(this), false);
	li.appendChild(a);
	this._effectsList.appendChild(li);
}

EffectsGUI.prototype.getCurrentEffect = function() {
	return this._currentEffect;
}

EffectsGUI.prototype._showOptions = function() {
	this._drawOptionsRecords($('#effect-options')[0], 'params');
	this._drawOptionsRecords($('#particle-options')[0], 'particleParams');
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
	var button = _Q('button', {
		text: 'addColorStop'
	});

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

	var valuePointer = new Pointer(colorStop, valueIndex);
	var colorPointer = new Pointer(colorStop, colorIndex);

	var div = _Q('div.color');
	var valueInput = new Input('number', value).get()
	var colorInput = new Input('text', hexColor).get();
	var colorBox = _Q('button.color-box');

	function fillBox(color) {
		colorBox.style.backgroundColor = color;
	}

	fillBox(hexColor);

	var self = this;

	var valueConnection = new Connection('int', [valuePointer, valueInput], function() {
		self._tryInitEffect();
	});

	var colorConnection = new Connection('text', [colorPointer, colorInput], function(hexColor) {
		fillBox(hexColor);
		self._tryInitEffect();
	});

	colorBox.onclick = function(e) {
		var button = $('.color-box.active')[0];
		button && button.classList.remove('active');
		this.classList.add('active');

		var radius = 150;
		var center = {
			x: this.offsetLeft + this.offsetWidth / 2,
			y: this.offsetTop - radius - 5
		};
		
		console.log(center);
		
		var cp = new ColorPicker(center, radius, hexColor);
		cp.appendTo($('#left-side')[0]);
		cp.addEventListener('color', function(color) {
			console.log(color);
			colorConnection.setValue(color.toHex());
		});
	};

	div.appendChild(valueInput);
	div.appendChild(colorBox);
	div.appendChild(colorInput);

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