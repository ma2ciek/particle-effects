var canvas;
var ctx;
var $ = document.querySelectorAll.bind(document);
var userEventsListener;

var game;
var effectsGUI;

window.onload = function() {
	canvasInit();

	userEventsListener = new UserEventsListener();

	effectsGUI = new EffectsGUI();
	effectsGUI.init();

	game = new Game();
	game.nextFrame();
	game.addEventHandlers();
};

function UserEventsListener() {
	EventEmitter.call(this);
	this._setEventListeners();
}
extend(UserEventsListener, EventEmitter);

UserEventsListener.prototype._setEventListeners = function() {
	var self = this;

	canvas.addEventListener('click', function(e) {
		if (e.which != 1)
			return;
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		var p = new Point(x, y);
		self.emit('leftClick', p);
	});

	canvas.oncontextmenu = function(e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		var p = new Point(x, y);
		self.emit('rightClick', p);
		e.preventDefault();
	};

	canvas.onselectstart = function(e) {
		e.preventDefault();
	}
}

function Game() {
	this._frame = 0;
	this._effects = [];
	this._FPSTimer = new Timer('#fps');
	this._APSTimer = new Timer('#time');
}

Game.prototype.nextFrame = function() {
	this._APSTimer.start();

	this._frame++;
	canvasClear();
	this._animateEffects();

	this._APSTimer.end();
	this._FPSTimer.end();
	this._countAndDrawAPS();
	window.requestAnimationFrame(this.nextFrame.bind(this));
};

Game.prototype._countAndDrawAPS = function(timestamp) {
	this._APSTimer.drawAPS();
	this._FPSTimer.drawAPS();
};

Game.prototype._animateEffects = function() {
	try {
		for (var i = 0; i < this._effects.length; i++) {
			this._effects[i].animate();
		}
	} catch (err) {
		console.error(err);
		return;
	}
};

Game.prototype.createEffect = function(point) {
	var self = this;
	var effect = effectsGUI._currentEffect; // do poprawy
	var pe = new effect(point, undefined);
	pe.addEventListener('dead', function() {
		var index = self._effects.indexOf(this);
		self._effects.splice(index, 1);
	});
	this._effects.push(pe);
};

Game.prototype.addEventHandlers = function() {
	userEventsListener.addEventListener('leftClick', this.moveEffectsTo.bind(this));
	userEventsListener.addEventListener('rightClick', this.createEffect.bind(this));
};

Game.prototype.moveEffectsTo = function(point) {
	for (var i = 0; i < this._effects.length; i++) {
		this._effects[i].moveTo(point);
	}
}

Game.prototype.removeEffects = function() {
	this._effects.length = 0;
}

function canvasClear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function canvasInit() {
	canvas = $('canvas')[0];
	ctx = canvas.getContext('2d');
	canvasResize();
	window.addEventListener('resize', canvasResize);
}

function canvasResize() {
	var offsetLeft = 400;
	canvas.width = document.body.clientWidth - offsetLeft;
	canvas.height = document.body.clientHeight;
	canvas.style.left = offsetLeft;
	$('div#left-side')[0].style.width = 400;
}