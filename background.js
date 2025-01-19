chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked, sending message to toggle sidebar");
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            chrome.tabs.sendMessage(tab.id, { action: "toggleSidebar" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log("Message sent to content script:", response);
                }
            });
        }
    });
});