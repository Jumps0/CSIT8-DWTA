// Check if modal already exists
if (!document.getElementById('modal-test-container')) {
    // Generate random number if 'found' isn't set
    const found = 0;
    //chrome.tabs.get(tab_id, function (tab) {
    //    found = getTrackerCount(tab_id);
    //});

    // Inject modal HTML
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-test-container';
    
    // Fetch modal HTML
    fetch(chrome.runtime.getURL('modal.html'))
      .then(response => response.text())
      .then(html => {
        // Replace placeholder with the found value
        const updatedHtml = html.replace('{{FOUND}}', found);
        modalContainer.innerHTML = updatedHtml;
        
        // Inject CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('modal.css');
        modalContainer.appendChild(link);
        
        // Add to document
        document.body.appendChild(modalContainer);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          modalContainer.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(modalContainer)) {
              document.body.removeChild(modalContainer);
            }
          }, 300); // Match this with CSS transition time
        }, 5000);
      });
  }