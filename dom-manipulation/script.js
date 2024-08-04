let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Motivation" },
  { text: "You only live once, but if you do it right, once is enough.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Happiness" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const conflictNotification = document.getElementById('conflictNotification');

// Simulate server interaction
const fetchQuotesFromServer = async () => {
  // Simulating a server fetch with a mock API (JSONPlaceholder)
  const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Replace with your API
  const serverQuotes = await response.json();
  return serverQuotes.map(quote => ({
    text: quote.title, // Adjust according to the actual API response structure
    category: "General" // Default category for server quotes
  }));
};

const syncWithServer = async () => {
  const serverQuotes = await fetchQuotesFromServer();
  const mergedQuotes = mergeQuotes(quotes, serverQuotes);
  if (mergedQuotes.conflict) {
    conflictNotification.innerText = "Data conflict detected! Server data has been prioritized.";
  } else {
    conflictNotification.innerText = "";
  }
  quotes = mergedQuotes.data;
  localStorage.setItem('quotes', JSON.stringify(quotes));
  filterQuotes();
};

const mergeQuotes = (local, server) => {
  let conflict = false;
  const merged = [...local];

  server.forEach(serverQuote => {
    const existingIndex = local.findIndex(localQuote => localQuote.text === serverQuote.text);
    if (existingIndex !== -1) {
      conflict = true; // Conflict detected
      merged[existingIndex] = serverQuote; // Server data takes precedence
    } else {
      merged.push(serverQuote);
    }
  });

  return { data: merged, conflict };
};

// Show a random quote
const showRandomQuote = () => {
  const filteredQuotes = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
};

// Add new quote
const addQuote = () => {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("New quote added successfully!");
  } else {
    alert("Please fill out both fields.");
  }
};

// Export quotes to JSON file
const exportQuotes = () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Import quotes from JSON file
const importFromJsonFile = (event) => {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    alert('Quotes imported successfully!');
    populateCategories();
    filterQuotes();
  };
  fileReader.readAsText(event.target.files[0]);
};

// Load last viewed quote from session storage
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
  quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><p><em>Category: ${lastQuote.category}</em></p>`;
} else {
  showRandomQuote();
}

// Populate category filter dropdown
const populateCategories = () => {
  const categories = Array.from(new Set(quotes.map(quote => quote.category)));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const lastCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = lastCategory;
};

// Get filtered quotes
const getFilteredQuotes = () => {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === selectedCategory);
};

// Filter quotes based on selected category
const filterQuotes = () => {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
  }
};

// Initialize
populateCategories();
filterQuotes();
setInterval(syncWithServer, 10000); // Sync with server every 10 seconds

// Event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
window.addQuote = addQuote;
window.exportQuotes = exportQuotes;
window.importFromJsonFile = importFromJsonFile;