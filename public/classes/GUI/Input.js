// Do rozszerzenia!! 

function Input(type, value) {
	var args = Array.prototype.slice.call(arguments, 1);
	this._input = DOM.create('input');
	this._input.type = type;
	(type in Input) && Input[type].apply(this, args);
	this._input.value = value;
}

Input.range = function(value) {
	var input = this._input;
	input.min = 0;
	
	if(!Number.isFinite(value)) {
		input.max = 5000;
	} else if (Number.isInteger(value)) {
		input.max = Math.max(50, value * 2);	
	} else {
		input.step = 0.01;
		input.max = 1;
	}
		
	this._input.addEventListener('input', function(e) {
		var evt = new Event('change');
		this.dispatchEvent(evt);
	});
};

Input.prototype.get = function() { // TODO: should be get HTML Element
	return this._input;
}