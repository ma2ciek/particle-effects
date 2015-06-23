function Settings() {
	EventEmitter.call(this);
	this._options = {};
	this.setDefaultOptions();
	this._loadSettingsFromStorage();
}
extend(Settings, EventEmitter);

var _p = Settings.prototype;

_p.setDefaultOptions = function () {
	// Can be stored in external JSON file
	this._options = {
		FIREBALL_SIZE: {
			value: 1,
			valueType: 'number',
			settingsType: 'audio',
			inputType: 'range',
			minValue: 0,
			maxValue: 100,
			step: 10
		}
	};

	this._createNiceOptionNames();
};

_p._createNiceOptionNames = function() {
	for (var propName in this._options) {
		var o = this._options[propName];
		o.niceName = propName.replace('_', ' ').toLowerCase();
		o.niceName = propName[0] + o.niceName.substr(1);
	}
}

_p.getPropValue = function (property) {
	return this._options[property].value;
};

_p.getAll = function () {
	return this._options;
};

_p.setPropValue = function (property, value) {
	var op = this._options[property];
	if (op.valueType === 'number') 
		value = Number(value);

	if (op.valueType === 'boolean') {

		value = value === 'true' || 
			value === true ||
			value === 1 ||
		 	value === '1';

	}

	this._options[property].value = value;
	this._save();
	this.trigger(property, value);
};

_p._loadSettingsFromStorage = function () {
	var data = localStorage.getItem('Warrior-settings') || '{}';
	var storageOptions = JSON.parse(data);

	for (var propName in storageOptions) {
		if (propName in this._options) {
			this._options[propName].value = storageOptions[propName];
		}
	}
};

_p._save = function () {
	var values = {};
	for (var propName in this._options) {
		values[propName] = this._options[propName].value;
	}

	var data = JSON.stringify(values);
	localStorage.setItem('Warrior-settings', data);
};