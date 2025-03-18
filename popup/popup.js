document.addEventListener("DOMContentLoaded", () => {
    let domain = "";
  
    //  Get the current tab's domain
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      domain = new URL(tabs[0].url).hostname;
    });
  
    //  Add a Cookie (User Input)
    document.getElementById("addCookie").addEventListener("click", () => {
      let name = document.getElementById("cookieName").value.trim();
      let value = document.getElementById("cookieValue").value.trim();
  
      if (!name || !value) {
        alert(" Please enter both a cookie name and value.");
        return;
      }
  
      chrome.runtime.sendMessage({ action: "addCookie", name, value, domain }, (response) => {
        alert(response.status);
        document.getElementById("cookieName").value = "";
        document.getElementById("cookieValue").value = "";
      });
    });
  
    //  Clear All Cookies
    document.getElementById("clearCookies").addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "clearCookies", domain }, (response) => {
        alert(response.status);
        updateCookieList(); // Refresh cookie list after clearing
      });
    });
  
    //  Show Current Cookies
    document.getElementById("showCookies").addEventListener("click", updateCookieList);
  
    function updateCookieList() {
      
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            let activeTabDomain = new URL(tabs[0].url).hostname;
      
            chrome.runtime.sendMessage({ action: "getCookies", domain: activeTabDomain }, (response) => {
              let cookieList = document.getElementById("cookieList");
              cookieList.innerHTML = "";
      
              if (!response || !response.cookies || response.cookies.length === 0) {
                cookieList.innerHTML = "<li>No cookies found.</li>";
                return;
              }
      
              response.cookies.forEach((cookie) => {
                let li = document.createElement("li");
                li.textContent = `${cookie.name} = ${cookie.value}`;
                cookieList.appendChild(li);
              });
            });
      });
    }
  });
  
