const showQuoteBtn = document.getElementById("newQuote");
//When the page loads, try to get the existing quotes from local storage
let quoteObj = JSON.parse(localStorage.getItem("quoteItem")) || [];

// If not an array reset it
if (!Array.isArray(quoteObj)) {
  quoteObj = [];
  console.log(`quoteObj: ${quoteObj}`); //to be removed
}

//   Display random Quote
const createAddQuoteForm = function () {
  const quoteDisplayContainer = document.getElementById("quoteDisplay");

  //   check if there any quotes
  if (quoteObj.length === 0) {
    quoteDisplayContainer.innerHTML = "There are no quotes to display";
    return;
  }

  let randomIndex = Math.floor(Math.random() * quoteObj.length);
  let showRandomQuote = quoteObj[randomIndex];

  //   clear previous text/quotes
  quoteDisplayContainer.innerHTML = "";

  const newItem = document.createElement("p");
  newItem.innerHTML = `${showRandomQuote.text} - ${showRandomQuote.category}`;
  newItem.id = "quote-paragraph"; //Giving paragraph element an ID
  quoteDisplayContainer.appendChild(newItem);
};

//clear quote after 2 seconds
const clearRandomQote = function () {
  const quotePara = document.getElementById("quote-paragraph");
  if (quotePara) {
    quotePara.remove(); //remove previous existing quote
  }
};

//   Show new quote when button is clicked
showQuoteBtn.addEventListener("click", function () {
  createAddQuoteForm();

  setTimeout(clearRandomQote, 2000); // clear quote display container after 2 seconds
});

//save quote
function saveQuotes() {
  localStorage.setItem("quoteItem", JSON.stringify(quoteObj));
}

//   Dynamically Add new quotes
const addQuote = function () {
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");

  if (newQuoteText.value !== "" && newQuoteCategory.value !== "") {
    let newQuoteObject = {
      text: newQuoteText.value,
      category: newQuoteCategory.value,
    };

    quoteObj.push(newQuoteObject); // push new quote to the array

    saveQuotes(); //saving the updated quote object to local storage

    // clear users input
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }
};

// function to import quotes from a file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quoteObj.push(...importedQuotes); // push imported quotes to my quote object
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

//Downloading quotes
//   create an button element
const downloadBtn = document.createElement("button");
downloadBtn.textContent = "Download Quotes";
downloadBtn.addEventListener("click", function () {
  // Data to download
  // Data in the quoteObj
  const filename = "quotes.json";
  const type = "application/json";

  //   Create blob object
  const blob = new Blob([JSON.stringify(quoteObj, null, 2)], { type: type });

  //   Create a URL for the blob
  const url = URL.createObjectURL(blob);

  //   create an anchor element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  //Append link to the button
  document.body.appendChild(link);

  //   click the link to start the download
  link.click();

  //clear link
  document.body.removeChild(link);
});
document.body.appendChild(downloadBtn);

//Listen when a new file is added
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
