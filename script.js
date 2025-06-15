let currentCfdDrinks = [];
let fdBoxCfdDrinks = [];

const cFdDrinkContainer = document.getElementById("cFdDrinkContainer");
const inHtmlf = document.getElementById("detailsInHtmlf");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const fdBoxCount = document.getElementById("fdBoxCount");
const fdBoxItems = document.getElementById("fdBoxItems");

searchBtn.addEventListener("click", searchBrinks);
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchBrinks();
  }
});

window.addEventListener("DOMContentLoaded", function () {
  fetchBrinks("margarita");
});

async function fetchBrinks(searchTerm) {
  try {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );
    const data = await response.json();

    if (data.drinks) {
      currentCfdDrinks = data.drinks;
      displayBrinks(currentCfdDrinks);
    } else {
      currentCfdDrinks = [];
      showNoResults();
    }
  } catch (error) {
    console.error("Error fetching brinks:", error);
    showNoResults();
  }
}

function displayBrinks(drinks) {
  cFdDrinkContainer.innerHTML = "";

  drinks.forEach((drink) => {
    const shortInstructions = drink.strInstructions
      ? drink.strInstructions.substring(0, 100) +
        (drink.strInstructions.length > 100 ? "..." : "")
      : "No instructions available";

    const drinkCard = document.createElement("div");
    drinkCard.className = "col";
    drinkCard.innerHTML = `
            <div class="card h-100">
              <img src="${drink.strDrinkThumb}" alt="${
      drink.strDrink
    }" class="cFd-Drink-image card-img-top">
              <div class="card-body">
                <h5 class="card-title">${drink.strDrink.slice(0, 10)}</h5>
                <p class="card-text text-muted small">${drink.strCategory.slice(
                  0,
                  10
                )}</p>
                <p class="card-text">${shortInstructions.slice(0, 10)}</p>
              </div>
              <div class="card-footer bg-transparent">
                <div class="d-flex justify-content-between">
                  <button class="btn btn-success btn-sm add-to-chart-btn" data-id="${
                    drink.idDrink
                  }">Add to chart</button>
                  <button class="btn btn-primary btn-sm details-btn" data-id="${
                    drink.idDrink
                  }">Details</button>
                </div>
              </div>
            </div>
          `;

    cFdDrinkContainer.appendChild(drinkCard);
  });

  document.querySelectorAll(".add-to-chart-btn").forEach((btn) => {
    btn.addEventListener("click", addToFdBox);
  });

  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", showDetails);
  });
}

function showNoResults() {
  cFdDrinkContainer.innerHTML = `
          <div class="col-12 text-center text-muted py-5">
            <h4>No drinks found</h4>
          </div>
        `;
}

function searchBrinks() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchBrinks(searchTerm);
  }
}

function addToFdBox(e) {
  const drinkId = e.target.getAttribute("data-id");
  if (fdBoxCfdDrinks.length >= 7) {
    alert("not allow");
    return;
  }

  if (fdBoxCfdDrinks.some((drink) => drink.idDrink === drinkId)) {
    alert("This in your chart! you have in chart");
    return;
  }

  const drinkToAdd = currentCfdDrinks.find(
    (drink) => drink.idDrink === drinkId
  );

  if (drinkToAdd) {
    fdBoxCfdDrinks.push(drinkToAdd);
    updateFdBoxDisplay();
  }
}

function updateFdBoxDisplay() {
  fdBoxItems.innerHTML = "";
  fdBoxCount.textContent = fdBoxCfdDrinks.length;

  fdBoxCfdDrinks.forEach((drink) => {
    const fdBoxItem = document.createElement("div");
    fdBoxItem.className =
      "d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded";
    fdBoxItem.innerHTML = `
            <span>${drink.strDrink.slice(0, 8)}</span>
            <button class="btn btn-danger btn-sm remove-from-chart-btn" data-id="${drink.idDrink.slice(
              0,
              9
            )}">×</button>
          `;
    fdBoxItems.appendChild(fdBoxItem);
  });
}

function showDetails(e) {
  const drinkId = e.target.getAttribute("data-id");
  const drink = currentCfdDrinks.find((d) => d.idDrink === drinkId);

  if (drink) {
    document.getElementById("inHtmlfDrinkName").textContent = drink.strDrink;
    document.getElementById("inHtmlfGlass").textContent = drink.strGlass;
    document.getElementById("inHtmlfDrinkImage").src = drink.strDrinkThumb;
    document.getElementById("inHtmlfCategory").textContent = drink.strCategory;
    document.getElementById("inHtmlfAlcoholic").textContent =
      drink.strAlcoholic;
    document.getElementById("inHtmlfInstructions").textContent =
      drink.strInstructions || "Not available";

    const itemsFdList = document.getElementById("inHtmlfItemsFd");
    itemsFdList.innerHTML = "";

    for (let i = 1; i <= 15; i++) {
      const item = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
    }
  }
}
