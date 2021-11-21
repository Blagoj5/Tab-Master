chrome.commands.onCommand.addListener((command) => {
	if (command === 'open-tab-master') {
		chrome.windows.getCurrent((window) => {
			chrome.tabs.query({active: true, windowId: window.id}, tabs => {
				const activeTabId = tabs[0].id;

				if (!activeTabId) throw new Error('Tab id does not exist');

				chrome.scripting.insertCSS({
					files: ['contentScripts/modal.css'],
					target: { tabId: activeTabId },
				});

				chrome.scripting.executeScript({
					files: ['contentScripts/index.js'],
					target: { tabId: activeTabId },
				});
			});
		});
	}
});