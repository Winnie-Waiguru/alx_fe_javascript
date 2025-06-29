document.addEventListener("DOMContentLoaded", function () {
  // get last selected value
  let savedCategory = localStorage.getItem("lastSelectedCategory");
  // Display  quotes based on the last selected Category
  if (savedCategory) {
    select.value = savedCategory;
  }
  filterQuotes();
});

const showQuoteBtn = document.getElementById("newQuote");
const quoteDisplayContainer = document.getElementById("quoteDisplay");
const select = document.getElementById("categoryFilter");
const syncAlert = document.getElementById("syncAlert");
const syncMessage = document.getElementById("syncMessage");
const resolveBtn = document.getElementById("resolveConflictBtn");

//When the page loads, try to get the existing quotes from local storage
let quoteObj = JSON.parse(localStorage.getItem("quoteItem")) || [];
populateCategories(); // Call populate categories after fetching local storage quotes

// If not an array reset it
if (!Array.isArray(quoteObj)) {
  quoteObj = [];
  console.log(`quoteObj: ${quoteObj}`); //to be removed
}

//   Display random Quote
const createAddQuoteForm = function () {
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
    populateCategories(); //Populate new categories if added
    filterQuotes();
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

    populateCategories();
    filterQuotes();
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

//Downloading quotes
const exportBtn = document.getElementById("exportQuotes");
exportBtn.addEventListener("click", function () {
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

//Listen when a new file is added
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);

//function to Populate Categories Dynamically
function populateCategories() {
  // Retrieve last saved category
  const savedCategory = localStorage.getItem("lastSelectedCategory");

  // Keep only the first option ("All Categories"), remove the rest
  select.innerHTML = '<option value="all">All Categories</option>';

  let categoriesArr = [];

  quoteObj.map((element) => {
    if (!categoriesArr.includes(element.category)) {
      categoriesArr.push(element.category);
    }
  });

  categoriesArr.forEach((optionItem) => {
    const option = document.createElement("option");
    option.value = optionItem;
    option.textContent = optionItem;
    select.appendChild(option);
  });

  //Restore saved category if it still exsist
  if (
    savedCategory &&
    (savedCategory === "all" || categoriesArr.includes(savedCategory))
  ) {
    select.value = savedCategory;
  } else {
    select.value = "all";
  }
}

//function to filter Quotes Based on Selected Category
function filterQuotes() {
  // clear quote display container
  quoteDisplayContainer.innerHTML = "";
  let selectedOption = select.value;
  if (selectedOption === "all") {
    // show all quotw
    quoteObj.forEach((element) => {
      let paragraphItem = document.createElement("p");
      paragraphItem.textContent = `${element.text} -${element.category}`;
      quoteDisplayContainer.append(paragraphItem);
    });
  } else {
    // show elements based on category
    let results = quoteObj.filter((item) => {
      return item.category === selectedOption;
    });

    for (let index = 0; index < results.length; index++) {
      let paragraphItem = document.createElement("p");
      paragraphItem.textContent = `${results[index].text} -${results[index].category}`;
      quoteDisplayContainer.appendChild(paragraphItem);
    }
  }
}

// Display last selected Category
function selectedCategory() {
  localStorage.setItem("lastSelectedCategory", select.value); //store last selected category
  filterQuotes();
}

// add event listener to select to store selected values
select.addEventListener("change", selectedCategory);

//stimulate server interaction
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  console.log("Here are the posts:", data.slice(0, 5));
}

setInterval(fetchQuotesFromServer, 5000); //fech data periodically

// Posting data
fetch("https://jsonplaceholder.typicode.com/posts"),
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "My Post",
      body: "Hello server!",
      userId: 1,
    }),
  }
    .then((response) => response.json())
    .then((json) => console.log(json));

//Syncing new quotes
async function syncQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    // Simulate only 5 quotes for simplicity
    const trimmedServerQuotes = serverQuotes.slice(0, 5).map((item) => ({
      text: item.title,
      category: "Server", // Add a category because your UI needs it
    }));

    const localQuotes = JSON.parse(localStorage.getItem("quoteItem")) || [];

    // Compare stringified versions
    if (JSON.stringify(trimmedServerQuotes) !== JSON.stringify(localQuotes)) {
      console.log("New server quotes found. Syncing now...");
      localStorage.setItem("quoteItem", JSON.stringify(trimmedServerQuotes));
      quoteObj = trimmedServerQuotes;
      populateCategories();
      filterQuotes();
    } else {
      console.log("Server data matches local data. No need to update.");
    }
  } catch (error) {
    console.error("Failed to sync quotes:", error);
  }
}

setInterval(syncQuotes, 5000); // sync data every 5 seconds

// Conflict resolutions
let pendingServerQuotes = []; // this holds the new quotes temporarily

async function syncQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    const trimmedQuotes = serverQuotes.slice(0, 5).map((item) => ({
      text: item.title,
      category: "Server",
    }));

    const localQuotes = JSON.parse(localStorage.getItem("quoteItem")) || [];

    if (JSON.stringify(trimmedQuotes) !== JSON.stringify(localQuotes)) {
      console.log("Conflict detected — server data differs.");
      pendingServerQuotes = trimmedQuotes; // store temporarily
      syncAlert.style.display = "block"; // show the message
      syncMessage.textContent =
        "New quotes found on the server. Click 'Update Now' to sync.";
    } else {
      console.log("Quotes synced with server!");
      syncAlert.style.display = "none"; // hide message
    }
  } catch (error) {
    console.error("Failed to sync quotes:", error);
  }
}

resolveBtn.addEventListener("click", function () {
  if (pendingServerQuotes.length > 0) {
    localStorage.setItem("quoteItem", JSON.stringify(pendingServerQuotes));
    quoteObj = pendingServerQuotes;
    populateCategories();
    filterQuotes();
    syncAlert.style.display = "none"; // hide alert
    console.log("Quotes updated manually by the user.");
  }
});
