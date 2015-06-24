// Do rozszerzenia!! 

function Input(type, value) {
	var args = Array.prototype.slice.call(arguments, 1);
	this._input = DOM.create('input');
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
		input.max = Math.max(50, value * 2);
	}
};

Input.prototype.get = function() { // TODO: should be get HTML Element
	return this._input;
}