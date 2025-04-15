chrome.action.onClicked.addListener(async (tab) => {
	if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
		try {
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ["container.js"]
			});
		} catch (error) {
			console.error("Script injection failed:", error);
		}
	} else {
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'icon.png',
			title: 'Alert!',
			message: 'This extension must be used on a page URL.',
			priority: 2,
		});
	}
});
