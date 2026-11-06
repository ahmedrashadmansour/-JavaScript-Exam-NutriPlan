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

//---------

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

// Styling Functions

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
