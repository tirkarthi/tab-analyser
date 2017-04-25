function changeStorage(value) {
    var today = new Date();
    var todayStr = today.toISOString().slice(0, 10); // http://stackoverflow.com/a/11172083/2610955
    var hour = today.getHours();
    var field = value === 1 ? "opened" : "closed";
    chrome.storage.sync.get(todayStr, function (result) {
	var obj = result;
	obj[todayStr] = typeof(obj[todayStr]) === "undefined" ? {} : obj[todayStr];
	obj[todayStr][field] = typeof(obj[todayStr][field]) === "undefined" ? 1 : obj[todayStr][field] + 1;
	obj[todayStr][hour] = typeof(obj[todayStr][hour]) === "undefined" ? {} : obj[todayStr][hour];
	obj[todayStr][hour][field] = typeof(obj[todayStr][hour][field]) === "undefined" ? 1 : obj[todayStr][hour][field] + 1;
        chrome.storage.sync.set(obj, function() {
	    console.log("Saved successfully");
	    // alert(JSON.stringify(obj));
	    console.log(JSON.stringify(obj));
	});
    });
}

chrome.tabs.onCreated.addListener( function(tab) {
    chrome.tabs.query({}, function(tabs) {
	changeStorage(1);
	chrome.browserAction.setBadgeText({text: tabs.length.toString()});
    });
    console.log('opened a tab');
});

chrome.tabs.onRemoved.addListener( function(tab) {
    chrome.tabs.query({}, function(tabs) {
	changeStorage(-1);
	chrome.browserAction.setBadgeText({text: tabs.length.toString()});
    });
    console.log('closing a tab');
});
