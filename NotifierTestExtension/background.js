chrome.browserAction.onClicked.addListener(function(tab) {
    // Check if the URL is a chrome:// URL
    if (tab.url && tab.url.startsWith('chrome://')) {
      // Option 1: Show a notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Modal Test',
        message: 'This extension doesn\'t work on Chrome internal pages.'
      });
      
      // Option 2: Alternatively, you could open a new tab with a regular page
      // chrome.tabs.create({url: 'https://example.com'});
      
      return;
    }
    
    // Execute content script in the current tab
    chrome.tabs.executeScript(tab.id, {
      file: 'content.js'
    });
  });