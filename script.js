// Define the Book class to create book objects
class Book {
  constructor(author, title, pages, id, image, schoolid, genre, desc) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.id = id;
    this.image = image;
    this.schoolid = schoolid;
    this.genre = genre;
    this.desc = desc;
  }
}

// Select DOM elements
const booksContainer = document.querySelector(".books-container"); // Container element to display books
const newButton = document.querySelector(".new-book"); // Button to open the modal form
const modal = document.querySelector(".modal"); // Modal element
const closeButton = document.querySelector(".close"); // Close button inside the modal
const modalForm = document.querySelector(".modal form"); // Form element inside the modal
const sortDropdown = document.querySelector("#sort-dropdown"); // Dropdown element for sorting
const loginForm = document.querySelector("#loginForm"); // Login form element
const loginModal = document.querySelector("#loginModal"); // Login modal element
const searchInput = document.querySelector("#searchInput"); // Search input element

let myLibrary = []; // Array to store the books in the library

// Initially hide the add book option
newButton.style.display = "none";

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const authenticatedUser = users.find(user => user.username === username && user.password === password);

  if (authenticatedUser) {
    // Show the add book option
    newButton.style.display = "block";

    // Show the remove buttons in the book cards
    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach(button => {
      button.style.display = "block";
    });

    // Close the login modal or hide the login form
    loginModal.style.display = "none";
  } else {
    alert("Invalid username or password. Please try again.");
  }
});

// Open the modal form when the "New Book" button is clicked
newButton.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close the modal form when the close button is clicked
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close the modal form when the user clicks outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Sorting the books by author, title, pages, schoolid, and genre
sortDropdown.addEventListener("change", () => {
  const selectedOption = sortDropdown.value;

  switch (selectedOption) {
    case "author":
      myLibrary.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "title":
      myLibrary.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "pages":
      myLibrary.sort((a, b) => a.pages - b.pages);
      break;
    case "schoolid":
      myLibrary.sort((a, b) => a.schoolid - b.schoolid);
      break;
    case "genre":
      myLibrary.sort((a, b) => a.genre.localeCompare(b.genre));
      break;
    case "desc":
      myLibrary.sort((a, b) => a.desc.localeCompare(b.desc));
      break;
    default:
      // Handle unknown or default option
      break;
  }
  // Clear the books container and display the sorted library
  booksContainer.textContent = "";
  displayBooks(myLibrary);
});

// Handle form submission
modalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form input values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const id = Date.now(); // Generate a unique ID using the current timestamp
  const schoolid = document.querySelector("#schoolid").value;
  const genre = document.querySelector("#genre").value; // Get genre value
  const desc = document.querySelector("#desc").value;

  // Get the selected image file if provided
  const imageInput = document.querySelector("#image");
  let image = "./book.png"; // Default empty image URL
  imageInput.classList.add("default-image");
  if (imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    image = URL.createObjectURL(imageFile);
  }

  // Add the new book to the library
  addBookToLibrary(author, title, pages, id, image, schoolid, genre, desc);

  // Clear the books container and display the updated library
  booksContainer.textContent = "";
  displayBooks(myLibrary);

  // Reset the form
  modalForm.reset();

  // Close the modal form
  modal.style.display = "none";
});

// Display the books in the library
const displayBooks = (library) => {
  booksContainer.innerHTML = "";
  library.forEach((book, index) => {
    // Create a div container for the book card
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    // Create a div container for CRUD actions
    const crudContainer = document.createElement("div");
    crudContainer.classList.add("crud-container", "hidden");

    // Create an icon element for the trash can
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fas", "fa-trash-can", "fa-light", "fa-lg");
    trashIcon.style.color = "#000000";
    crudContainer.appendChild(trashIcon);

    // Add event listener to the trash icon for remove functionality
    trashIcon.addEventListener("click", () => {
      const result = myLibrary.filter((book, idx) => idx !== index);
      myLibrary = result;
      displayBooks(myLibrary);
    });

    // Create a card element for the book
    const card = document.createElement("div");
    card.classList.add("bookcard");

    // Create an image element for the book cover
    const coverElement = document.createElement("img");
    coverElement.classList.add("cover");
    if (book.image == "./book.png") coverElement.classList.add("default-image");
    coverElement.src = book.image; // Set the image source dynamically
    card.appendChild(coverElement);

    // Create a title element and set its text content
    const titleElement = document.createElement("h3");
    titleElement.textContent = book.title;
    card.appendChild(titleElement);

    // Create an author element and set its text content
    const authorElement = document.createElement("p");
    authorElement.textContent = `Author: ${book.author}`;
    card.appendChild(authorElement);

    // Create a pages element and set its text content
    const pagesElement = document.createElement("p");
    pagesElement.textContent = `Pages: ${book.pages}`;
    card.appendChild(pagesElement);
    
    //create a schoolid element and set its number
    const schoolIdElement = document.createElement("p");
    schoolIdElement.textContent = `School ID: ${book.schoolid}`;
    card.appendChild(schoolIdElement);

    // Create a genre element and set its text content
    const genreElement = document.createElement("p");
    genreElement.textContent = `Genre: ${book.genre}`;
    card.appendChild(genreElement);

    const descElement = document.createElement("p");
    descElement.textContent = `Desc: ${book.desc}`;
    card.appendChild(descElement);

    // Create a remove button for deleting the book
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.setAttribute("data-id", index); // Use index as data-id

    // Add event listener to the remove button for remove functionality
    removeButton.addEventListener("click", (e) => {
      const dataID = parseInt(e.target.getAttribute("data-id"));
      const result = myLibrary.filter((book, index) => index !== dataID);
      myLibrary = result;
      displayBooks(myLibrary);
    });

    // Toggle the remove button visibility based on login status
    if (newButton.style.display === "block") {
      removeButton.style.display = "block";
    } else {
      removeButton.style.display = "none";
    }

    card.appendChild(removeButton);

    // Append the CRUD container to the card container
    cardContainer.appendChild(crudContainer);

    // Append the book card to the card container
    cardContainer.appendChild(card);

    // Append the card container to the books container
    booksContainer.appendChild(cardContainer);
  });
};

// Add a book to the library
function addBookToLibrary(author, title, pages, id, image, schoolid, genre, desc) {
  const newBook = new Book(author, title, pages, id, image, schoolid, genre, desc);
  myLibrary.push(newBook);
}

// Load the JSON data and process it
fetch("./books.json")
  .then((response) => response.json())
  .then((data) => {
    myLibrary = data.map((bookData) => {
      const { author, title, pages, id, image, schoolid, genre, desc } = bookData; // Destructuring
      return new Book(author, title, pages, id, image, schoolid, genre, desc);
    });

    // Display the books in the library
    displayBooks(myLibrary);
  });

// Implement authentication logic
const users = [
  { "username": "admin", "password": "password123" }
];

// Event listener for the search input
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm === "") {
    // Reset the books container to show all books
    booksContainer.textContent = "";
    displayBooks(myLibrary);
  } else {
    const filteredBooks = myLibrary.filter(book => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      const genre = book.genre.toLowerCase();
      const bookId = book.schoolid.toString().toLowerCase(); // Convert book ID to string for comparison
      return (
        title.includes(searchTerm) ||
        author.includes(searchTerm) ||
        genre.includes(searchTerm) ||
        bookId.includes(searchTerm) // Check if the search term matches book ID
      );
    });

    // Clear the books container and display the filtered library
    booksContainer.textContent = "";
    displayBooks(filteredBooks);
  }
});
