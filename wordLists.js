// Predefined mute word lists by category
const wordLists = {
  // Categories will be populated dynamically
};

// Function to fetch word lists from GitHub repository
async function fetchWordLists() {
  try {
    // List of categories from XMuteList repository
    const categories = [
      'ai',
      'conspiracy',
      'crypto',
      'gaming',
      'health',
      'politics',
      'social_issues',
      'social_media',
      'sports'
    ];

    const fetchedLists = {};
    
    // Fetch each category file
    for (const category of categories) {
      const response = await fetch(`https://raw.githubusercontent.com/eomene/XMuteList/main/${category}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} word list: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate the data structure
      if (!data || !Array.isArray(data.words)) {
        throw new Error(`Invalid data format for ${category}`);
      }
      
      // Store the words in the fetchedLists object
      fetchedLists[category] = data.words;
    }
    
    return fetchedLists;
  } catch (error) {
    console.error('Error fetching word lists:', error);
    // Show error message to user
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.textContent = 'Failed to load word lists from server. Please try again later.';
      statusMessage.className = 'status error';
      setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = 'status';
      }, 5000);
    }
    return null;
  }
}

// Function to create word items in the UI
function createWordItems() {
  // For each category, populate the list
  Object.keys(wordLists).forEach(category => {
    const listElement = document.getElementById(`${category}-list`);
    if (!listElement) return;
    
    wordLists[category].forEach(word => {
      const wordItem = document.createElement('div');
      wordItem.className = 'word-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = word;
      checkbox.dataset.category = category;
      checkbox.checked = true;
      
      const label = document.createTextNode(word);
      
      wordItem.appendChild(checkbox);
      wordItem.appendChild(label);
      
      // Make the whole div clickable
      wordItem.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      });
      
      listElement.appendChild(wordItem);
    });
  });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const fetchedLists = await fetchWordLists();
  if (fetchedLists) {
    // Update the wordLists object with fetched data
    Object.assign(wordLists, fetchedLists);
    createWordItems();
  } else {
    // Show error message if fetch fails
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.textContent = 'Unable to load word lists. Please check your internet connection and try again.';
      statusMessage.className = 'status error';
    }
  }
}); 