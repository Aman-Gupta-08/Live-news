module.exports = async (req, res) => {
    const { type, category, q } = req.query;
    const apiKey = process.env.API_KEY || "c5e861e61d134d1c875aff9199c7e446";

    // Set CORS headers so it can be called from client-side
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    let url = "";
    if (type === "everything") {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${apiKey}`;
    } else {
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${category || 'general'}&apiKey=${apiKey}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || `NewsAPI returned status ${response.status}`
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message || "Failed to fetch news from NewsAPI" });
    }
};
