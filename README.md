# Live News Feed

This project is a simple live news application powered by NewsAPI. It is written using plain HTML, CSS, JavaScript (Frontend), and a minimal Express server (Backend) acting as a secure proxy to store and hide your API key.

## Project Structure

```
live-news-feed
├── index.html        # HTML structure of the news application
├── styles.css        # Styles for the frontend
├── main.js           # Minimal JavaScript code for fetching and displaying news
├── server.js         # Entry point for the backend proxy application
├── package.json      # Dependencies and scripts
├── .env              # Environment variables (API key)
├── .env.example      # Template for the .env file
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Setup Instructions

1. **Navigate to the repository:**
   ```bash
   cd live-news-feed
   ```

2. **Set up the application:**
   - Install the dependencies in the project root:
     ```bash
     npm install
     ```

   - Make sure your `.env` file exists in the root and contains your NewsAPI key (based on `.env.example`):
     ```
     API_KEY=your_api_key_here
     ```

   - Start the server:
     ```bash
     npm start
     ```

3. **View the application:**
   - Open your browser and navigate to `http://localhost:3001` to view the application.
   - Alternatively, you can also open `index.html` directly in your web browser (via the `file://` protocol) while the server runs in the background.

## Features

- **Category Navigation**: Instantly filter news by general, technology, business, science, health, sports, or entertainment.
- **Topic Search**: Search for articles matching any specific keyword/topic.
- **Robust UI**: Modern dark theme design with loaders, error messages, and empty states.