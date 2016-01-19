function Connection(valueType, args, onchange) {
	if (!(this instanceof Connection))
		return new Connection(valueType, args, onchange);
	
	EventEmitter.call(this);
	this._valueType = valueType;
	this._onchange = onchange;
	this._inputs = [];
	this._pointers = [];
	this._value = null;
	
	this._inputHandler = function(e) {
		this._parseInputValue(e.target.value);
		this.setValue();
	}.bind(this);

	for (var i = 0; i < args.length; i++) {
		var arg = args[i];

		if (arg instanceof Pointer)
			this._addPointer(args[i]);
		else 
			this._addInput(args[i]);
	}
	return this;
}
extend(Connection, EventEmitter);

Connection.prototype._addPointer = function (pointer) {
	this._pointers.push(pointer);
	this._value = pointer.value;
	//TODO:  add Object.observe
};

Connection.prototype._addInput = function (input) {
	var self = this;
	input.value = this._value;
	input.addEventListener('change', self._inputHandler);
	this._inputs.push(input);
};

Connection.prototype._parseInputValue = function (value) {
	if (this._valueType == 'int')
		this._value = parseInt(value);
	else if (this._valueType == 'float')
		this._value = parseFloat(value);
	else if (this._valueType == 'text')
		this._value = value;
	else
		console.error('Wrong type');
};

Connection.prototype.setValue = function (value) {
	value = value || this._value;
	for (var i = 0; i < this._pointers.length; i++) {
		var pointer = this._pointers[i];
		pointer.set(value);
	}
	for (var i = 0; i < this._inputs.length; i++) {
		var input = this._inputs[i];
		input.value = value;
	}
	this._onchange && this._onchange(value);
	this.emit('change', value);
};

Connection.prototype.disconnect = function () {
	var self = this;
	for (var i = 0; i < this._inputs.length; i++) {
		this._inputs[i].removeEventListener('change', self._inputHandler);
		this._inputs[i].removeEventListener('input', self._inputHandler);
	}
	// dereference
	this._inputs = [];
	this._pointers = [];
	this._value = null;
};