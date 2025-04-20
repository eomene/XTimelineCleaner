// This script is injected into Twitter/X pages
console.log('Twitter Mute Words Manager: Content script loaded');

// Add a visual indicator that the extension is loaded (for debugging)
function addExtensionIndicator() {
  const indicator = document.createElement('div');
  indicator.style.position = 'fixed';
  indicator.style.bottom = '10px';
  indicator.style.right = '10px';
  indicator.style.backgroundColor = 'rgba(29, 161, 242, 0.8)';
  indicator.style.color = 'white';
  indicator.style.padding = '5px 10px';
  indicator.style.borderRadius = '5px';
  indicator.style.fontSize = '12px';
  indicator.style.zIndex = '9999';
  indicator.textContent = 'Twitter Mute Words Manager Active';
  indicator.style.display = 'none'; // Hidden by default, for debugging set to 'block'
  
  document.body.appendChild(indicator);
}

// Run when the page is fully loaded
window.addEventListener('load', () => {
  console.log('Twitter Mute Words Manager: Page loaded');
  addExtensionIndicator();
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Twitter Mute Words Manager: Received message:', message);
  
  if (message.action === 'checkTwitter') {
    const isTwitter = window.location.href.includes('twitter.com') || window.location.href.includes('x.com');
    console.log('Twitter Mute Words Manager: Is Twitter page:', isTwitter);
    sendResponse({ isTwitter });
  }
  
  // Always return true to indicate we'll handle the response asynchronously
  return true;
}); 