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
