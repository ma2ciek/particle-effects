var workerCode = function () {
    "use strict;" //this will become the first line of the worker

    var o = {}

    function set(x, y) {
        o[x] = y
        main.Logger(y);
    }

    function get(x) {
        main.Logger(o[x]);
    }

    function CalculateSomethingBig(buff, d) {
        var v = new Uint32Array(buff);
        for (var i = 0; i <= v.length; i++) {
            v[i] /= d;
        }
        main.PlotFraction(v.buffer, "done", 0, 2, "world", [v.buffer]);
        //the buffer is fully transfered to the main thread (google "transferable objects javascript")
    }

    //the BuildBridgedWorker will add some extra code on the end to form the complete worker code
}

var Logger = function (val) {
    // do something here
    console.log(val);
}

var PlotFraction = function (buffer, str1, p1, p2, str2) {
    // do something here
    var arr = new Uint32Array(buffer);
    console.log(arr);

}

var workers = [];
var workersLength = 4;

for(var i=0; i<workersLength; i++) {
    workers[i] = BuildBridgedWorker(workerCode, ["set", "get", "CalculateSomethingBig*"],
    ["Logger","Logger", "PlotFraction*"], [Logger, Logger, PlotFraction]);
}