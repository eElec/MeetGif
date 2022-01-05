function toggleGif(e) {
	var val = e.target.checked;
	msg = val ? "startFun" : "stopFun";

	sendMsg(msg);
}

function refresh(e) {
	sendMsg("refresh");
}

function sendMsg(msg) {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, { message: msg });
	});
}

document.addEventListener("DOMContentLoaded", function () {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		var activeTab = tabs[0];
		console.log(activeTab);
		if (activeTab.url.includes("meet.google.com") === true) {
			document.getElementById("not-meet").remove();
		} else {
			document.getElementById("meet-options").remove();
		}
	});

	document.getElementById("toggleGif").addEventListener("change", toggleGif);
	document.getElementById("refresh").addEventListener("click", refresh);
	var links = document.getElementsByTagName("a");
	for (let e of links) {
		var loc = e.href;
		e.onclick = () => {
			chrome.tabs.create({ active: true, url: loc });
		};
	}
});
