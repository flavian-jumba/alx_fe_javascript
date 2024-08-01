document.addEventListener("DOMContentLoaded", () => {
    // Initial quotes array
    const quotes = [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Get busy living or get busy dying.", category: "Motivation" },
      { text: "You only live once, but if you do it right, once is enough.", category: "Life" },
      { text: "The purpose of our lives is to be happy.", category: "Happiness" }
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
  
    // Show a random quote
    const showRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
    };
  
    // Add new quote
    const addQuote = () => {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert("New quote added successfully!");
      } else {
        alert("Please fill out both fields.");
      }
    };
  
    // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    window.addQuote = addQuote;
  
    // Initial quote display
    showRandomQuote();
  });
  