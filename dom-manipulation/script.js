const showQuoteBtn = document.getElementById("newQuote");
const quoteObj = [
  {
    quote:
      "Don't wait for the perfect moment. Take the moment and make it perfect.",
    category: "Motivation",
  },
  {
    quote: "Life is short. Smile while you still have teeth.",
    category: "Humor",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    category: "Inspiration",
  },
  {
    quote: "Your vibe attracts your tribe.",
    category: "Self-Development",
  },
  {
    quote: "The best view comes after the hardest climb.",
    category: "Perseverance",
  },
];

//   Display random Quote
const displayRandomQuote = function () {
  const quoteDisplayContainer = document.getElementById("quoteDisplay");
  let randomIndex = Math.floor(Math.random() * quoteObj.length);
  let showRandomQuote = quoteObj[randomIndex];

  const newItem = document.createElement("p");
  newItem.textContent = `${showRandomQuote.quote} - ${showRandomQuote.category}`;
  newItem.id = "quote-paragraph"; //Giving paragraph element an ID
  quoteDisplayContainer.appendChild(newItem);
};

const clearRandomQote = function () {
  const quotePara = document.getElementById("quote-paragraph");
  if (quotePara) {
    quotePara.textContent = "";
  }
};

//   Add event listener to show new quote button
showQuoteBtn.addEventListener("click", function () {
  displayRandomQuote();

  setTimeout(clearRandomQote, 2000); // clear quote display container after 2 seconds
});

//   Dynamically Add new quotes
const addQuote = function () {
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");

  if (newQuoteText.value !== "" && newQuoteCategory.value !== "") {
    let newQuoteObject = {
      quote: newQuoteText.value,
      category: newQuoteCategory.value,
    };

    quoteObj.push(newQuoteObject);
    console.log(quoteObj);
  }
};
