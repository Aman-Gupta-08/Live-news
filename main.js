let API_KEY = "";
let useProxy = true; // Default to proxy on deployment

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
async function fetchNews(urlPath, queryParams, errorMsg) {
    loader.style.display = "flex";
    newsContainer.innerHTML = "";
    
    let url = "";
    if (useProxy) {
        // Use Vercel Serverless Function proxy
        const searchParams = new URLSearchParams(queryParams);
        searchParams.append("type", urlPath);
        url = `/api/news?${searchParams.toString()}`;
    } else {
        // Query NewsAPI directly
        const searchParams = new URLSearchParams({ ...queryParams, apiKey: API_KEY });
        url = `https://newsapi.org/v2/${urlPath}?${searchParams.toString()}`;
    }

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

const getNews = (category = "general") => fetchNews("top-headlines", { category }, "Failed to fetch news");
const searchNews = (query) => fetchNews("everything", { q: query }, "Search failed");

// Render
function displayNews(articles) {
    const validArticles = (articles || []).filter(a => a.title !== "[Removed]");
    if (validArticles.length === 0) {
        newsContainer.innerHTML = `
            <div class="state-message">
                <span class="state-emoji">📭</span>
                <h2>No News Found</h2>
                <p>Try a different topic or category.</p>
            </div>`;
        return;
    }

    newsContainer.innerHTML = validArticles.map(article => {
        const imgSrc = article.urlToImage || "https://placehold.co/640x360/1e1e2a/6c5ce7?text=No+Image";
        const description = article.description || "No description available.";
        const sourceName = article.source?.name || "Unknown";
        return `
            <div class="card">
                <div class="card-image-wrapper">
                    <img src="${imgSrc}" alt="${escapeHTML(article.title)}" loading="lazy"
                         onerror="this.src='https://placehold.co/640x360/1e1e2a/6c5ce7?text=No+Image'">
                </div>
                <div class="card-content">
                    <h3>${escapeHTML(article.title)}</h3>
                    <p class="card-description">${escapeHTML(description)}</p>
                    <div class="card-footer">
                        <span class="card-source">${escapeHTML(sourceName)}</span>
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="card-link">Read</a>
                    </div>
                </div>
            </div>`;
    }).join("");
}

// Search Actions
const performSearch = () => {
    const query = searchInput.value.trim();
    if (!query) return searchInput.focus();
    categoryPills.forEach(p => p.classList.remove("active"));
    activeSearchTag.style.display = "flex";
    activeSearchValue.textContent = query;
    searchNews(query);
};

const clearActiveSearch = (refetch) => {
    searchInput.value = activeSearchValue.textContent = "";
    activeSearchTag.style.display = "none";
    if (refetch) {
        categoryPills.forEach(p => p.classList.toggle("active", p.dataset.category === currentCategory));
        getNews(currentCategory);
    }
};

// Listeners
categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
        categoryPills.forEach(p => p.classList.toggle("active", p === pill));
        currentCategory = pill.dataset.category;
        clearActiveSearch(false);
        getNews(currentCategory);
    });
});

searchBtn.addEventListener("click", performSearch);
searchInput.addEventListener("keydown", e => e.key === "Enter" && performSearch());
clearSearchBtn.addEventListener("click", () => clearActiveSearch(true));

// Helper & Init
const escapeHTML = str => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
};

// Load Env and Init App
(async function initApp() {
    const isLocal = window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.protocol === "file:";

    if (isLocal) {
        try {
            const res = await fetch('.env');
            if (res.ok) {
                const text = await res.text();
                const match = text.match(/API_KEY=(.*)/);
                if (match) {
                    API_KEY = match[1].trim();
                    useProxy = false; // We have a local API Key, we can query NewsAPI directly
                }
            }
        } catch (e) {
            console.log("Could not load local .env, falling back to Vercel API proxy", e);
        }
    }
    
    getNews();
})();

