document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const categoryPanels = document.querySelectorAll('.category-panel');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show the selected category panel
      categoryPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === category) {
          panel.classList.add('active');
        }
      });
    });
  });
  
  // Select All / Deselect All functionality
  document.querySelectorAll('.category-panel').forEach(panel => {
    const selectAllBtn = panel.querySelector('.select-all-btn');
    const deselectAllBtn = panel.querySelector('.deselect-all-btn');
    
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        if (panel.id === 'custom') {
          // For custom category, select all lines in textarea
          const textarea = panel.querySelector('textarea');
          textarea.select();
        } else {
          // For other categories, check all checkboxes
          const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => checkbox.checked = true);
        }
      });
    }
    
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', () => {
        if (panel.id === 'custom') {
          // For custom category, clear textarea
          const textarea = panel.querySelector('textarea');
          textarea.value = '';
        } else {
          // For other categories, uncheck all checkboxes
          const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => checkbox.checked = false);
        }
      });
    }
  });
  
  // Clean up timeline button functionality
  const cleanupButton = document.getElementById('cleanup-button');
  const statusMessage = document.getElementById('status-message');
  
  if (cleanupButton) {
    cleanupButton.addEventListener('click', async () => {
      try {
        // Change button state to indicate processing
        cleanupButton.disabled = true;
        cleanupButton.textContent = 'Processing...';
        statusMessage.textContent = 'Adding mute words...';
        statusMessage.className = 'status';
        
        // Get selected words from current active category
        const selectedWords = getSelectedWords();
        
        if (selectedWords.length === 0) {
          statusMessage.textContent = 'No words selected!';
          statusMessage.className = 'status error';
          cleanupButton.disabled = false;
          cleanupButton.textContent = 'Clean Up Timeline';
          return;
        }
        
        // Check if we're on a Twitter/X tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.url.includes('twitter.com') && !tab.url.includes('x.com')) {
          statusMessage.textContent = 'Please open Twitter/X first!';
          statusMessage.className = 'status error';
          cleanupButton.disabled = false;
          cleanupButton.textContent = 'Clean Up Timeline';
          return;
        }
        
        // Inject the content script and execute the function to add mute words
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: addMuteWords,
          args: [selectedWords]
        });
        
        // Show success message
        statusMessage.textContent = 'Mute words added successfully!';
        statusMessage.className = 'status success';
      } catch (error) {
        // Show error message
        console.error('Error:', error);
        statusMessage.textContent = 'Error: ' + error.message;
        statusMessage.className = 'status error';
      } finally {
        // Reset button state
        cleanupButton.disabled = false;
        cleanupButton.textContent = 'Clean Up Timeline';
      }
    });
  }
  
  // Function to get selected words from the active category
  function getSelectedWords() {
    const activePanel = document.querySelector('.category-panel.active');
    const category = activePanel.id;
    
    if (category === 'custom') {
      // Get words from the custom textarea
      const customWordsText = document.getElementById('custom-words').value;
      if (!customWordsText.trim()) return [];
      
      // Split by newlines and filter out empty lines
      return customWordsText
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0);
    } else {
      // Get selected words from checkboxes
      const checkboxes = activePanel.querySelectorAll('input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(checkbox => checkbox.value);
    }
  }
});

// This function will be injected into the Twitter page
function addMuteWords(words) {
  // Helper function to wait for an element
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        
        if (Date.now() - startTime >= timeout) {
          reject(new Error(`Timeout: Element ${selector} not found`));
          return;
        }
        
        setTimeout(checkElement, 100);
      };
      
      checkElement();
    });
  }
  
  // Step 1: Click on "More" button in the sidebar
  async function clickMoreButton() {
    try {
      const moreButton = document.querySelector('button[data-testid="AppTabBar_More_Menu"]');
      
      if (moreButton) {
        console.log('Found More button, clicking...');
        moreButton.click();
        return true;
      } else {
        console.error('Could not find More button');
        return false;
      }
    } catch (error) {
      console.error('Error clicking More button:', error);
      return false;
    }
  }
  
  // Step 2: Click on "Settings and privacy"
  async function clickSettingsAndPrivacy() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const settingsLink = document.querySelector('a[href="/settings"]') ||
                          document.querySelector('a[href="/i/settings"]') ||
                          document.querySelector('a[data-testid="settings"]') ||
                          Array.from(document.querySelectorAll('span')).find(el => 
                            el.textContent === 'Settings and privacy' || 
                            el.textContent === 'Settings and Support')?.closest('a');
      
      if (settingsLink) {
        settingsLink.click();
        return true;
      } else {
        console.error('Could not find Settings and privacy');
        return false;
      }
    } catch (error) {
      console.error('Error clicking Settings and privacy:', error);
      return false;
    }
  }
  
  // Step 3: Click on "Privacy and safety"
  async function clickPrivacyAndSafety() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const privacyLink = document.querySelector('a[href="/settings/privacy_and_safety"][data-testid="privacyAndSafetyLink"]');
      
      if (privacyLink) {
        console.log('Found Privacy and safety link, clicking...');
        privacyLink.click();
        return true;
      } else {
        console.error('Could not find Privacy and safety link');
        return false;
      }
    } catch (error) {
      console.error('Error clicking Privacy and safety:', error);
      return false;
    }
  }
  
  // Step 4: Navigate to "Mute and Block" section
  async function navigateToMuteAndBlock() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const muteAndBlockLink = document.querySelector('a[href="/settings/mute_and_block"][data-testid="pivot"]');
      
      if (muteAndBlockLink) {
        console.log('Found Mute and block link, clicking...');
        muteAndBlockLink.click();
        return true;
      } else {
        console.error('Could not find Mute and block link');
        return false;
      }
    } catch (error) {
      console.error('Error navigating to Mute and block:', error);
      return false;
    }
  }
  
  // Step 5: Click on "Muted words"
  async function clickMutedWords() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mutedWordsLink = document.querySelector('a[href="/settings/muted_keywords"]') ||
                            document.querySelector('a[data-testid="muted_keywords"]') ||
                            Array.from(document.querySelectorAll('span')).find(el => 
                              el.textContent === 'Muted words' || 
                              el.textContent === 'Muted keywords')?.closest('a');
      
      if (mutedWordsLink) {
        mutedWordsLink.click();
        return true;
      } else {
        console.error('Could not find Muted words');
        return false;
      }
    } catch (error) {
      console.error('Error clicking Muted words:', error);
      return false;
    }
  }
  
  // Step 6: Remove duplicate words
  async function removeDuplicateWords(words) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get all currently muted words using the correct selector
      const mutedWordElements = document.querySelectorAll('div[role="link"] div[dir="ltr"] span.css-1jxf684');
      const currentMutedWords = new Set();
      
      mutedWordElements.forEach(element => {
        const word = element.textContent.trim();
        if (word) {
          currentMutedWords.add(word.toLowerCase());
        }
      });
      
      // Filter out words that are already muted (case-insensitive)
      const filteredWords = words.filter(word => !currentMutedWords.has(word.toLowerCase()));
      
      console.log('Removed duplicates:', words.length - filteredWords.length);
      return filteredWords;
    } catch (error) {
      console.error('Error removing duplicate words:', error);
      return words; // Return original words if there's an error
    }
  }
  
  // Step 7: Click Add muted word button
  async function clickAddMutedWordButton() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const addMutedWordButton = document.querySelector('a[href="/settings/add_muted_keyword"]') ||
                                document.querySelector('a[aria-label="Add muted word or phrase"]') ||
                                Array.from(document.querySelectorAll('span')).find(el => 
                                  el.textContent === 'Add muted word' || 
                                  el.textContent === 'Add word')?.closest('a');
      
      if (addMutedWordButton) {
        addMutedWordButton.click();
        return true;
      } else {
        console.error('Could not find Add muted word button');
        return false;
      }
    } catch (error) {
      console.error('Error clicking Add muted word button:', error);
      return false;
    }
  }
  
  // Step 8: Process all words in the list
  async function processAllWords(words) {
    try {
      for (const word of words) {
        console.log(`Processing word: ${word}`);
        
        // Step 8: Type word in input field
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const inputField = document.querySelector('input[name="keyword"]');
        if (!inputField) {
          throw new Error('Could not find input field');
        }
        
        inputField.value = word;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Step 9: Click save button
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const saveButton = document.querySelector('button[data-testid="settingsDetailSave"]') ||
                          document.querySelector('button[aria-label="Save"]') ||
                          Array.from(document.querySelectorAll('span')).find(el => 
                            el.textContent === 'Save')?.closest('button');
        
        if (!saveButton) {
          throw new Error('Could not find save button');
        }
        
        saveButton.click();
        
        // Wait for the save operation to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Click Add muted word button again for the next word
        const addMutedWordButton = document.querySelector('a[href="/settings/add_muted_keyword"]') ||
                                  document.querySelector('a[aria-label="Add muted word or phrase"]') ||
                                  Array.from(document.querySelectorAll('span')).find(el => 
                                    el.textContent === 'Add muted word' || 
                                    el.textContent === 'Add word')?.closest('a');
        
        if (!addMutedWordButton) {
          throw new Error('Could not find Add muted word button for next word');
        }
        
        addMutedWordButton.click();
      }
      
      return true;
    } catch (error) {
      console.error('Error processing words:', error);
      return false;
    }
  }
  
  // Main execution function
  async function execute() {
    console.log('Starting Twitter Mute Words Manager...');
    
    // Step 1: Click More button
    if (!await clickMoreButton()) {
      throw new Error('Could not click More button');
    }
    
    // Step 2: Click Settings and privacy
    if (!await clickSettingsAndPrivacy()) {
      throw new Error('Could not click Settings and privacy');
    }
    
    // Step 3: Click Privacy and safety
    if (!await clickPrivacyAndSafety()) {
      throw new Error('Could not click Privacy and safety');
    }
    
    // Step 4: Navigate to Mute and block
    if (!await navigateToMuteAndBlock()) {
      throw new Error('Could not navigate to Mute and block');
    }
    
    // Step 5: Click Muted words
    if (!await clickMutedWords()) {
      throw new Error('Could not click Muted words');
    }
    
    // Step 6: Remove duplicate words
    const filteredWords = await removeDuplicateWords(words);
    if (filteredWords.length === 0) {
      throw new Error('All selected words are already muted');
    }
    
    // Step 7: Click Add muted word button
    if (!await clickAddMutedWordButton()) {
      throw new Error('Could not click Add muted word button');
    }
    
    // Steps 8 & 9: Process all words
    if (!await processAllWords(filteredWords)) {
      throw new Error('Could not process all words');
    }
    
    return true;
  }
  
  // Start the process and return a promise
  return execute();
}

// Export the function for use in the popup
window.addMuteWords = addMuteWords; 