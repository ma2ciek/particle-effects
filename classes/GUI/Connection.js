// require EventEmitter

function Connection(valueType, arguments) {
	EventEmitter.call(this);
	this.valueType = valueType;
	this.inputs = [];
	this.pointers = [];
	this.value = null;

	var self = this;
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];

		if(arg instanceof Pointer) {
			this.pointers.push(arg);
			this.value = arg.value;
			//TODO:  add Object.observe
		}

		else { // input element
			arg.value = this.value;
			arg.onchange = function() {
				var type = this.type;
				self._parseInputValue.call(self, this.value);
				self._update.call(self);
				self.emit.call(self, 'change', self.value);
			}
			this.inputs.push(arg);
		}
	}
	return this;
}
extend(Connection, EventEmitter);

Connection.prototype._parseInputValue = function(value) {
	if(this.valueType == 'int')
		this.value = parseInt(value); 
	else if(this.valueType == 'float') 
		this.value = parseFloat(value); 
	else if(this.valueType == 'text')
		this.value = value;
};

Connection.prototype._update = function() {
	for (var i =0; i< this.pointers.length; i++) {
		var pointer = this.pointers[i];
		pointer.set(this.value);
	}
	for (var i =0; i< this.inputs.length; i++) {
		var input = this.inputs[i];
		input.value = this.value;
	}
};