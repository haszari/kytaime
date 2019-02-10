
var intervalId = null;

var stopCallbacks = function() {
	clearInterval(intervalId);
	intervalId = null;
}

var startCallbacks = function(renderInterval, message) {
	intervalId = setInterval(function() {
		self.postMessage(message);
	}, renderInterval);
}

self.addEventListener('message', function(e) {
	if (e.data.type == "start") {
		startCallbacks(e.data.interval, e.data.message);
	}
	else if (e.data.type == "stop") {
		stopCallbacks();
	}
}, false);

