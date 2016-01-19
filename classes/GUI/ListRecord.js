// require EventEmitter

function ListRecord(effect, obj) {
	EventEmitter.call(this);
	this.obj = obj;
	var type = typeof obj.value;

	this.effect = effect;
	this.value = obj.value;

	this.div = _Q('div.' + type);

	this._connections = [];

	if (type == 'number')
		this._createNumberRecord();
	else if (type == 'string')
		this._createTextRecord();

	return this.div;
}
extend(ListRecord, EventEmitter);

ListRecord.prototype.addLabel = function(parent, text) {
	var label = _Q('label', {
		text: text
	});
	parent.appendChild(label);
};

ListRecord.prototype._connect = function(valueType, args) {
	var connection = new Connection(valueType, args);
	var self = this;
	this._connections.push(connection);
	connection.addEventListener('change', self.emit.bind(self, 'change'));
}

ListRecord.prototype._createNumberRecord = function() {
	var textInput = new Input('text', this.value).get();
	var rangeInput = new Input('range', this.value).get();

	this._connect('float', [this.obj, textInput, rangeInput]);

	this.addLabel(this.div, this.obj.child + ': ')
	this.div.appendChild(rangeInput);
	this.div.appendChild(textInput);
}

ListRecord.prototype._createTextRecord = function() {
	var input = new Input('text', this.value).get();

	this._connect('text', [this.obj, input]);

	this.addLabel(this.div, this.obj.child + ': ')
	this.div.appendChild(input);
};