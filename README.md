# CareerCompass

An interactive career/vocational quiz that matches users to academic programs based on their interests, goals, and preferences. Zero dependencies — built with vanilla JavaScript.

## Features

- **8-question adaptive quiz** — Covers interests, work style, career goals, and preferences
- **Weighted matching algorithm** — Scores programs based on multi-dimensional compatibility
- **Career outlook data** — Shows real job roles, salaries, and market growth per program
- **PDF export** — Download your personalized results
- **Email results** — Share recommendations via email
- **Star rating feedback** — Built-in user experience rating
- **Fully accessible** — ARIA labels, keyboard navigation, screen reader support
- **Responsive design** — Works on desktop, tablet, and mobile

## Quick Start

```bash
# Clone the repo
git clone https://github.com/VictorLavalle/CareerCompass.git
cd CareerCompass

# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser.

## Architecture

```
CareerCompass/
├── index.html              # Entry point
├── package.json            # Project metadata & scripts
├── assets/
│   └── styles.css          # All styles
└── src/
    ├── app.js              # Main orchestrator
    ├── data/
    │   ├── career-data.js  # Career outlook per program
    │   ├── data-programs.js# Program catalog
    │   └── data-courses.js # Course catalog
    └── modules/
        ├── quiz-engine.js  # Question flow & state management
        ├── matching.js     # Scoring algorithm
        ├── ui-renderer.js  # DOM rendering & animations
        ├── results-export.js # PDF & email export
        └── api-client.js   # Data fetching layer
```

**No build step required.** All modules use the revealing module pattern via IIFEs on a shared `window.CareerCompass` namespace.

## How It Works

1. User answers 8 multiple-choice questions
2. Each answer carries weighted scores mapped to program dimensions
3. The matching algorithm calculates compatibility percentages
4. Results are ranked and displayed with career outlook data
5. Users can export results as PDF or send via email

## Customization

To adapt for your own institution or use case:

1. **Programs** — Edit `data-programs.js` with your program catalog
2. **Courses** — Edit `data-courses.js` with course offerings
3. **Questions** — Modify questions in `quiz-engine.js`
4. **Career Data** — Update `career-data.js` with relevant roles
5. **Branding** — Replace `logo.png` and update colors in `styles.css`

## License

MIT

## Author

**Victor Lavalle** — [victorlavalle.me](https://victorlavalle.me) | [GitHub](https://github.com/VictorLavalle)
