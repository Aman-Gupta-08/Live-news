let API_KEY = "";

const newsContainer = document.getElementById("newsContainer");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const activeSearchTag = document.getElementById("activeSearchTag");
const activeSearchValue = document.getElementById("activeSearchValue");
const clearSearchBtn = document.getElementById("clearSearch");
const categoryPills = document.querySelectorAll(".category-pill");

let currentCategory = "general";

// Fetch Helper
async function fetchNews(url, errorMsg) {
    loader.style.display = "flex";
    newsContainer.innerHTML = "";
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(errorMsg);
        const data = await res.json();
        displayNews(data.articles);
    } catch (err) {
        newsContainer.innerHTML = `
            <div class="state-message error">
                <span class="state-emoji">⚠️</span>
                <h2>${escapeHTML(err.message)}</h2>
                <p>Please try again later.</p>
            </div>`;
    } finally {
        loader.style.display = "none";
    }
}
