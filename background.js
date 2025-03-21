chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let domain = message.domain || "";

  //  Clear All Cookies
  if (message.action === "clearCookies") {
    chrome.cookies.getAll({ domain }, (cookies) => {
      cookies.forEach((cookie) => {
        chrome.cookies.remove({ url: "https://" + cookie.domain, name: cookie.name });
      });

      sendResponse({ status: "Cookies Cleared!" });
    });
    return true; // Ensures async response works
  }

  //  Add Custom Cookie
  else if (message.action === "addCookie") {
    chrome.cookies.set({
      url: "https://" + domain,
      name: message.name, 
      value: message.value,
      expirationDate: Date.now() / 1000 + 3600
    });

    sendResponse({ status: `Cookie "${message.name}" added!` });
    return true; // Ensures async response works
  }

  //  Get All Cookies
  else if (message.action === "getCookies") {
    chrome.cookies.getAll({ domain }, (cookies) => {
      sendResponse({ cookies: cookies || [] });
    });
    return true; // Keeps async message channel open
  }
 
});
