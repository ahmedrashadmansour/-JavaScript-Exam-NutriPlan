const loadingOverlay = document.getElementById("app-loading-overlay");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
const headerMenuBtn = document.getElementById("header-menu-btn");
const navLinks = document.querySelectorAll(".nav-link");

const headerTitle = document.querySelector("#header h1");
const headerSubtitle = document.querySelector("#header p");
const searchInput = document.getElementById("search-input");
const searchFiltersSection = document.getElementById("search-filters-section");
const mealCategoriesSection = document.getElementById("meal-categories-section");
const categoriesGrid = document.getElementById("categories-grid");
const allRecipesSection = document.getElementById("all-recipes-section");
const recipesGrid = document.getElementById("recipes-grid");
const recipesCount = document.getElementById("recipes-count");

const mealDetailsSection = document.getElementById("meal-details");
const backToMealsBtn = document.getElementById("back-to-meals-btn");
const logMealBtn = document.getElementById("log-meal-btn");

const productsSection = document.getElementById("products-section");
const productSearchInput = document.getElementById("product-search-input");
const searchProductBtn = document.getElementById("search-product-btn");
const barcodeInput = document.getElementById("barcode-input");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
const productsGrid = document.getElementById("products-grid");
const productsCount = document.getElementById("products-count");
const nutriScoreFilters = document.querySelectorAll(".nutri-score-filter");

const foodlogSection = document.getElementById("foodlog-section");
const foodlogDate = document.getElementById("foodlog-date");
const loggedItemsList = document.getElementById("logged-items-list");
const clearFoodlogBtn = document.getElementById("clear-foodlog");

const MEALS_API_BASE = "https://www.themealdb.com/api/json/v1/1/";
const FOOD_OFF_BASE = "https://world.openfoodfacts.org/cgi/search.pl";
const BARCODE_OFF_BASE = "https://world.openfoodfacts.org/api/v0/product/";

let mealsList = [];
let categoriesList = [];
let productsList = [];
let foodLogList = JSON.parse(localStorage.getItem("FoodLogList")) || [];
let currentMealDetail = null;

const dailyGoals = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fat: 65,
};

function getCategoryIcon(category) {
  const cat = category.toLowerCase();

  if (cat.includes("beef")) return "fa-drumstick-bite";
  if (cat.includes("chicken")) return "fa-drumstick-bite";
  if (cat.includes("dessert")) return "fa-cake-candles";
  if (cat.includes("lamb")) return "fa-drumstick-bite";
  if (cat.includes("miscellaneous")) return "fa-bowl-rice";
  if (cat.includes("pasta")) return "fa-bowl-food";
  if (cat.includes("pork")) return "fa-bacon";
  if (cat.includes("seafood")) return "fa-fish";
  if (cat.includes("side")) return "fa-wheat-awn";
  if (cat.includes("starter")) return "fa-utensils";
  if (cat.includes("vegan")) return "fa-leaf";
  if (cat.includes("vegetarian")) return "fa-seedling";

  return "fa-utensils";
}

function getCategoryStyles(category) {
  const cat = category.toLowerCase();

  if (cat.includes("beef")) {
    return { cardBg: "#fff1f2", cardBorder: "#ffe4e6", iconBg: "#ff3b5c" };
  }
  if (cat.includes("chicken")) {
    return { cardBg: "#fffbeb", cardBorder: "#fef3c7", iconBg: "#ff9500" };
  }
  if (cat.includes("dessert")) {
    return { cardBg: "#fff1f7", cardBorder: "#fce7f3", iconBg: "#ff2d75" };
  }
  if (cat.includes("lamb")) {
    return { cardBg: "#fffbeb", cardBorder: "#fed7aa", iconBg: "#ff9500" };
  }
  if (cat.includes("miscellaneous")) {
    return { cardBg: "#f8fafc", cardBorder: "#e2e8f0", iconBg: "#64748b" };
  }
  if (cat.includes("pasta")) {
    return { cardBg: "#fffbeb", cardBorder: "#fef08a", iconBg: "#ffb700" };
  }
  if (cat.includes("pork")) {
    return { cardBg: "#fff1f2", cardBorder: "#ffe4e6", iconBg: "#ff3b5c" };
  }
  if (cat.includes("seafood")) {
    return { cardBg: "#f0f9ff", cardBorder: "#bae6fd", iconBg: "#0099ff" };
  }
  if (cat.includes("side")) {
    return { cardBg: "#f0fdf4", cardBorder: "#bbf7d0", iconBg: "#00cc66" };
  }
  if (cat.includes("starter")) {
    return { cardBg: "#ecfeff", cardBorder: "#a5f3fc", iconBg: "#00c4cc" };
  }
  if (cat.includes("vegan")) {
    return { cardBg: "#f0fdf4", cardBorder: "#bbf7d0", iconBg: "#00cc66" };
  }
  if (cat.includes("vegetarian")) {
    return { cardBg: "#f7fee7", cardBorder: "#d9f99d", iconBg: "#74d000" };
  }

  return { cardBg: "#f0fdf4", cardBorder: "#bbf7d0", iconBg: "#00cc66" };
}

function toggleSidebar(show) {
  if (sidebar) {
    if (show) sidebar.classList.add("open");
    else sidebar.classList.remove("open");
  }
  if (sidebarOverlay) {
    if (show) sidebarOverlay.classList.add("active");
    else sidebarOverlay.classList.remove("active");
  }
}

function setupNavigation() {
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", (e) => {
      e.preventDefault();
      let targetTab = "meals";
      const linkText = navLinks[i].textContent.trim();

      if (linkText.includes("Product Scanner")) targetTab = "products";
      else if (linkText.includes("Food Log")) targetTab = "foodlog";
      else targetTab = "meals";

      window.history.pushState(null, "", `#${targetTab}`);
      switchTab(targetTab);
      toggleSidebar(false);
    });
  }
}

function switchTab(targetTab) {
  if (searchFiltersSection) searchFiltersSection.classList.add("hidden");
  if (mealCategoriesSection) mealCategoriesSection.classList.add("hidden");
  if (allRecipesSection) allRecipesSection.classList.add("hidden");
  if (mealDetailsSection) mealDetailsSection.classList.add("hidden");
  if (productsSection) productsSection.classList.add("hidden");
  if (foodlogSection) foodlogSection.classList.add("hidden");

  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove("bg-emerald-50", "text-emerald-700");
    navLinks[i].classList.add("text-gray-600");
  }

  if (targetTab === "products") {
    if (productsSection) productsSection.classList.remove("hidden");
    if (headerTitle) headerTitle.textContent = "Product Scanner";
    if (headerSubtitle) headerSubtitle.textContent = "Search products by name or barcode to log daily items";
    if (navLinks[1]) {
      navLinks[1].classList.add("bg-emerald-50", "text-emerald-700");
      navLinks[1].classList.remove("text-gray-600");
    }
    if (productsList.length === 0) {
      searchProducts("Pepsi");
    }
  } else if (targetTab === "foodlog") {
    if (foodlogSection) foodlogSection.classList.remove("hidden");
    if (headerTitle) headerTitle.textContent = "Daily Food Log";
    if (headerSubtitle) headerSubtitle.textContent = "Track and monitor your calories and macros intake";
    if (navLinks[2]) {
      navLinks[2].classList.add("bg-emerald-50", "text-emerald-700");
      navLinks[2].classList.remove("text-gray-600");
    }
    displayFoodLog();
  } else {
    if (searchFiltersSection) searchFiltersSection.classList.remove("hidden");
    if (mealCategoriesSection) mealCategoriesSection.classList.remove("hidden");
    if (allRecipesSection) allRecipesSection.classList.remove("hidden");
    if (headerTitle) headerTitle.textContent = "Meals & Recipes";
    if (headerSubtitle) headerSubtitle.textContent = "Discover delicious and nutritious recipes tailored for you";
    if (navLinks[0]) {
      navLinks[0].classList.add("bg-emerald-50", "text-emerald-700");
      navLinks[0].classList.remove("text-gray-600");
    }
  }
}

function displayCurrentDate() {
  if (foodlogDate) {
    const options = { weekday: "long", month: "short", day: "numeric" };
    foodlogDate.textContent = new Date().toLocaleDateString("en-US", options);
  }
}

function loadInitialData() {
  getMealCategories();
  getInitialMeals();
}

function getInitialMeals() {
  const xhr = new XMLHttpRequest();
  const url = `${MEALS_API_BASE}search.php?s=`;
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      mealsList = (data.meals || []).slice(0, 25);
      displayMeals(mealsList);
    }
  };
  xhr.send();
}

function getMealCategories() {
  const xhr = new XMLHttpRequest();
  const url = `${MEALS_API_BASE}categories.php`;
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      categoriesList = (data.categories || []).slice(0, 12);
      displayCategories(categoriesList);
    }
  };
  xhr.send();
}

function displayCategories(categories) {
  if (!categoriesGrid) return;
  let box = "";

  for (let i = 0; i < categories.length; i++) {
    const categoryName = categories[i].strCategory;
    const iconClass = getCategoryIcon(categoryName);
    const styles = getCategoryStyles(categoryName);

    box += `<div class="category-card rounded-xl p-3 border hover:shadow-md cursor-pointer transition-all group" 
                 style="background-color: ${styles.cardBg}; border-color: ${styles.cardBorder};" 
                 data-category="${categoryName}">
              <div class="flex items-center gap-2.5">
                <div class="text-white w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" 
                     style="background-color: ${styles.iconBg};">
                  <i class="fa-solid ${iconClass}"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${categoryName}</h3>
                </div>
              </div>
            </div>`;
  }
  categoriesGrid.innerHTML = box;

  const categoryCards = document.querySelectorAll(".category-card");
  for (let j = 0; j < categoryCards.length; j++) {
    categoryCards[j].addEventListener("click", (e) => {
      const selectedCat = e.currentTarget.getAttribute("data-category");
      filterMealsByCategory(selectedCat);
    });
  }
}

function displayMeals(meals) {
  if (!recipesGrid) return;
  let box = "";

  if (!meals || meals.length === 0) {
    recipesGrid.innerHTML = `<div class="col-span-4 text-center py-12 text-gray-500">
                                <i class="fa-solid fa-circle-exclamation text-4xl mb-3 text-emerald-500"></i>
                                <p class="font-medium text-lg">No meals found!</p>
                              </div>`;
    if (recipesCount) recipesCount.textContent = "Showing 0 recipes";
    return;
  }

  for (let i = 0; i < meals.length; i++) {
    const meal = meals[i];
    box += `<div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${meal.idMeal}">
              <div class="relative h-48 overflow-hidden">
                <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.strCategory || "Meal"}</span>
                  <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.strArea || "Global"}</span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.strMeal}</h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">Delicious recipe to try!</p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${meal.strCategory || "Category"}</span>
                  <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${meal.strArea || "Area"}</span>
                </div>
              </div>
            </div>`;
  }

  recipesGrid.innerHTML = box;
  if (recipesCount) recipesCount.textContent = `Showing ${meals.length} recipes`;

  const recipeCards = document.querySelectorAll(".recipe-card");
  for (let k = 0; k < recipeCards.length; k++) {
    recipeCards[k].addEventListener("click", (e) => {
      const mealId = e.currentTarget.getAttribute("data-meal-id");
      getMealDetails(mealId);
    });
  }
}

function filterMealsByCategory(category) {
  const xhr = new XMLHttpRequest();
  const url = `${MEALS_API_BASE}filter.php?c=${category}`;
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      mealsList = (data.meals || []).slice(0, 25);
      displayMeals(mealsList);
    }
  };
  xhr.send();
}

function searchMeals(query) {
  if (!query) {
    getInitialMeals();
    return;
  }
  const xhr = new XMLHttpRequest();
  const url = `${MEALS_API_BASE}search.php?s=${query}`;
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      mealsList = (data.meals || []).slice(0, 25);
      displayMeals(mealsList);
    }
  };
  xhr.send();
}

function getMealDetails(mealId) {
  const xhr = new XMLHttpRequest();
  const url = `${MEALS_API_BASE}lookup.php?i=${mealId}`;
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      if (data.meals && data.meals[0]) {
        displayMealDetails(data.meals[0]);
      }
    }
  };
  xhr.send();
}

function displayMealDetails(meal) {
  currentMealDetail = meal;

  if (searchFiltersSection) searchFiltersSection.classList.add("hidden");
  if (mealCategoriesSection) mealCategoriesSection.classList.add("hidden");
  if (allRecipesSection) allRecipesSection.classList.add("hidden");
  if (mealDetailsSection) mealDetailsSection.classList.remove("hidden");

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients.push({ ingredient: ing.trim(), measure: meas ? meas.trim() : "" });
    }
  }

  let youtubeEmbedUrl = "";
  if (meal.strYoutube) {
    const videoId = meal.strYoutube.split("v=")[1];
    if (videoId) {
      const cleanId = videoId.split("&")[0];
      youtubeEmbedUrl = `https://www.youtube.com/embed/${cleanId}`;
    }
  }

  const calories = Math.floor(Math.random() * 200) + 350;
  const protein = Math.floor(Math.random() * 20) + 20;
  const carbs = Math.floor(Math.random() * 30) + 30;
  const fat = Math.floor(Math.random() * 10) + 5;

  meal.calculatedNutrition = { calories, protein, carbs, fat };

  let box = `
    <div class="max-w-7xl mx-auto">
      <button id="back-to-meals-btn-inner" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
        <i class="fa-solid fa-arrow-left"></i><span>Back to Recipes</span>
      </button>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div class="relative h-80 md:h-96">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <div class="flex items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.strCategory}</span>
              <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.strArea}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${meal.strMeal}</h1>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 mb-8">
        <button id="log-meal-btn-inner" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
          <i class="fa-solid fa-clipboard-list"></i><span>Log This Meal</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-list-check text-emerald-600"></i> Ingredients (${ingredients.length})
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${ingredients
                .map(
                  (item) => `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <i class="fa-solid fa-check text-emerald-600"></i>
                  <span class="text-gray-700"><span class="font-medium text-gray-900">${item.measure}</span> ${item.ingredient}</span>
                </div>`,
                )
                .join("")}
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-shoe-prints text-emerald-600"></i> Instructions
            </h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">${meal.strInstructions}</p>
          </div>

          ${
            youtubeEmbedUrl
              ? `
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-video text-red-500"></i> Video Tutorial
            </h2>
            <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <iframe src="${youtubeEmbedUrl}" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>`
              : ""
          }
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-chart-pie text-emerald-600"></i> Nutrition Facts
            </h2>
            <div class="text-center py-4 mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <p class="text-sm text-gray-600">Calories per serving</p>
              <p class="text-4xl font-bold text-emerald-600">${calories}</p>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between"><span class="text-gray-700">Protein</span><span class="font-bold">${protein}g</span></div>
              <div class="flex justify-between"><span class="text-gray-700">Carbs</span><span class="font-bold">${carbs}g</span></div>
              <div class="flex justify-between"><span class="text-gray-700">Fat</span><span class="font-bold">${fat}g</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  mealDetailsSection.innerHTML = box;

  document.getElementById("back-to-meals-btn-inner").addEventListener("click", () => {
    switchTab("meals");
  });
  document.getElementById("log-meal-btn-inner").addEventListener("click", () => {
    logItemToFoodLog(currentMealDetail);
  });
}

function searchProducts(query) {
  const xhr = new XMLHttpRequest();
  const url = `${FOOD_OFF_BASE}?search_terms=${query}&search_simple=1&action=process&json=1&page_size=12`;
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      productsList = data.products || [];
      displayProducts(productsList);
    }
  };
  xhr.send();
}

function lookupBarcode(barcode) {
  const xhr = new XMLHttpRequest();
  const url = `${BARCODE_OFF_BASE}${barcode}.json`;
  xhr.open("GET", url, true);

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      if (data.status === 1 && data.product) {
        productsList = [data.product];
        displayProducts(productsList);
      } else {
        Swal.fire({
          icon: "error",
          title: "Product Not Found",
          text: `No product found matching barcode ${barcode}`,
        });
      }
    }
  };
  xhr.send();
}

function filterProductsByNutriScore(grade, activeBtn) {
  for (let i = 0; i < nutriScoreFilters.length; i++) {
    nutriScoreFilters[i].classList.remove("bg-emerald-600", "text-white");
  }
  if (activeBtn) activeBtn.classList.add("bg-emerald-600", "text-white");

  if (!grade) {
    displayProducts(productsList);
    return;
  }

  const filtered = productsList.filter((p) => p.nutrition_grades && p.nutrition_grades.toLowerCase() === grade.toLowerCase());
  displayProducts(filtered);
}

function displayProducts(products) {
  if (!productsGrid) return;
  let box = "";

  if (!products || products.length === 0) {
    productsGrid.innerHTML = `<div class="col-span-4 text-center py-12 text-gray-500">
                                <i class="fa-solid fa-barcode text-4xl mb-3 text-emerald-500"></i>
                                <p class="font-medium text-lg">No products found!</p>
                              </div>`;
    if (productsCount) productsCount.textContent = "0 products found";
    return;
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const name = p.product_name || "Unknown Product";
    const brand = p.brands || "Generic";
    const img = p.image_front_small_url || p.image_url || "./src/images/favicon.png";
    const grade = p.nutrition_grades ? p.nutrition_grades.toUpperCase() : "N/A";
    const nutriments = p.nutriments || {};
    const cals = Math.round(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0);
    const protein = Math.round(nutriments.proteins_100g || 0);
    const carbs = Math.round(nutriments.carbohydrates_100g || 0);
    const fat = Math.round(nutriments.fat_100g || 0);

    box += `
      <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all p-4 border border-gray-100 flex flex-col justify-between" data-index="${i}">
        <div>
          <div class="relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg mb-3">
            <img class="w-full h-full object-contain" src="${img}" alt="${name}" />
            <span class="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">Grade ${grade}</span>
          </div>
          <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${brand}</p>
          <h3 class="font-bold text-gray-900 mb-2 line-clamp-1">${name}</h3>
          <div class="grid grid-cols-4 gap-1 text-center mb-3">
            <div class="bg-emerald-50 rounded p-1"><p class="text-xs font-bold text-emerald-700">${cals}</p><p class="text-[10px] text-gray-500">kcal</p></div>
            <div class="bg-blue-50 rounded p-1"><p class="text-xs font-bold text-blue-700">${protein}g</p><p class="text-[10px] text-gray-500">Prot</p></div>
            <div class="bg-amber-50 rounded p-1"><p class="text-xs font-bold text-amber-700">${carbs}g</p><p class="text-[10px] text-gray-500">Carb</p></div>
            <div class="bg-purple-50 rounded p-1"><p class="text-xs font-bold text-purple-700">${fat}g</p><p class="text-[10px] text-gray-500">Fat</p></div>
          </div>
        </div>
        <button class="add-product-log-btn w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-plus"></i> Add to Log
        </button>
      </div>`;
  }

  productsGrid.innerHTML = box;
  if (productsCount) productsCount.textContent = `Showing ${products.length} products`;

  const addBtns = document.querySelectorAll(".add-product-log-btn");
  for (let j = 0; j < addBtns.length; j++) {
    addBtns[j].addEventListener("click", (e) => {
      const cardIndex = e.currentTarget.closest(".product-card").getAttribute("data-index");
      const product = products[cardIndex];
      logItemToFoodLog(product, true);
    });
  }
}

function logItemToFoodLog(item, isProduct = false) {
  let logEntry = {};

  if (isProduct) {
    const nutriments = item.nutriments || {};
    logEntry = {
      id: Date.now(),
      name: item.product_name || "Product Item",
      type: "Product",
      calories: Math.round(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0),
      protein: Math.round(nutriments.proteins_100g || 0),
      carbs: Math.round(nutriments.carbohydrates_100g || 0),
      fat: Math.round(nutriments.fat_100g || 0),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  } else {
    const nut = item.calculatedNutrition || { calories: 450, protein: 30, carbs: 45, fat: 12 };
    logEntry = {
      id: Date.now(),
      name: item.strMeal || "Meal Recipe",
      type: "Meal",
      calories: nut.calories,
      protein: nut.protein,
      carbs: nut.carbs,
      fat: nut.fat,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }

  foodLogList.push(logEntry);
  localStorage.setItem("FoodLogList", JSON.stringify(foodLogList));

  Swal.fire({
    icon: "success",
    title: "Logged Successfully!",
    text: `${logEntry.name} has been added to your Food Log.`,
    timer: 1500,
    showConfirmButton: false,
  });

  displayFoodLog();
}

function deleteFoodLogItem(index) {
  foodLogList.splice(index, 1);
  localStorage.setItem("FoodLogList", JSON.stringify(foodLogList));
  displayFoodLog();
}

function clearFoodLog() {
  Swal.fire({
    title: "Clear Food Log?",
    text: "Are you sure you want to remove all logged items?",
    icon: "warning",
    showCancelButton: true,
    confirmColor: "#ef4444",
    confirmButtonText: "Yes, clear it!",
  }).then((result) => {
    if (result.isConfirmed) {
      foodLogList = [];
      localStorage.setItem("FoodLogList", JSON.stringify(foodLogList));
      displayFoodLog();
    }
  });
}

function displayFoodLog() {
  if (!loggedItemsList) return;

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  let box = "";

  if (foodLogList.length === 0) {
    loggedItemsList.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page or scan products</p>
      </div>`;
    if (clearFoodlogBtn) clearFoodlogBtn.style.display = "none";
  } else {
    if (clearFoodlogBtn) clearFoodlogBtn.style.display = "inline-block";

    for (let i = 0; i < foodLogList.length; i++) {
      const item = foodLogList[i];
      totalCalories += item.calories;
      totalProtein += item.protein;
      totalCarbs += item.carbs;
      totalFat += item.fat;

      box += `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg ${item.type === "Meal" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"} flex items-center justify-center font-bold">
              <i class="fa-solid ${item.type === "Meal" ? "fa-utensils" : "fa-barcode"}"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900">${item.name}</h4>
              <p class="text-xs text-gray-500">${item.type} • ${item.time}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="font-bold text-emerald-600">${item.calories} kcal</span>
              <p class="text-xs text-gray-500">P:${item.protein}g | C:${item.carbs}g | F:${item.fat}g</p>
            </div>
            <button class="delete-log-btn text-gray-400 hover:text-red-500 p-2" data-index="${i}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>`;
    }
    loggedItemsList.innerHTML = box;

    const deleteBtns = document.querySelectorAll(".delete-log-btn");
    for (let j = 0; j < deleteBtns.length; j++) {
      deleteBtns[j].addEventListener("click", (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        deleteFoodLogItem(index);
      });
    }
  }

  updateProgressBars(totalCalories, totalProtein, totalCarbs, totalFat);
}

function updateProgressBars(cals, prot, carbs, fat) {
  const calPercent = Math.min(Math.round((cals / dailyGoals.calories) * 100), 100);
  const protPercent = Math.min(Math.round((prot / dailyGoals.protein) * 100), 100);
  const carbsPercent = Math.min(Math.round((carbs / dailyGoals.carbs) * 100), 100);
  const fatPercent = Math.min(Math.round((fat / dailyGoals.fat) * 100), 100);

  const todaySection = document.getElementById("foodlog-today-section");
  if (!todaySection) return;

  const progressContainers = todaySection.querySelectorAll(".grid > div");
  if (progressContainers.length >= 4) {
    progressContainers[0].querySelector("span:nth-child(2)").textContent = `${cals} / ${dailyGoals.calories} kcal`;
    progressContainers[0].querySelector("div > div").style.width = `${calPercent}%`;

    progressContainers[1].querySelector("span:nth-child(2)").textContent = `${prot} / ${dailyGoals.protein} g`;
    progressContainers[1].querySelector("div > div").style.width = `${protPercent}%`;

    progressContainers[2].querySelector("span:nth-child(2)").textContent = `${carbs} / ${dailyGoals.carbs} g`;
    progressContainers[2].querySelector("div > div").style.width = `${carbsPercent}%`;

    progressContainers[3].querySelector("span:nth-child(2)").textContent = `${fat} / ${dailyGoals.fat} g`;
    progressContainers[3].querySelector("div > div").style.width = `${fatPercent}%`;
  }
}

function setupEventListeners() {
  if (headerMenuBtn) {
    headerMenuBtn.addEventListener("click", () => toggleSidebar(true));
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", () => toggleSidebar(false));
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => toggleSidebar(false));
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchMeals(e.target.value);
    });
  }

  if (backToMealsBtn) {
    backToMealsBtn.addEventListener("click", () => {
      switchTab("meals");
    });
  }

  if (logMealBtn) {
    logMealBtn.addEventListener("click", () => {
      if (currentMealDetail) {
        logItemToFoodLog(currentMealDetail);
      }
    });
  }

  if (searchProductBtn) {
    searchProductBtn.addEventListener("click", () => {
      const query = productSearchInput ? productSearchInput.value.trim() : "";
      if (query) searchProducts(query);
    });
  }

  if (productSearchInput) {
    productSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = e.target.value.trim();
        if (query) searchProducts(query);
      }
    });
  }

  if (lookupBarcodeBtn) {
    lookupBarcodeBtn.addEventListener("click", () => {
      const barcode = barcodeInput ? barcodeInput.value.trim() : "";
      if (barcode) lookupBarcode(barcode);
    });
  }

  for (let i = 0; i < nutriScoreFilters.length; i++) {
    nutriScoreFilters[i].addEventListener("click", (e) => {
      const grade = e.currentTarget.getAttribute("data-grade");
      filterProductsByNutriScore(grade, e.currentTarget);
    });
  }

  if (clearFoodlogBtn) {
    clearFoodlogBtn.addEventListener("click", () => {
      clearFoodLog();
    });
  }

  window.addEventListener("popstate", () => {
    const currentHash = window.location.hash.replace("#", "") || "meals";
    switchTab(currentHash);
  });
}

function initApp() {
  setupEventListeners();
  setupNavigation();
  loadInitialData();
  displayFoodLog();
  displayCurrentDate();

  const currentHash = window.location.hash.replace("#", "") || "meals";
  switchTab(currentHash);

  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.classList.add("opacity-0");
      setTimeout(() => {
        loadingOverlay.classList.add("hidden");
      }, 500);
    }, 300);
  }
}

document.addEventListener("DOMContentLoaded", initApp);
