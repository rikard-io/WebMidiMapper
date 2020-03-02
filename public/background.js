chrome.browserAction.onClicked.addListener(function(tab) {
	if(tab){
		chrome.tabs.executeScript(tab.ib, {
			file: "main.js"
		});
	}
});
