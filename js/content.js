let observerConfig = {
	attributes: true,
	attributeOldValue: true,
	attributeFilter: ["class"],
	subtree: true,
};

var userData = {};

let observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		// console.log("MUTATION::", mutation.target);
		if (mutation.target.childElementCount > 0) return;
		var pElem = mutation.target.closest("div[meet-gif-id]");
		if (pElem === null) return;

		var participantName = pElem.getAttribute("meet-gif-id");
		var user = userData[participantName];

		user.lastTalk = new Date();
		startedTalking(user, pElem);
	});
});

// Toggle Gif
function startedTalking(user, pElem) {
	if (user.talking === true) return;
	user.talking = true;

	var imgNode = pElem.querySelector(`img[src="${user.image}"]`);
	if (imgNode === null) return;
	imgNode.src = imgNode.src.replace("-p-k-no-mo", "-p");
	user.image = imgNode.src;
}

function stoppedTalking(user, pElem) {
	if (user.talking === false) return;
	user.talking = false;

	var imgNode = pElem.querySelector(`img[src="${user.image}"]`);
	if (imgNode === null) return;
	imgNode.src = imgNode.src.replace(/\-p$/, "-p-k-no-mo");
	user.image = imgNode.src;
}

// Populate userImages
function startObserving(nodes) {
	nodes.forEach((e) => {
		var pElem = e.parentElement.parentElement.querySelector(
			"div[data-self-name]"
		);
		if (pElem === null) return;

		var participantName = pElem.innerText;
		var user = userData[participantName];
		if (!user) {
			user = { talking: false };
			userData[participantName] = user;
		}
		user.image = e.src;

		pElem = e.closest("div[data-initial-participant-id]");
		if (pElem === null) return;

		// If user last talked more than a sec ago, mark talking false
		if (user.lastTalk) {
			var now = new Date();
			var lastTime = now - user.lastTalk;
			if (lastTime > 500) {
				stoppedTalking(user, pElem);
			}
		}

		if (pElem.hasAttribute("meet-gif-id")) return;

		pElem.setAttribute("meet-gif-id", participantName);
		observer.observe(pElem, observerConfig);
	});
}

// Attach when connected to the meeting
function attach() {
	images = document.querySelectorAll('img[src*="googleusercontent.com"]');

	if (images.length >= 1) {
		startObserving(images);
	} else {
		observer.disconnect();
	}
}

setInterval(attach, 1000);

