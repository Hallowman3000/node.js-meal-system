// document.addEventListener('DOMContentLoaded');

// Fetch data from the JSON file
fetch('/data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    // Assume data contains an array of items
    const cards = data; // Assign the fetched data to the `cards` variable

    // Set up pagination variables
    const menuContainer = document.getElementsByClassName("menu__cards")[0];
    const paginationContainer = document.getElementsByClassName("pagination")[0];

    const itemsPerPage = 12;
    let currentPage = 1;
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    // Function to render menu items
    function renderMenuItems() {
      menuContainer.innerHTML = "";
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const itemsToDisplay = cards.slice(start, end);

      itemsToDisplay.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("menu__card");

        // Truncate the description
        const maxWords = 20; // Set max number of words to display
        const words = item.description.split(" ");
        const truncatedDescription = words.length > maxWords 
            ? words.slice(0, maxWords).join(" ") + "..." 
            : item.description;

        card.innerHTML = `
            <img src="${item.image}" alt="" class="card__img" />
            <div class="card__content">
                <div class="card__ratings">
                    <h3 class="card__rate">${item.rate}</h3>
                    <p class="card_star-rate">${item.star}</p>
                </div>
                <div class="card__text">
                    <h1 class="card__title">${item.name}</h1>
                    <p class="card__description">
                        ${truncatedDescription}
                        <a href="details.html?id=${item.id}" class="view-more">View More</a>
                    </p>
                </div>
                <div class="card__bottom">
                    <h2 class="card__price">Ksh.${item.price}</h2>
                    <button class="card__btn" data-id="${item.id}">Add</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
      });

      // Add event listeners for "Add" buttons
      const addButtons = document.querySelectorAll(".card__btn");
      addButtons.forEach(button => {
        button.addEventListener("click", () => {
          const itemId = button.getAttribute("data-id");
          addToCart(itemId);
        });
      });
    }

    // Function to render pagination
    function renderPagination() {
      paginationContainer.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("pagination__button");
        if (i === currentPage) {
          pageButton.classList.add("active");
        }
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => {
          currentPage = i;
          renderMenuItems();
          renderPagination();
        });
        paginationContainer.appendChild(pageButton);
      }
    }

    // Initial render
    renderMenuItems();
    renderPagination();
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});

 