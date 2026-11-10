# Gla Shutter Hero Slider

![Gla Shutter Hero Slider Preview](preview.jpg)

> An ultra-fast, lightweight (<8kB), and modern fullscreen hero slider component with a cinematic shutter reveal transition and parallax depth effect. Built with **100% pure Vanilla JavaScript and native CSS**.

[![Dependency Free](https://img.shields.io/badge/dependencies-none-success.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow.svg)](#)
[![CSS3 / HTML5](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3-orange.svg)](#)

---

## 🚀 Live Demo

Check out the interactive live demo deployed on Netlify:  
👉 **[View Live Demo](https://gla-hero-shutter-slider.netlify.app)**

---

## ✨ Key Features

* **100% Dependency-Free:** Zero jQuery, Zero Swiper.js, Zero external libraries required.
* **Blazing Fast (<8kB total weight):** Minimal execution footprint, DOM loaded in sub-150ms.
* **Cinematic Shutter Reveal Effect:** Smooth `clip-path` CSS transitions between slide switches.
* **Scroll-Driven Parallax Depth:** Adds immersive visual depth as the user scrolls.
* **JSON-Driven Architecture:** Effortlessly update titles, topics, colors, links, and buttons via `slides.json`.
* **Fully Responsive & Touch Friendly:** Optimized for seamless performance on mobile, tablet, and desktop viewports.
* **Clean Codebase:** Minified and unminified source code included for easy integration.

---

## 📁 Project Structure

```text
gla-shutter-hero-slider/
├── README.md               # GitHub Landing Page
├── LICENSE                 # MIT License File
├── .gitignore              # Git Ignore Rules
├── preview.jpg             # Repository Banner Image
├── README.txt
├── Documentation/
│   └── index.html          # Comprehensive HTML Setup Guide
└── Main-Files/
    ├── index.html          # Interactive Showcase Landing Page
    └── assets/
        ├── css/
        │   ├── style.css   # Source CSS (Unminified)
        │   └── style.min.css
        ├── js/
        │   ├── script.js  # Core JS Engine (Unminified)
        │   └── script.min.js
        ├── json/
        │   └── slides.json # Central Configuration
        └── images/
            ├── logo.png
            ├── img1.jpg
            └── img2.jpg
```

---

## 🛠️ Quick Start Guide

### 1. Embed Files
Include the CSS in your `<head>` and JS before the closing `</body>` tag:

```html
<!-- Stylesheet -->
<link rel="stylesheet" href="assets/css/style.min.css">

<!-- Script -->
<script src="assets/js/script.min.js" defer></script>
```

### 2. Configure Slides (`assets/json/slides.json`)
Manage your slide content easily without altering the JavaScript logic:

```json
[
  {
    "author": "AUTHOR 1",
    "title": "TITLE 1",
    "topic": "TOPIC 1",
    "description": "Discover premium web components built with pure HTML, CSS, and modern JavaScript.",
    "bgImage": "assets/images/img1.jpg"
  }
]
```

---

## 📄 Documentation

For full custom styling, API reference, and step-by-step installation options, open `Documentation/index.html` in your browser.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Created with ❤️ by **WebDevGLa***