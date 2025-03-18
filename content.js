function highlightAds() {
    let ads = document.querySelectorAll("iframe, .ad, [id*='ad'], [class*='ad']");
    
    ads.forEach((ad) => {
      if (!ad.dataset.labeled) {
        ad.dataset.labeled = "true"; // Mark ad as labeled to prevent duplicates
  
        // Ensure ad is visible and large enough to be an actual ad
        let rect = ad.getBoundingClientRect();
        if (rect.width < 50 || rect.height < 50) return; // Avoid small elements
  
        ad.style.outline = "2px solid red"; // Optional: Highlight real ads
      }
    });
  }
  
  // Run on page load
  highlightAds();
  
  // Detect dynamically loaded ads
  const observer = new MutationObserver(() => {
    highlightAds();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  