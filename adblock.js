// adblock.js
document.addEventListener("DOMContentLoaded", function () {
  const adSelectors = [
    'iframe[src*="ads"]',
    'iframe[src*="ad"]',
    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    'script[src*="ads"]',
    'div[class*="ad"]',
    'div[id*="ad"]',
    '[id^="ads"]',
    '[class^="ads"]'
  ];

  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  const observer = new MutationObserver(() => {
    adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
